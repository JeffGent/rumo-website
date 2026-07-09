/*
 * sign.js (#970) — public contract signing page. Reads ?token=, fetches the
 * contract from the Rumo public endpoint, renders it, and posts the signature.
 * No login: the token in the link is the gate. API_BASE empty = same origin
 * (see legal-live.js / issue #971 for the routing).
 */
(function () {
  var API_BASE = '';
  var LOCALES = { nl: 'NL', fr: 'FR', en: 'EN' };

  var el = document.getElementById('sign-app');
  if (!el) return;
  var token = new URLSearchParams(location.search).get('token') || '';
  var locale = (document.documentElement.lang || 'nl').slice(0, 2);
  if (!LOCALES[locale]) locale = 'nl';

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function inline(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/(^|[^_])_([^_]+)_/g, '$1<em>$2</em>');
  }
  function render(md) {
    var lines = md.split('\n'), out = [], i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (/^#\s+/.test(line)) { i++; continue; }
      if (/^##\s+/.test(line)) { out.push('<h2>' + inline(line.replace(/^##\s+/, '')) + '</h2>'); i++; continue; }
      if (/^###\s+/.test(line)) { out.push('<h3>' + inline(line.replace(/^###\s+/, '')) + '</h3>'); i++; continue; }
      if (/^---\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
      if (/^[-*]\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) { items.push('<li>' + inline(lines[i].replace(/^[-*]\s+/, '')) + '</li>'); i++; }
        out.push('<ul>' + items.join('') + '</ul>'); continue;
      }
      if (/^\s*$/.test(line)) { i++; continue; }
      var para = [line]; i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#|##|###|---|[-*]\s)/.test(lines[i])) { para.push(lines[i]); i++; }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  function pickText(c) {
    if (locale !== c.locale && c.translations && c.translations[locale]) return c.translations[locale];
    return { title: c.title, body: c.body };
  }

  function notice(msg, kind) {
    el.innerHTML = '<div class="sign-notice ' + (kind || '') + '">' + msg + '</div>';
  }

  function showSigned(name) {
    notice('<h2>Getekend ✓</h2><p>Bedankt' + (name ? ', ' + esc(name) : '') + '. De ondertekening is geregistreerd. U ontvangt geen verdere actie.</p>', 'ok');
  }

  function load() {
    if (!token) { notice('Ongeldige of ontbrekende link.', 'err'); return; }
    el.innerHTML = '<p class="sign-loading">Laden…</p>';
    fetch(API_BASE + '/api/v1/public/contracts/sign/' + encodeURIComponent(token))
      .then(function (r) { if (r.status === 404) throw new Error('404'); if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (d) {
        var c = d.contract;
        if (c.status === 'signed') { showSigned(c.signedByName); return; }
        var t = pickText(c);
        el.innerHTML = '';

        var doc = document.createElement('div');
        doc.className = 'sign-doc';
        doc.innerHTML = render(t.body || '');
        el.appendChild(doc);

        var form = document.createElement('div');
        form.className = 'sign-form';
        form.innerHTML =
          '<label>Naam ondertekenaar<input id="sign-name" type="text" autocomplete="name"></label>' +
          '<label>E-mail<input id="sign-email" type="email" autocomplete="email"></label>' +
          '<label class="sign-check"><input id="sign-agree" type="checkbox"> Ik heb dit contract, de verwerkersovereenkomst en de algemene voorwaarden gelezen en teken namens dit hotel.</label>' +
          '<button id="sign-btn" type="button">Tekenen</button>' +
          '<span id="sign-err" class="sign-err"></span>';
        el.appendChild(form);

        document.getElementById('sign-btn').onclick = function () {
          var name = document.getElementById('sign-name').value.trim();
          var email = document.getElementById('sign-email').value.trim();
          var agree = document.getElementById('sign-agree').checked;
          var err = document.getElementById('sign-err');
          if (!name || email.indexOf('@') < 0 || !agree) { err.textContent = 'Vul naam, e-mail in en vink het vakje aan.'; return; }
          err.textContent = '';
          this.disabled = true; this.textContent = 'Bezig…';
          var btn = this;
          fetch(API_BASE + '/api/v1/public/contracts/sign/' + encodeURIComponent(token), {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, locale: locale }),
          })
            .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
            .then(function () { showSigned(name); })
            .catch(function () { btn.disabled = false; btn.textContent = 'Tekenen'; err.textContent = 'Er ging iets mis. Probeer het opnieuw.'; });
        };
      })
      .catch(function (e) {
        if (String(e.message) === '404') notice('Deze link is niet (meer) geldig.', 'err');
        else notice('Dit document is momenteel niet beschikbaar. Probeer het later opnieuw of mail <a href="mailto:hello@rumo.eu">hello@rumo.eu</a>.', 'err');
      });
  }

  load();
})();
