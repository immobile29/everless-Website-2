/* Repertuaari: välilehdet, haku ja 30 s esikuuntelu (Apple iTunes Search API) */
(function () {
  var E = window.Everless;
  var cfg = window.EVERLESS_CONFIG.previews || {};
  var data = window.EVERLESS_SONGS;
  var GENRES = ["pop", "rock", "country"];

  var songs = [];
  GENRES.forEach(function (g) {
    (data[g] || []).forEach(function (s) {
      songs.push(Object.assign({ genre: g, key: s.artist + "|" + s.title }, s));
    });
  });

  var state = { genre: "all", query: "" };
  var tabsEl = document.getElementById("rep-tabs");
  var listEl = document.getElementById("song-list");
  var countEl = document.getElementById("rep-count");
  var searchEl = document.getElementById("rep-search");

  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>';
  var SPIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a8 8 0 1 0 8 8h-2.5A5.5 5.5 0 1 1 12 6.5z"/></svg>';

  /* ---------- Haku ja suodatus ---------- */
  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[’'`]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  }

  function visible() {
    var q = norm(state.query);
    return songs.filter(function (s) {
      if (state.genre !== "all" && s.genre !== state.genre) return false;
      return !q || norm(s.artist + " " + s.title).indexOf(q) > -1;
    });
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    ["all"].concat(GENRES).forEach(function (g) {
      var n = g === "all" ? songs.length : (data[g] || []).length;
      var b = document.createElement("button");
      b.type = "button"; b.className = "tab"; b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", String(state.genre === g));
      b.dataset.genre = g;
      b.innerHTML = "";
      b.appendChild(document.createTextNode(g === "all" ? E.t("rep.all") : E.t("genres." + g + ".title")));
      var sm = document.createElement("small"); sm.textContent = n; b.appendChild(sm);
      tabsEl.appendChild(b);
    });
  }

  function renderList() {
    var list = visible();
    countEl.textContent = E.t("rep.count", { n: list.length });
    listEl.innerHTML = "";
    if (!list.length) {
      var li = document.createElement("li");
      li.className = "empty"; li.textContent = E.t("rep.empty");
      listEl.appendChild(li);
      return;
    }
    list.forEach(function (s) {
      var li = document.createElement("li");
      li.className = "song"; li.dataset.key = s.key;
      var info = document.createElement("div"); info.className = "song-info";
      var t = document.createElement("span"); t.className = "song-title"; t.textContent = s.title;
      var a = document.createElement("span"); a.className = "song-artist"; a.textContent = s.artist;
      info.appendChild(t); info.appendChild(a);
      li.appendChild(info);
      if (state.genre === "all") {
        var chip = document.createElement("span"); chip.className = "song-genre";
        chip.textContent = E.t("genres." + s.genre + ".title");
        li.appendChild(chip);
      }
      if (cfg.enabled !== false && !s.noPreview) {
        var btn = document.createElement("button");
        btn.type = "button"; btn.className = "play-btn";
        btn.innerHTML = PLAY;
        btn.setAttribute("aria-label", E.t("rep.play") + ": " + s.artist + " – " + s.title);
        li.appendChild(btn);
        var pr = document.createElement("div"); pr.className = "progress"; li.appendChild(pr);
        if (cache.get(s.key) === null) markUnavailable(li);
      }
      if (player.key === s.key) li.classList.add("playing");
      if (player.key === s.key && player.playing) setBtn(li, "pause");
      listEl.appendChild(li);
    });
  }

  /* ---------- Esikuuntelun haku ---------- */
  var cache = {
    ttl: 7 * 24 * 3600 * 1000,
    store: (function () { try { return JSON.parse(localStorage.getItem("everless-previews-v1")) || {}; } catch (e) { return {}; } })(),
    get: function (k) {
      var v = this.store[k];
      if (!v || Date.now() - v.t > this.ttl) return undefined;
      return v.u; // url tai null (ei löytynyt)
    },
    set: function (k, u) {
      this.store[k] = { u: u, t: Date.now() };
      try { localStorage.setItem("everless-previews-v1", JSON.stringify(this.store)); } catch (e) { /* ei haittaa */ }
    },
  };

  function mainTitle(title) {
    return norm(title.replace(/\(.*?\)/g, " ").replace(/\s-\s.*$/, "").replace(/\.\.\./g, " "));
  }
  function firstArtist(artist) {
    return norm(artist.split(/\s&\s|\sja\s|\sfeat\.?\s|,/i)[0]);
  }
  var BAD = /karaoke|tribute|made famous|originally performed|instrumental version|ringtone|lullaby|piano version/i;

  function pickPreview(song, results) {
    var title = mainTitle(song.title);
    var artist = firstArtist(song.artist);
    var wantsLive = /live|acoustic/i.test(song.title);
    var best = null, bestScore = 0;
    results.forEach(function (r, i) {
      if (!r.previewUrl) return;
      var name = r.trackName || "";
      if (BAD.test(name) || BAD.test(r.collectionName || "")) return;
      var tn = mainTitle(name);
      var titleOk = tn === title || (title.length > 3 && tn.indexOf(title) === 0) || (tn.length > 3 && title.indexOf(tn) === 0);
      if (!titleOk) return;
      var ra = norm(r.artistName || "");
      if (ra.indexOf(artist) < 0 && artist.indexOf(ra) < 0) return;
      var score = 10 - Math.min(i, 9) * 0.1;
      if (tn === title) score += 3;
      var live = /live|unplugged|acoustic/i.test(name + " " + (r.collectionName || ""));
      if (live && !wantsLive) score -= 2;
      if (!live && wantsLive) score -= 1;
      if (score > bestScore) { bestScore = score; best = r.previewUrl; }
    });
    return best;
  }

  var inflight = {};
  function getPreview(song) {
    if (song.previewUrl) return Promise.resolve(song.previewUrl);
    var c = cache.get(song.key);
    if (c !== undefined) return Promise.resolve(c);
    if (inflight[song.key]) return inflight[song.key];
    var q = song.q || (song.artist + " " + song.title.replace(/\(.*?\)/g, ""));
    var url = "https://itunes.apple.com/search?media=music&entity=song&limit=15&country=" +
      encodeURIComponent(cfg.country || "FI") + "&term=" + encodeURIComponent(q);
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
    inflight[song.key] = fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); return r.json(); })
      .then(function (j) {
        var u = pickPreview(song, j.results || []);
        cache.set(song.key, u); // myös "ei löytynyt" (null) tallennetaan
        return u;
      })
      .finally(function () { clearTimeout(timer); delete inflight[song.key]; });
    return inflight[song.key];
  }

  /* ---------- Soitin ---------- */
  var audio = new Audio();
  audio.preload = "none";
  var player = { key: null, playing: false };

  function rowFor(key) {
    var rows = listEl.querySelectorAll(".song");
    for (var i = 0; i < rows.length; i++) if (rows[i].dataset.key === key) return rows[i];
    return null;
  }
  function setBtn(row, mode, song) {
    var btn = row && row.querySelector(".play-btn");
    if (!btn) return;
    btn.classList.toggle("loading", mode === "loading");
    btn.innerHTML = mode === "pause" ? PAUSE : mode === "loading" ? SPIN : PLAY;
    var name = song ? song.artist + " – " + song.title : (row.querySelector(".song-artist").textContent + " – " + row.querySelector(".song-title").textContent);
    btn.setAttribute("aria-label", (mode === "pause" ? E.t("rep.pause") : mode === "loading" ? E.t("rep.loading") : E.t("rep.play")) + ": " + name);
  }
  function markUnavailable(row) {
    var btn = row.querySelector(".play-btn");
    if (!btn) return;
    btn.disabled = true; btn.classList.remove("loading");
    btn.innerHTML = PLAY;
    btn.title = E.t("rep.unavailable");
    btn.setAttribute("aria-label", E.t("rep.unavailable"));
  }
  function resetRows() {
    listEl.querySelectorAll(".song").forEach(function (r) {
      r.classList.remove("playing");
      var p = r.querySelector(".progress"); if (p) p.style.width = "0";
      if (!r.querySelector(".play-btn[disabled]")) setBtn(r, "play");
    });
  }
  function stop() {
    audio.pause();
    player.playing = false;
    resetRows();
  }

  audio.addEventListener("timeupdate", function () {
    var row = rowFor(player.key);
    var p = row && row.querySelector(".progress");
    if (p && audio.duration) p.style.width = (audio.currentTime / audio.duration * 100) + "%";
  });
  audio.addEventListener("ended", function () { player.key = null; stop(); });
  function toggle(song, row) {
    if (player.key === song.key && player.playing) { stop(); return; }
    if (player.key === song.key && !player.playing && audio.src) {
      audio.play(); player.playing = true; row.classList.add("playing"); setBtn(row, "pause", song); return;
    }
    stop();
    player.key = song.key; player.playing = false;
    row.classList.add("playing");
    setBtn(row, "loading", song);
    getPreview(song).then(function (u) {
      if (player.key !== song.key) return; // käyttäjä ehti valita toisen
      if (!u) { player.key = null; markUnavailable(rowFor(song.key) || row); row.classList.remove("playing"); return; }
      audio.src = u;
      return audio.play().then(function () {
        player.playing = true;
        var r = rowFor(song.key); if (r) { r.classList.add("playing"); setBtn(r, "pause", song); }
      });
    }).catch(function () {
      // Verkkovirhe tai estetty toisto: palautetaan painike ennalleen ilman virheilmoitusta
      if (player.key === song.key) { player.key = null; player.playing = false; }
      var r = rowFor(song.key); if (r) { r.classList.remove("playing"); setBtn(r, "play", song); }
    });
  }

  listEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".play-btn");
    if (!btn || btn.disabled) return;
    var row = btn.closest(".song");
    var song = songs.filter(function (s) { return s.key === row.dataset.key; })[0];
    if (song) toggle(song, row);
  });

  /* ---------- Tapahtumat ---------- */
  function selectGenre(g) {
    state.genre = g; state.query = ""; searchEl.value = "";
    renderTabs(); renderList();
  }
  E.selectGenre = selectGenre;

  tabsEl.addEventListener("click", function (e) {
    var b = e.target.closest(".tab");
    if (b) { state.genre = b.dataset.genre; renderTabs(); renderList(); }
  });
  searchEl.addEventListener("input", function () { state.query = searchEl.value; renderList(); });

  E.onLang(function () { renderTabs(); renderList(); });
})();
