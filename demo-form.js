/* demo-form.js — "Probeer gratis" opent een aanvraagformulier (modal).
 * De aanvraag wordt via Web3Forms doorgestuurd naar jeffrey@rumo.eu.
 * Het e-mailadres staat NIET in de code: enkel de access key hieronder,
 * die serverkant aan het adres gekoppeld is.
 *
 * ── TE DOEN vóór dit werkt ──
 * 1. Ga naar https://web3forms.com , vul jeffrey@rumo.eu in, je krijgt een
 *    access key gemaild (gratis, geen account nodig).
 * 2. Vervang ACCESS_KEY hieronder door die key.
 * Zolang de placeholder blijft staan, wordt er niets verstuurd.
 */
(function () {
  var ACCESS_KEY = '89ef2ee7-c622-4825-aaa2-caf9d2672327';

  var built = false, modal;

  function build() {
    if (built) return; built = true;

    var style = document.createElement('style');
    style.textContent =
      '#demo-modal{position:fixed;inset:0;z-index:2147483000;display:none;align-items:center;justify-content:center;padding:1.5rem;' +
      'background:rgba(27,25,23,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-family:Inter,-apple-system,sans-serif}' +
      '#demo-modal.open{display:flex}' +
      '#demo-modal .dm-card{position:relative;width:100%;max-width:31rem;max-height:92vh;overflow-y:auto;background:#F5EEE2;' +
      'border-radius:22px;padding:2.4rem 2.2rem;box-shadow:0 30px 70px -20px rgba(27,25,23,.5)}' +
      '#demo-modal .dm-close{position:absolute;top:1rem;right:1.1rem;border:none;background:transparent;cursor:pointer;' +
      'font-size:1.5rem;line-height:1;color:#8d8378;padding:.2rem}' +
      '#demo-modal .dm-close:hover{color:#1B1917}' +
      '#demo-modal .dm-kicker{font-family:"JetBrains Mono",monospace;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;' +
      'color:#8d8378;display:inline-flex;align-items:center;gap:.5em;margin-bottom:.9rem}' +
      '#demo-modal .dm-kicker::before{content:"";width:6px;height:6px;border-radius:50%;background:#D68F6F}' +
      '#demo-modal h3{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:1.9rem;letter-spacing:-.02em;line-height:1.05;color:#1B1917;margin:0 0 .7rem}' +
      '#demo-modal h3 em{font-style:italic;color:#b96b4a;font-weight:300}' +
      '#demo-modal .dm-sub{font-size:.98rem;line-height:1.55;color:#3a3531;margin:0 0 1.6rem}' +
      '#demo-modal label{display:block;font-size:.8rem;font-weight:500;color:#3a3531;margin:0 0 .35rem}' +
      '#demo-modal .dm-field{margin-bottom:1rem}' +
      '#demo-modal .dm-row{display:flex;gap:.8rem}' +
      '#demo-modal .dm-row .dm-field{flex:1}' +
      '#demo-modal input,#demo-modal textarea{width:100%;font-family:inherit;font-size:.95rem;color:#1B1917;background:#FAF5EA;' +
      'border:1px solid #1B191720;border-radius:12px;padding:.7rem .9rem;outline:none;transition:border-color .2s}' +
      '#demo-modal input:focus,#demo-modal textarea:focus{border-color:#D68F6F}' +
      '#demo-modal textarea{resize:vertical;min-height:70px}' +
      '#demo-modal .dm-submit{display:inline-flex;align-items:center;gap:.5em;width:100%;justify-content:center;margin-top:.4rem;' +
      'background:#1B1917;color:#F5EEE2;border:none;border-radius:100px;padding:.9rem 1.4rem;font-family:inherit;font-size:1rem;' +
      'font-weight:500;cursor:pointer;transition:background .2s}' +
      '#demo-modal .dm-submit:hover{background:#b96b4a}' +
      '#demo-modal .dm-submit[disabled]{opacity:.6;cursor:default}' +
      '#demo-modal .dm-fine{font-size:.78rem;color:#8d8378;margin:.9rem 0 0;text-align:center}' +
      '#demo-modal .dm-error{color:#b96b4a;font-size:.85rem;margin:.6rem 0 0;min-height:1em}' +
      '#demo-modal .dm-done{text-align:center;padding:1rem 0}' +
      '#demo-modal .dm-done h3{margin-bottom:.6rem}' +
      '#demo-modal .dm-done p{font-size:1rem;color:#3a3531;line-height:1.55;margin:0}' +
      '#demo-modal .dm-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}';
    document.head.appendChild(style);

    modal = document.createElement('div');
    modal.id = 'demo-modal';
    modal.innerHTML =
      '<div class="dm-card" role="dialog" aria-modal="true" aria-label="Probeer rumo gratis">' +
        '<button class="dm-close" type="button" aria-label="Sluiten">&times;</button>' +
        '<div class="dm-body">' +
          '<span class="dm-kicker">Zelf proberen</span>' +
          '<h3>Probeer rumo. <em>14 dagen</em>, gratis.</h3>' +
          '<p class="dm-sub">Laat je gegevens achter, dan zetten we een demo-omgeving vol nepreservaties voor je klaar. Geen creditcard, geen gedoe.</p>' +
          '<form class="dm-form">' +
            '<input type="checkbox" class="dm-hp" name="botcheck" tabindex="-1" autocomplete="off">' +
            '<div class="dm-field"><label>Je naam</label><input type="text" name="naam" required autocomplete="name"></div>' +
            '<div class="dm-row">' +
              '<div class="dm-field"><label>Hotel of B&amp;B</label><input type="text" name="hotel" autocomplete="organization"></div>' +
              '<div class="dm-field"><label>Aantal kamers</label><input type="number" name="kamers" min="1" inputmode="numeric"></div>' +
            '</div>' +
            '<div class="dm-field"><label>E-mailadres</label><input type="email" name="email" required autocomplete="email"></div>' +
            '<div class="dm-field"><label>Iets dat we moeten weten? <span style="color:#8d8378;font-weight:400">(optioneel)</span></label><textarea name="bericht"></textarea></div>' +
            '<button class="dm-submit" type="submit">Stuur mijn aanvraag <span>&rarr;</span></button>' +
            '<p class="dm-error"></p>' +
            '<p class="dm-fine">Geen creditcard. We gebruiken je gegevens enkel om je demo klaar te zetten.</p>' +
          '</form>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    modal.querySelector('.dm-close').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    modal.querySelector('.dm-form').addEventListener('submit', submit);
  }

  function open() {
    build();
    modal.classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    var first = modal.querySelector('input[name="naam"]');
    if (first) setTimeout(function () { first.focus(); }, 30);
  }
  function close() {
    if (!modal) return;
    modal.classList.remove('open');
    document.documentElement.style.overflow = '';
  }

  async function submit(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var err = form.querySelector('.dm-error');
    var btn = form.querySelector('.dm-submit');
    err.textContent = '';

    if (ACCESS_KEY === 'VERVANG_MET_WEB3FORMS_ACCESS_KEY') {
      err.textContent = 'Formulier nog niet geactiveerd (access key ontbreekt).';
      return;
    }

    var data = new FormData(form);
    data.append('access_key', ACCESS_KEY);
    data.append('subject', 'Nieuwe rumo demo-aanvraag');
    data.append('from_name', 'rumo website');

    btn.disabled = true;
    var orig = btn.innerHTML;
    btn.innerHTML = 'Versturen&hellip;';
    try {
      var res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
      var json = await res.json();
      if (json.success) {
        form.parentNode.innerHTML =
          '<div class="dm-done">' +
            '<h3>Top, we hebben je aanvraag! <em>Merci.</em></h3>' +
            '<p>We zetten je demo-omgeving klaar en laten snel van ons horen. Hou je mailbox in de gaten.</p>' +
          '</div>';
      } else {
        throw new Error(json.message || 'mislukt');
      }
    } catch (ex) {
      btn.disabled = false; btn.innerHTML = orig;
      err.textContent = 'Oei, er ging iets mis. Probeer opnieuw of mail ons rechtstreeks.';
    }
  }

  // Elke "Probeer gratis"-link (href bevat #demo) opent de modal.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#demo"]');
    if (a) { e.preventDefault(); open(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
