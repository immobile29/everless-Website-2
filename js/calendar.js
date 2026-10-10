/* Varauskalenteri: varatut päivät (data/content.js) ja vähimmäisvaroaika (data/site.config.js) */
(function () {
  var E = window.Everless;
  var cfg = window.EVERLESS_CONFIG.booking;
  var booked = (window.EVERLESS_AVAILABILITY && window.EVERLESS_AVAILABILITY.booked) || [];
  var bookedSet = {};
  booked.forEach(function (d) { bookedSet[d] = true; });

  var titleEl = document.getElementById("cal-title");
  var weekEl = document.getElementById("cal-weekdays");
  var daysEl = document.getElementById("cal-days");
  var prevBtn = document.getElementById("cal-prev");
  var nextBtn = document.getElementById("cal-next");

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(y, m, d) { return y + "-" + pad(m + 1) + "-" + pad(d); }
  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function addMonths(date, n) {
    var y = date.getFullYear(), m = date.getMonth() + n, d = date.getDate();
    var last = new Date(y, m + 1, 0).getDate(); // kuukauden viimeinen päivä
    return new Date(y, m, Math.min(d, last));
  }

  var today = startOfDay(new Date());
  var minDate = addMonths(today, cfg.minLeadMonths);
  var minIso = iso(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
  var todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate());

  var view = { y: minDate.getFullYear(), m: minDate.getMonth() };
  var selected = null;

  function locale() { return E.getLang() === "fi" ? "fi-FI" : "en-GB"; }
  function longDate(isoStr) {
    var p = isoStr.split("-");
    return new Intl.DateTimeFormat(locale(), { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      .format(new Date(+p[0], +p[1] - 1, +p[2]));
  }

  function monthIndex(y, m) { return y * 12 + m; }
  var firstView = monthIndex(today.getFullYear(), today.getMonth());
  var lastView = firstView + cfg.maxMonthsAhead;

  function render() {
    var loc = locale();
    titleEl.textContent = new Intl.DateTimeFormat(loc, { month: "long", year: "numeric" }).format(new Date(view.y, view.m, 1));

    weekEl.innerHTML = "";
    for (var i = 0; i < 7; i++) {
      var s = document.createElement("span");
      s.textContent = new Intl.DateTimeFormat(loc, { weekday: "short" }).format(new Date(2024, 0, 1 + i)); // 1.1.2024 on maanantai
      weekEl.appendChild(s);
    }

    daysEl.innerHTML = "";
    var first = new Date(view.y, view.m, 1);
    var offset = (first.getDay() + 6) % 7; // maanantai = 0
    var count = new Date(view.y, view.m + 1, 0).getDate();
    for (var e = 0; e < offset; e++) {
      var blank = document.createElement("span");
      blank.className = "day empty-cell"; blank.setAttribute("aria-hidden", "true");
      daysEl.appendChild(blank);
    }
    for (var d = 1; d <= count; d++) {
      var key = iso(view.y, view.m, d);
      var status = "free";
      if (bookedSet[key]) status = "booked";
      else if (key < minIso) status = "soon";
      if (key === selected) status = "selected";

      var b = document.createElement("button");
      b.type = "button";
      b.className = "day " + status + (key === todayIso ? " today" : "");
      b.textContent = d;
      b.dataset.date = key;
      b.disabled = status === "booked" || status === "soon";
      b.setAttribute("aria-label", longDate(key) + ", " + E.t("cal.status." + status));
      if (status === "selected") b.setAttribute("aria-pressed", "true");
      daysEl.appendChild(b);
    }

    var idx = monthIndex(view.y, view.m);
    prevBtn.disabled = idx <= firstView;
    nextBtn.disabled = idx >= lastView;
  }

  function shift(n) {
    var idx = monthIndex(view.y, view.m) + n;
    if (idx < firstView || idx > lastView) return;
    view.y = Math.floor(idx / 12); view.m = idx % 12;
    render();
  }
  prevBtn.addEventListener("click", function () { shift(-1); });
  nextBtn.addEventListener("click", function () { shift(1); });

  function select(key) {
    selected = key;
    render();
    document.dispatchEvent(new CustomEvent("everless:date", { detail: { iso: key, label: key ? longDate(key) : "" } }));
  }
  daysEl.addEventListener("click", function (e) {
    var b = e.target.closest(".day");
    if (b && !b.disabled) select(b.dataset.date);
  });

  E.calendar = {
    clear: function () { select(null); },
    label: function () { return selected ? longDate(selected) : ""; },
    selected: function () { return selected; },
    isSelectable: function (key) { return !bookedSet[key] && key >= minIso; },
  };

  E.onLang(function () {
    render();
    if (selected) document.dispatchEvent(new CustomEvent("everless:date", { detail: { iso: selected, label: longDate(selected) } }));
  });
})();
