/* Kielenvaihto (FI/EN). Staattiset tekstit: data-i18n, data-i18n-html ja data-i18n-attr="attr:avain;attr2:avain2". */
(function () {
  var E = (window.Everless = window.Everless || {});
  var cfg = window.EVERLESS_CONFIG;
  var dict = window.EVERLESS_I18N;
  var LANGS = ["fi", "en"];
  var lang = cfg.defaultLang || "fi";
  var listeners = [];

  try {
    var saved = localStorage.getItem("everless-lang");
    if (LANGS.indexOf(saved) > -1) lang = saved;
  } catch (e) { /* localStorage ei käytössä */ }

  function totalSongs() {
    var s = window.EVERLESS_SONGS || {};
    return Object.keys(s).reduce(function (n, k) { return n + s[k].length; }, 0);
  }

  function tokens() {
    return {
      songs: totalSongs(),
      email: cfg.contact.email,
      area: cfg.contact.area[lang] || cfg.contact.area.fi,
      lead: leadText(),
    };
  }

  function leadText() {
    var n = cfg.booking.minLeadMonths;
    return t(n === 1 ? "book.lead.one" : "book.lead.many", { n: n }, true);
  }

  function interpolate(str, vars) {
    return str.replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? vars[k] : m; });
  }

  function t(key, vars, skipTokens) {
    var str = (dict[lang] && dict[lang][key]) || (dict.fi && dict.fi[key]) || key;
    var all = skipTokens ? vars : Object.assign({}, tokens(), vars);
    return interpolate(str, all);
  }

  function apply() {
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.dataset.i18nAttr.split(";").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    listeners.forEach(function (fn) { fn(lang); });
  }

  function setLang(l) {
    if (LANGS.indexOf(l) < 0) return;
    lang = l;
    try { localStorage.setItem("everless-lang", l); } catch (e) { /* ei haittaa */ }
    apply();
  }

  E.t = t;
  E.getLang = function () { return lang; };
  E.setLang = setLang;
  E.onLang = function (fn) { listeners.push(fn); };
  E.applyLang = apply;

  document.addEventListener("click", function (e) {
    var b = e.target.closest(".lang-switch button");
    if (b) setLang(b.dataset.lang);
  });
})();
