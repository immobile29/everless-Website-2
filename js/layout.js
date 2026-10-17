/* Yhteinen sivupohja: ylätunniste ja alatunniste kaikille sivuille.
   Sivun <header id="site-header"> ja <footer id="site-footer"> täytetään tässä. */
(function () {
  var cfg = window.EVERLESS_CONFIG;
  var page = document.body.dataset.page || "home";

  var LOGO =
    '<a class="logo" href="index.html" aria-label="Everless">' +
    '<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2l3.6 8.4 9.1.8-6.9 6 2.1 8.9L16 21.4 8.1 26.1l2.1-8.9-6.9-6 9.1-.8z" fill="currentColor"/></svg>' +
    '<span class="logo-word">Everless</span></a>';

  function cur(p) { return page === p ? ' aria-current="page"' : ""; }

  var header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML =
      '<div class="container header-inner">' + LOGO +
      '<nav class="main-nav" id="main-nav" aria-label="Päävalikko">' +
      '<a href="index.html"' + cur("home") + ' data-i18n="nav.home">Etusivu</a>' +
      '<a href="galleria.html"' + cur("gallery") + ' data-i18n="nav.gallery">Bändi & galleria</a>' +
      '<a href="keikat.html"' + cur("gigs") + ' data-i18n="nav.gigs">Aikaisemmat keikat</a>' +
      '<a href="repertuaari.html"' + cur("repertoire") + ' data-i18n="nav.repertoire">Repertuaari</a>' +
      '<a href="ehdot.html"' + cur("terms") + ' data-i18n="nav.terms">Ehdot</a>' +
      '<a class="btn btn-small nav-cta" href="index.html#book" data-i18n="nav.book">Pyydä tarjous</a>' +
      "</nav>" +
      '<div class="header-tools">' +
      '<div class="lang-switch" role="group" aria-label="Kieli">' +
      '<button type="button" data-lang="fi" aria-pressed="true">FI</button>' +
      '<button type="button" data-lang="en" aria-pressed="false">EN</button></div>' +
      '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" data-i18n-attr="aria-label:a11y.menu"><span></span><span></span><span></span></button>' +
      "</div></div>";

    var toggle = header.querySelector(".nav-toggle");
    var nav = header.querySelector("#main-nav");
    var closeNav = function () { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  }

  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML =
      '<div class="container footer-inner">' +
      "<div>" + LOGO + '<p class="footer-tagline" data-i18n="footer.tagline"></p></div>' +
      '<div class="footer-links"><h3 data-i18n="footer.pages">Sivut</h3><ul>' +
      '<li><a href="index.html" data-i18n="nav.home"></a></li>' +
      '<li><a href="ehdot.html" data-i18n="footer.terms"></a></li>' +
      '<li><a href="galleria.html" data-i18n="nav.gallery"></a></li>' +
      '<li><a href="keikat.html" data-i18n="nav.gigs"></a></li>' +
      '<li><a href="repertuaari.html" data-i18n="nav.repertoire"></a></li></ul></div>' +
      '<div class="footer-contact"><h3 data-i18n="footer.contact">Yhteystiedot</h3><ul>' +
      '<li><a href="mailto:' + cfg.contact.email + '">' + cfg.contact.email + "</a></li>" +
      '<li><a href="https://instagram.com/' + cfg.contact.instagram + '" target="_blank" rel="noopener">@' + cfg.contact.instagram + "</a></li>" +
      '<li data-i18n="footer.area"></li></ul></div></div>' +
      '<div class="container footer-bottom"><small data-i18n="footer.photos"></small>' +
      '<small>© ' + new Date().getFullYear() + ' Everless. <span data-i18n="footer.rights"></span></small></div>';
  }
})();
