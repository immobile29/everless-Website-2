/* Salasanaportti esikatselua varten (asetukset: data/site.config.js -> gate).
   HUOM: tämä on selaimessa toimiva portti eikä oikea suojaus. Se pitää satunnaiset vierailijat ulkona,
   mutta sivun tiedostot ovat teknisesti ladattavissa. Poista portti käytöstä julkaisun yhteydessä (enabled: false). */
(function () {
  var g = (window.EVERLESS_CONFIG || {}).gate;
  if (!g || !g.enabled) return;
  var KEY = "everless-unlocked";
  try { if (sessionStorage.getItem(KEY) === g.sha256) return; } catch (e) { /* jatka */ }
  if (!(window.crypto && crypto.subtle)) return; // esim. file:// ilman salattua yhteyttä: portti ohitetaan

  var root = document.documentElement;
  root.classList.add("locked");

  function sha256(text) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var fi = (navigator.language || "fi").toLowerCase().indexOf("fi") === 0;
    var d = document.createElement("div");
    d.className = "gate";
    d.innerHTML =
      '<form class="gate-box" autocomplete="off">' +
      '<span class="gate-brand">Everless</span>' +
      "<p>" + (fi ? "Sivusto on esikatselutilassa. Anna salasana jatkaaksesi." : "This site is in preview. Enter the password to continue.") + "</p>" +
      '<input type="password" aria-label="' + (fi ? "Salasana" : "Password") + '" placeholder="' + (fi ? "Salasana" : "Password") + '" required autofocus>' +
      '<button class="btn btn-block" type="submit">' + (fi ? "Avaa sivusto" : "Enter") + "</button>" +
      '<p class="gate-error" role="alert"></p></form>';
    document.body.appendChild(d);
    var form = d.querySelector("form"), input = d.querySelector("input"), err = d.querySelector(".gate-error");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      sha256(input.value).then(function (h) {
        if (h === g.sha256) {
          try { sessionStorage.setItem(KEY, h); } catch (x) { /* ei haittaa */ }
          root.classList.remove("locked");
          d.remove();
        } else {
          err.textContent = fi ? "Väärä salasana." : "Wrong password.";
          input.select();
        }
      });
    });
  });
})();
