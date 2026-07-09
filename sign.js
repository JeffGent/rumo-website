/*
 * sign.js (#970) — public contract signing page. Reads ?token=, fetches the
 * contract from the Rumo public endpoint, renders it, and posts the signature.
 * No login: the token in the link is the gate. API_BASE empty = same origin
 * (see legal-live.js / issue #971 for the routing).
 */
(function () {
  var API_BASE = '';

  var el = document.getElementById('sign-app');
  if (!el) return;
  var token = new URLSearchParams(location.search).get('token') || '';
  var locale = (document.documentElement.lang || 'nl').slice(0, 2);
  if (['nl', 'fr', 'en'].indexOf(locale) < 0) locale = 'nl';

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
      if (/^\|(.+)\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
        var head = line.split('|').slice(1, -1).map(function (c) { return '<th>' + inline(c.trim()) + '</th>'; }).join('');
        var rows = []; i += 2;
        while (i < lines.length && /^\|(.+)\|\s*$/.test(lines[i])) {
          rows.push('<tr>' + lines[i].split('|').slice(1, -1).map(function (c) { return '<td>' + inline(c.trim()) + '</td>'; }).join('') + '</tr>'); i++;
        }
        out.push('<table><thead><tr>' + head + '</tr></thead><tbody>' + rows.join('') + '</tbody></table>'); continue;
      }
      if (/^[-*]\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) { items.push('<li>' + inline(lines[i].replace(/^[-*]\s+/, '')) + '</li>'); i++; }
        out.push('<ul>' + items.join('') + '</ul>'); continue;
      }
      if (/^\s*$/.test(line)) { i++; continue; }
      var para = [line]; i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#|##|###|---|\||[-*]\s)/.test(lines[i])) { para.push(lines[i]); i++; }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  function pickText(c) {
    if (locale !== c.locale && c.translations && c.translations[locale]) return c.translations[locale];
    return { title: c.title, body: c.body };
  }

  function notice(msg, kind) { el.innerHTML = '<div class="sign-notice ' + (kind || '') + '">' + msg + '</div>'; }

  function showSigned(name) {
    notice('<h2>Getekend</h2><p>Bedankt' + (name ? ', ' + esc(name) : '') + '. We hebben je ondertekening netjes geregistreerd. Je hoeft verder niks te doen.</p>', 'ok');
  }

  function load() {
    if (!token) { notice('Deze link klopt niet. Neem gerust contact op via <a href="mailto:hello@rumo.eu">hello@rumo.eu</a>.', 'err'); return; }
    el.innerHTML = '<p class="sign-loading">Even laden…</p>';
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
          '<label>Je naam<input id="sign-name" type="text" autocomplete="name"></label>' +
          '<label>Je e-mail<input id="sign-email" type="email" autocomplete="email"></label>' +
          '<label>Je handtekening<div class="sig-pad"><canvas id="sig-canvas"></canvas><span class="sig-pad-hint" id="sig-hint">teken hier met je muis of vinger</span></div></label>' +
          '<button type="button" id="sig-clear" class="sig-clear">Handtekening wissen</button>' +
          '<label class="sign-check"><input id="sign-agree" type="checkbox"> Ik heb dit contract, de verwerkersovereenkomst en de algemene voorwaarden gelezen en teken namens dit hotel.</label>' +
          '<button id="sign-btn" type="button">Digitaal tekenen</button>' +
          '<span id="sign-err" class="sign-err"></span>';
        el.appendChild(form);

        // ── Signature pad ──
        var canvas = document.getElementById('sig-canvas');
        var hint = document.getElementById('sig-hint');
        var ctx = canvas.getContext('2d');
        var drawn = false, drawing = false;
        function sizeCanvas() {
          var ratio = window.devicePixelRatio || 1;
          var w = canvas.clientWidth, h = canvas.clientHeight;
          canvas.width = w * ratio; canvas.height = h * ratio;
          ctx.scale(ratio, ratio);
          ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1B1917';
        }
        sizeCanvas();
        function pos(e) {
          var r = canvas.getBoundingClientRect();
          var p = e.touches ? e.touches[0] : e;
          return { x: p.clientX - r.left, y: p.clientY - r.top };
        }
        function start(e) { drawing = true; var p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); }
        function move(e) { if (!drawing) return; var p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); if (!drawn) { drawn = true; hint.style.display = 'none'; } e.preventDefault(); }
        function end() { drawing = false; }
        canvas.addEventListener('pointerdown', start);
        canvas.addEventListener('pointermove', move);
        window.addEventListener('pointerup', end);
        document.getElementById('sig-clear').onclick = function () {
          ctx.clearRect(0, 0, canvas.width, canvas.height); drawn = false; hint.style.display = '';
        };

        document.getElementById('sign-btn').onclick = function () {
          var name = document.getElementById('sign-name').value.trim();
          var email = document.getElementById('sign-email').value.trim();
          var agree = document.getElementById('sign-agree').checked;
          var err = document.getElementById('sign-err');
          if (!name || email.indexOf('@') < 0) { err.textContent = 'Vul je naam en e-mail in.'; return; }
          if (!drawn) { err.textContent = 'Zet je handtekening in het vak.'; return; }
          if (!agree) { err.textContent = 'Vink aan dat je akkoord bent.'; return; }
          err.textContent = '';
          var signature = canvas.toDataURL('image/png');
          var btn = this; btn.disabled = true; btn.textContent = 'Bezig…';
          fetch(API_BASE + '/api/v1/public/contracts/sign/' + encodeURIComponent(token), {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, email: email, locale: locale, signature: signature }),
          })
            .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
            .then(function () { showSigned(name); })
            .catch(function () { btn.disabled = false; btn.textContent = 'Digitaal tekenen'; err.textContent = 'Er ging iets mis. Probeer het opnieuw.'; });
        };
      })
      .catch(function (e) {
        if (String(e.message) === '404') notice('Deze link is niet meer geldig. Misschien is er al getekend, of vraag ons gerust een nieuwe via <a href="mailto:hello@rumo.eu">hello@rumo.eu</a>.', 'err');
        else notice('Dit contract is even niet beschikbaar. Probeer het straks opnieuw of mail <a href="mailto:hello@rumo.eu">hello@rumo.eu</a>.', 'err');
      });
  }

  load();
})();
