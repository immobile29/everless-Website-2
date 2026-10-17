/* Galleria ja lightbox */
(function () {
  var E = window.Everless;
  var items = window.EVERLESS_GALLERY || [];
  var grid = document.getElementById("gallery-grid");
  var box = document.getElementById("lightbox");
  var img = document.getElementById("lb-img");
  if (!grid || !box) return;
  var current = 0;
  var lastFocus = null;

  var featured = document.getElementById("gallery-featured");

  function render() {
    grid.innerHTML = "";
    if (featured) featured.innerHTML = "";
    items.forEach(function (it, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "gallery-item";
      b.setAttribute("aria-label", E.t("gallery.open") + ": " + E.t(it.alt));
      b.dataset.index = i;
      var im = document.createElement("img");
      var big = it.featured && featured;
      im.src = (big ? "assets/img/gallery/" : "assets/img/thumbs/") + it.id + ".webp";
      im.alt = E.t(it.alt);
      im.width = big ? it.w : Math.round(it.w * 0.4);
      im.height = big ? it.h : Math.round(it.h * 0.4);
      im.loading = big ? "eager" : "lazy";
      im.decoding = "async";
      b.appendChild(im);
      if (big) { b.classList.add("gallery-featured-item"); featured.appendChild(b); }
      else grid.appendChild(b);
    });
  }

  function show(i) {
    current = (i + items.length) % items.length;
    var it = items[current];
    img.src = "assets/img/gallery/" + it.id + ".webp";
    img.alt = E.t(it.alt);
    box.setAttribute("aria-label", E.t(it.alt));
    // Esilataa naapurikuvat
    [current + 1, current - 1].forEach(function (n) {
      var p = items[(n + items.length) % items.length];
      new Image().src = "assets/img/gallery/" + p.id + ".webp";
    });
  }

  function open(i) {
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.style.overflow = "hidden";
    show(i);
    box.querySelector(".lb-close").focus();
  }
  function close() {
    box.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  [grid, featured].forEach(function (c) {
    if (!c) return;
    c.addEventListener("click", function (e) {
      var b = e.target.closest(".gallery-item");
      if (b) open(+b.dataset.index);
    });
  });
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(current - 1);
    else if (e.key === "ArrowRight") show(current + 1);
  });

  // Pyyhkäisy kosketusnäytöllä
  var startX = null;
  box.addEventListener("touchstart", function (e) { startX = e.changedTouches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (startX == null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  }, { passive: true });

  E.onLang(function () {
    render();
    if (!box.hidden) show(current);
  });
})();
