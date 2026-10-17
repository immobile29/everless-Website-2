/* Yhteydenottolomake: validointi ja lähetys suoraan Everlessin sähköpostiin (FormSubmit.co).
   Päivävalitsimessa ei voi valita menneitä päiviä eikä liian lähellä olevia (booking.minLeadMonths). */
(function () {
  var E = window.Everless;
  var cfg = window.EVERLESS_CONFIG;
  var form = document.getElementById("booking-form");
  if (!form) return;
  var dateInput = document.getElementById("f-date");
  var dateHint = document.getElementById("date-hint");
  var status = document.getElementById("form-status");
  var submit = document.getElementById("form-submit");

  /* ---------- Päivämäärän alaraja ---------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function minDate() {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    var day = d.getDate();
    d.setMonth(d.getMonth() + (cfg.booking.minLeadMonths || 0));
    if (d.getDate() !== day) d.setDate(0); // esim. 31.1. + 1 kk -> kuun viimeinen päivä
    return d;
  }
  function readable(isoStr) {
    var p = isoStr.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(E.getLang() === "en" ? "en-GB" : "fi-FI", {
      day: "numeric", month: "long", year: "numeric",
    });
  }
  function applyMin() {
    var m = minDate();
    dateInput.min = iso(m);
    dateHint.textContent = E.t("form.dateHint", { min: readable(iso(m)) });
  }
  function dateOk() {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateInput.value) && dateInput.value >= dateInput.min;
  }

  /* Sääntöteksti, jossa sähköposti on linkki */
  function renderRule() {
    var a = '<a href="mailto:' + cfg.contact.email + '">' + cfg.contact.email + "</a>";
    document.getElementById("book-rule").innerHTML = E.t("book.rule", { email: a });
  }

  function setError(name, msg) {
    var p = form.querySelector('[data-error-for="' + name + '"]');
    if (!p) return;
    p.textContent = msg;
    var f = p.closest(".field"); if (f) f.classList.toggle("invalid", !!msg);
  }

  function validate() {
    var ok = true, firstBad = null;
    function bad(name, msg, el) { setError(name, msg); ok = false; if (!firstBad) firstBad = el; }
    ["date", "name", "email", "event_type", "location", "service", "consent"].forEach(function (n) { setError(n, ""); });

    if (!dateOk()) bad("date", E.t("form.err.date"), dateInput);
    ["name", "event_type", "location", "service"].forEach(function (n) {
      var el = form.elements[n];
      if (!el.value.trim()) bad(n, E.t("form.err.required"), el);
    });
    var em = form.elements.email;
    if (!em.value.trim()) bad("email", E.t("form.err.required"), em);
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) bad("email", E.t("form.err.email"), em);
    if (!form.elements.consent.checked) bad("consent", E.t("form.err.consent"), form.elements.consent);
    if (firstBad) firstBad.focus();
    return ok;
  }

  function label(selectName) {
    var s = form.elements[selectName];
    return s.options[s.selectedIndex].textContent;
  }

  function payload() {
    return {
      date: readable(dateInput.value) + " (" + dateInput.value + ")",
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim() || "-",
      event_type: label("event_type"),
      location: form.elements.location.value.trim(),
      service: label("service"),
      guests: form.elements.guests.value || "-",
      message: form.elements.message.value.trim() || "-",
      language: E.getLang(),
    };
  }

  function mailtoLink(p) {
    var lines = [
      E.t("form.date") + ": " + p.date,
      E.t("form.name") + ": " + p.name,
      E.t("form.email") + ": " + p.email,
      E.t("form.phone") + ": " + p.phone,
      E.t("form.eventType") + ": " + p.event_type,
      E.t("form.location") + ": " + p.location,
      E.t("form.service") + ": " + p.service,
      E.t("form.guests") + ": " + p.guests,
      "",
      p.message,
    ];
    return "mailto:" + cfg.contact.email +
      "?subject=" + encodeURIComponent(E.t("form.mail.subject", { date: p.date })) +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function showStatus(cls, html) { status.className = "form-status " + cls; status.innerHTML = html; }

  function success() {
    showStatus("ok", "<strong>" + E.t("form.ok.title") + "</strong>" + E.t("form.ok.text") +
      '<br><button type="button" class="btn btn-small" id="form-again">' + E.t("form.again") + "</button>");
    form.reset();
    document.getElementById("form-again").addEventListener("click", function () {
      status.className = "form-status"; status.innerHTML = ""; form.elements.name.focus();
    });
    status.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status"; status.innerHTML = "";
    if (form.elements._gotcha.value) return; // botti
    if (!validate()) return;
    var p = payload();
    var endpoint = (cfg.booking.formEndpoint || "").trim();

    if (!endpoint) { // varavaihtoehto: avaa sähköpostiohjelman
      window.location.href = mailtoLink(p);
      return;
    }

    submit.disabled = true;
    var original = submit.textContent;
    submit.textContent = E.t("form.sending");
    p._subject = E.t("form.mail.subject", { date: p.date });
    p._template = "table";
    p._captcha = "false";
    p._replyto = p.email;
    p._honey = "";
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(p),
    })
      .then(function (r) {
        if (!r.ok) throw new Error("http " + r.status);
        return r.json();
      })
      .then(function (j) {
        if (j && String(j.success) === "false") throw new Error(j.message || "failed");
        success();
      })
      .catch(function () { showStatus("err", E.t("form.fail")); })
      .finally(function () { submit.disabled = false; submit.textContent = original; });
  });

  // Virheet pois kun käyttäjä korjaa kenttää
  form.addEventListener("input", function (e) {
    if (e.target.name) setError(e.target.name, "");
  });

  E.onLang(function () {
    applyMin();
    renderRule();
    if (status.classList.contains("err")) showStatus("err", E.t("form.fail"));
  });
})();
