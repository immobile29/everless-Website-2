/* Sivun yleinen logiikka: jäsenkortit, genret, videot, navigaatio ja alatunniste */
(function () {
  var E = window.Everless;
  var cfg = window.EVERLESS_CONFIG;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- Jäsenet ---------- */
  function memberCard(m) {
    var fig = el("figure", "member");
    var photo = el("div", "photo");
    var img = document.createElement("img");
    img.src = m.img; img.alt = m.name; img.width = 733; img.height = 1100;
    img.loading = "lazy"; img.decoding = "async";
    photo.appendChild(img);
    var cap = el("figcaption");
    cap.appendChild(el("span", "name", m.alias ? m.name + " (" + m.alias + ")" : m.name));
    cap.appendChild(el("span", "role", E.t(m.roleKey)));
    fig.appendChild(photo); fig.appendChild(cap);
    return fig;
  }
  function renderMembers() {
    var g = document.getElementById("member-grid");
    var d = document.getElementById("dj-grid");
    if (!g || !d) return;
    g.innerHTML = ""; d.innerHTML = "";
    window.EVERLESS_MEMBERS.forEach(function (m) { g.appendChild(memberCard(m)); });
    window.EVERLESS_DJS.forEach(function (m) { d.appendChild(memberCard(m)); });
  }

  /* ---------- Genret ---------- */
  function renderGenres() {
    var wrap = document.getElementById("genre-cards");
    if (!wrap) return;
    wrap.innerHTML = "";
    ["pop", "rock", "country"].forEach(function (g) {
      var n = (window.EVERLESS_SONGS[g] || []).length;
      var c = el("article", "card genre-card genre-" + g);
      var top = el("div", "genre-top");
      top.appendChild(el("h3", null, E.t("genres." + g + ".title")));
      top.appendChild(el("span", "count", E.t("genres.songs", { n: n })));
      var body = el("div", "genre-body");
      body.appendChild(el("p", null, E.t("genres." + g + ".text")));
      var a = el("a", null, E.t("genres.listen") + " →");
      a.href = "repertuaari.html?genre=" + g;
      body.appendChild(a);
      c.appendChild(top); c.appendChild(body);
      wrap.appendChild(c);
    });
  }

  /* ---------- Videot (YouTube, ladataan vasta klikattaessa) ---------- */
  var PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  function renderVideos() {
    var wrap = document.getElementById("video-grid");
    if (!wrap) return;
    wrap.innerHTML = "";
    window.EVERLESS_VIDEOS.forEach(function (v) {
      var card = el("article", "card video-card");
      var frame = el("div", "video-frame");
      if (v.youtubeId) {
        var poster = el("button", "poster");
        poster.type = "button";
        poster.setAttribute("aria-label", E.t("videos.play") + ": " + v.title);
        poster.innerHTML = '<img alt="" loading="lazy" src="https://i.ytimg.com/vi/' + v.youtubeId + '/hqdefault.jpg"><span class="play-badge">' + PLAY_SVG + "</span>";
        poster.addEventListener("click", function () {
          var f = document.createElement("iframe");
          f.src = "https://www.youtube-nocookie.com/embed/" + v.youtubeId + "?autoplay=1&rel=0";
          f.title = v.title;
          f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
          f.allowFullscreen = true;
          frame.replaceChild(f, poster);
        });
        frame.appendChild(poster);
      } else {
        var ph = el("div", "poster placeholder");
        ph.innerHTML = '<span class="soon">' + PLAY_SVG + "<span></span></span>";
        ph.querySelector("span span").textContent = E.t("videos.soon");
        frame.appendChild(ph);
      }
      var meta = el("div", "video-meta");
      meta.appendChild(el("div", "video-title", v.title));
      meta.appendChild(el("div", "video-artist", v.artist));
      card.appendChild(frame); card.appendChild(meta);
      wrap.appendChild(card);
    });
  }

  // Sivun kieliriippuvat osat piirretään aina kielen vaihtuessa
  E.onLang(function () { renderMembers(); renderGenres(); renderVideos(); });

  E.applyLang();
})();
