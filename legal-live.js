/*
 * legal-live.js (#968) — renders a platform legal document (general terms / DPA)
 * live from the Rumo console. The text is NOT stored in this static site: it is
 * fetched from the public PMS endpoint, so publishing a new version in the
 * console updates this page automatically — one source of truth.
 *
 * Usage: <div id="legal-live" data-doc="terms"></div> + <script src="legal-live.js">.
 *
 * API_BASE: empty = same origin (rumo.eu/api/v1/... proxied to the PMS, like the
 * Rudy widget's /api/chat). If the PMS API lives on another host, Seba sets the
 * absolute base here (infra/domain-routing decision — see issue #970).
 */
(function () {
  var API_BASE = '';
  var LOCALES = { nl: 'NL', fr: 'FR', en: 'EN' };

  var el = document.getElementById('legal-live');
  if (!el) return;
  var doc = el.getAttribute('data-doc') || 'terms';
  // A page can pin a language via data-locale (e.g. the English /generalterms
  // page). Otherwise fall back to the visitor's last choice, then the page lang.
  var forced = el.getAttribute('data-locale');
  var locale = forced || localStorage.getItem('legalLocale') || (document.documentElement.lang || 'nl').slice(0, 2);
  if (!LOCALES[locale]) locale = 'nl';

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function inline(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[^_])_([^_]+)_/g, '$1<em>$2</em>');
  }

  // Minimal markdown → HTML for the document shape we control (headings, bold,
  // italics, tables, lists, hr, paragraphs).
  function render(md) {
    var lines = md.split('\n');
    var out = [];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (/^#\s+/.test(line)) { i++; continue; } // page header already shows the title
      if (/^##\s+/.test(line)) { out.push('<h2>' + inline(line.replace(/^##\s+/, '')) + '</h2>'); i++; continue; }
      if (/^###\s+/.test(line)) { out.push('<h3>' + inline(line.replace(/^###\s+/, '')) + '</h3>'); i++; continue; }
      if (/^---\s*$/.test(line)) { out.push('<hr>'); i++; continue; }
      // Table block
      if (/^\|(.+)\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
        var head = line.split('|').slice(1, -1).map(function (c) { return '<th>' + inline(c.trim()) + '</th>'; }).join('');
        var rows = [];
        i += 2;
        while (i < lines.length && /^\|(.+)\|\s*$/.test(lines[i])) {
          var cells = lines[i].split('|').slice(1, -1).map(function (c) { return '<td>' + inline(c.trim()) + '</td>'; }).join('');
          rows.push('<tr>' + cells + '</tr>');
          i++;
        }
        out.push('<table class="legal-table"><thead><tr>' + head + '</tr></thead><tbody>' + rows.join('') + '</tbody></table>');
        continue;
      }
      // List block
      if (/^[-*]\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
          items.push('<li>' + inline(lines[i].replace(/^[-*]\s+/, '')) + '</li>');
          i++;
        }
        out.push('<ul>' + items.join('') + '</ul>');
        continue;
      }
      if (/^\s*$/.test(line)) { i++; continue; }
      // Paragraph (gather consecutive non-blank, non-special lines)
      var para = [line];
      i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#|##|###|---|\||[-*]\s)/.test(lines[i])) {
        para.push(lines[i]); i++;
      }
      out.push('<p>' + inline(para.join(' ')) + '</p>');
    }
    return out.join('\n');
  }

  function switcher(available, current) {
    var wrap = document.createElement('div');
    wrap.className = 'legal-lang-switch';
    available.forEach(function (loc) {
      if (!LOCALES[loc]) return;
      var a = document.createElement('button');
      a.type = 'button';
      a.textContent = LOCALES[loc];
      if (loc === current) a.className = 'active';
      a.onclick = function () { localStorage.setItem('legalLocale', loc); load(loc); };
      wrap.appendChild(a);
    });
    return wrap;
  }

  function load(loc) {
    el.innerHTML = '<p class="legal-loading">Laden…</p>';
    fetch(API_BASE + '/api/v1/public/contracts/' + encodeURIComponent(doc) + '?locale=' + encodeURIComponent(loc))
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (d) {
        el.innerHTML = '';
        el.appendChild(switcher(d.availableLocales || [d.locale], d.locale));
        var meta = document.createElement('p');
        meta.className = 'legal-version';
        meta.textContent = 'Versie ' + d.version + (d.effectiveDate ? ' · ' + d.effectiveDate : '');
        el.appendChild(meta);
        var body = document.createElement('div');
        body.innerHTML = render(d.body || '');
        el.appendChild(body);
      })
      .catch(function () {
        el.innerHTML = '<p class="legal-error">Dit document is momenteel niet beschikbaar. Probeer het later opnieuw of mail <a href="mailto:hello@rumo.eu">hello@rumo.eu</a>.</p>';
      });
  }

  load(locale);
})();
