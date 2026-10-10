/* Yhteydenottolomake: validointi ja lähetys (Formspree tai mailto-varavaihtoehto) */
(function () {
  var E = window.Everless;
  var cfg = window.EVERLESS_CONFIG;
  var form = document.getElementById("booking-form");
  var dateInput = document.getElementById("f-date");
  var dateIso = document.getElementById("f-date-iso");
  var status = document.getElementById("form-status");
  var submit = document.getElementById("form-submit");

  /* Sääntöteksti, jossa sähköposti on linkki */
  function renderRule() {
    var a = '<a href="mailto:' + cfg.contact.email + '">' + cfg.contact.email + "</a>";
    document.getElementById("book-rule").innerHTML = E.t("book.rule", { email: a });
  }

  document.addEventListener("everless:date", function (e) {
    dateIso.value = e.detail.iso || "";
    dateInput.value = e.detail.label || "";
    if (e.detail.iso) setError("date", "");
  });
  // Klikkaus päiväkenttään vie kalenteriin
  dateInput.addEventListener("click", function () {
    document.getElementById("calendar").scrollIntoView({ behavior: "smooth", block: "center" });
  });

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

    if (!dateIso.value || !E.calendar.isSelectable(dateIso.value)) bad("date", E.t("form.err.date"), dateInput);
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
      date: dateIso.value,
      date_readable: dateInput.value,
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      event_type: label("event_type"),
      location: form.elements.location.value.trim(),
      service: label("service"),
      guests: form.elements.guests.value,
      message: form.elements.message.value.trim(),
      language: E.getLang(),
    };
  }

  function mailtoLink(p) {
    var lines = [
      E.t("form.date") + ": " + p.date_readable + " (" + p.date + ")",
      E.t("form.name") + ": " + p.name,
      E.t("form.email") + ": " + p.email,
      E.t("form.phone") + ": " + (p.phone || "-"),
      E.t("form.eventType") + ": " + p.event_type,
      E.t("form.location") + ": " + p.location,
      E.t("form.service") + ": " + p.service,
      E.t("form.guests") + ": " + (p.guests || "-"),
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
    E.calendar.clear();
    document.getElementById("form-again").addEventListener("click", function () {
      status.className = "form-status"; status.innerHTML = ""; dateInput.focus();
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

    if (!endpoint) {
      window.location.href = mailtoLink(p);
      showStatus("ok", E.t("form.mailto"));
      return;
    }

    submit.disabled = true;
    var original = submit.textContent;
    submit.textContent = E.t("form.sending");
    p._subject = E.t("form.mail.subject", { date: p.date });
    p._replyto = p.email;
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(p),
    })
      .then(function (r) { if (!r.ok) throw new Error("http " + r.status); success(); })
      .catch(function () { showStatus("err", E.t("form.fail")); })
      .finally(function () { submit.disabled = false; submit.textContent = original; });
  });

  // Virheet pois kun käyttäjä korjaa kenttää
  form.addEventListener("input", function (e) {
    var n = e.target.name;
    if (n) setError(n === "event_type" ? "event_type" : n, "");
  });

  E.onLang(function () {
    renderRule();
    if (status.classList.contains("err")) showStatus("err", E.t("form.fail"));
  });
})();
