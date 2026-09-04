/* demo-form.js — "Probeer gratis" opent een aanvraagformulier (modal).
 *
 * WAT ER GEBEURT NA HET VERSTUREN
 * De aanvraag komt als mail bij ons binnen. Wij zetten met de hand een
 * proefomgeving klaar en mailen de inloggegevens terug. Er wordt dus NIETS
 * automatisch aangemaakt; de bezoeker wacht op ons.
 *
 * DE BESTEMMING (het enige stuk dat later verhuist)
 * Vandaag loopt de mail via Web3Forms. Een statische site op GitHub Pages kan
 * zelf geen mail versturen: daarvoor is een server nodig die een SMTP-wachtwoord
 * bewaart, en die hebben we hier niet. Web3Forms is dus geen keuze uit luiheid
 * maar het enige wat werkt zonder backend.
 *
 * Let op: het gratis plan van Web3Forms stopt bij 250 aanvragen per maand.
 * Daarboven verdwijnen aanvragen zonder dat iemand het merkt (issue #1102).
 *
 * Wil je later naar onze eigen mailserver? Dan hoeft alleen ENDPOINT hieronder
 * te wijzigen (plus eventueel de opbouw van `data` in `sendRequest`). Alle
 * andere code, de modal en de teksten blijven zoals ze zijn.
 */
(function () {
  // ── Bestemming ────────────────────────────────────────────────────────────
  var ENDPOINT   = 'https://api.web3forms.com/submit';
  var ACCESS_KEY = '89ef2ee7-c622-4825-aaa2-caf9d2672327'; // Web3Forms-sleutel; hangt serverkant aan jeffrey@rumo.eu

  /** Kleine hulp: een gebeurtenis naar Plausible, of niets als die geblokkeerd is. */
  function track(name, props) {
    try { if (window.plausible) window.plausible(name, props ? { props: props } : undefined); } catch (e) {}
  }

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
          '<p class="dm-sub">Laat je gegevens achter. Wij zetten je proefomgeving klaar, met nepreservaties erin zodat je meteen kan klikken, en mailen je de inloggegevens. Meestal binnen de werkdag. Geen creditcard, geen verkoopsgesprek.</p>' +
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
            '<p class="dm-fine">Geen creditcard. We gebruiken je gegevens enkel om je proefomgeving klaar te zetten.</p>' +
            '<p class="dm-fine">Door dit te versturen ga je akkoord met onze ' +
              '<a href="/voorwaarden" target="_blank" rel="noopener">algemene voorwaarden</a> en ' +
              '<a href="/dpa" target="_blank" rel="noopener">verwerkersovereenkomst</a>.</p>' +
          '</form>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    modal.querySelector('.dm-close').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    modal.querySelector('.dm-form').addEventListener('submit', submit);
  }

  function open(source) {
    build();
    // Wie het formulier ziet is de tussenstap tussen "bezoeker" en "aanvraag".
    // Zonder deze meet je enkel het eindtotaal en weet je niet waar het lekt.
    // Bij elke opening, niet enkel de eerste: Plausible telt zelf ook unieke
    // bezoekers per gebeurtenis, dus dubbel openen vertekent het beeld niet.
    track('Proefformulier geopend', { Vanaf: source || 'onbekend' });
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
      var res = await fetch(ENDPOINT, { method: 'POST', body: data });
      var json = await res.json();
      if (json.success) {
        track('Proefaanvraag verstuurd');
        form.parentNode.innerHTML =
          '<div class="dm-done">' +
            '<h3>Top, we hebben je aanvraag! <em>Merci.</em></h3>' +
            '<p>We zetten je proefomgeving klaar en mailen je de inloggegevens. Meestal binnen de werkdag, in het slechtste geval de volgende. Kijk ook eens in je spam, mails van nieuwe afzenders belanden daar wel vaker.</p>' +
          '</div>';
      } else {
        throw new Error(json.message || 'mislukt');
      }
    } catch (ex) {
      // Een mislukte verzending is een verloren aanvraag. Meet hem, anders lijkt
      // een stille storing (of een volgelopen Web3Forms-quota) op weinig interesse.
      track('Proefaanvraag mislukt');
      btn.disabled = false; btn.innerHTML = orig;
      err.innerHTML = 'Oei, er ging iets mis. Probeer opnieuw, of mail ons rechtstreeks op ' +
        '<a href="mailto:hello@rumo.eu" style="color:#b96b4a">hello@rumo.eu</a>.';
    }
  }

  // Elke "Probeer gratis"-link (href bevat #demo) opent de modal.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#demo"]');
    if (a) {
      e.preventDefault();
      var where = a.className.indexOf('nav-cta') > -1 ? 'navigatie'
                : a.className.indexOf('btn-paper') > -1 ? 'slotknop'
                : a.className.indexOf('btn-ink') > -1 ? 'hero'
                : 'elders';
      open(where);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
