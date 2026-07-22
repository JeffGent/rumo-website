/* gate.js — simpele pre-launch wachtwoordbeveiliging voor de marketingpagina's.
 * LET OP: dit is client-side en dus enkel bedoeld om toevallige bezoekers buiten
 * te houden. Wie de paginabron bekijkt of JS uitzet, geraakt erlangs. Geen echte
 * beveiliging — voor die garantie is Cloudflare Access nodig.
 * Wachtwoord wijzigen: vervang HASH door de SHA-256 van het nieuwe wachtwoord
 * (bv. `printf '%s' 'nieuwwoord' | shasum -a 256`).
 */
(function () {
  var KEY = 'rumo_preview_ok';
  var HASH = '8342da99a8fd75a9145b6871cca6bc7d5df56f565aea188ecaac64cc310f55ef'; // sinterklaas
  try { if (sessionStorage.getItem(KEY) === '1') return; } catch (e) {}

  document.documentElement.classList.add('rumo-locked');
  var s = document.createElement('style');
  s.textContent =
    'html.rumo-locked{background:#1B1917}' +
    'html.rumo-locked body{display:none!important}' +
    '#rumo-gate{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;' +
    'align-items:center;justify-content:center;padding:3rem 1.5rem 6.5rem;text-align:center;overflow:hidden;' +
    'background:#1B1917;color:#F5EEE2;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif}' +
    '#rumo-gate::before{content:"";position:absolute;right:-8%;top:-25%;width:42%;height:120%;' +
    'background:radial-gradient(circle,#b96b4a 0%,transparent 60%);opacity:.5;filter:blur(15px);pointer-events:none}' +
    '#rumo-gate::after{content:"";position:absolute;left:-6%;bottom:-25%;width:34%;height:80%;' +
    'background:radial-gradient(circle,#F4D98F 0%,transparent 60%);opacity:.28;filter:blur(16px);pointer-events:none}' +
    '#rumo-gate .rg-main{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:1.15rem;max-width:34rem}' +
    '#rumo-gate .rg-logo{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:3rem;letter-spacing:-.03em;line-height:1;color:#F5EEE2}' +
    '#rumo-gate .rg-logo em{font-style:italic;color:#D68F6F;font-weight:300}' +
    '#rumo-gate .rg-tag{font-family:Fraunces,Georgia,serif;font-size:1.55rem;color:#F5EEE2;letter-spacing:-.02em;line-height:1.1;margin:0}' +
    '#rumo-gate .rg-tag em{font-style:italic;color:#D68F6F;font-weight:300}' +
    '#rumo-gate .rg-body{display:flex;flex-direction:column;gap:.85rem;margin-top:.5rem}' +
    '#rumo-gate .rg-body p{font-size:1.02rem;line-height:1.62;color:rgba(245,238,226,.72);margin:0}' +
    '#rumo-gate .rg-body em{font-style:italic;color:#D68F6F;font-weight:400}' +
    '#rumo-gate .rg-foot{position:absolute;left:0;right:0;bottom:2.2rem;z-index:2;display:flex;flex-direction:column;align-items:center;gap:.5rem}' +
    '#rumo-gate .rg-hint{font-family:"JetBrains Mono",monospace;font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;color:rgba(245,238,226,.5)}' +
    '#rumo-gate .rg-field{display:flex;align-items:center;gap:.3rem;border-bottom:1px solid rgba(245,238,226,.25);padding:.25rem .3rem;transition:border-color .2s}' +
    '#rumo-gate .rg-field:focus-within{border-color:#D68F6F}' +
    '#rumo-gate .rg-field input{border:none;background:transparent;font-family:inherit;font-size:.95rem;color:#F5EEE2;padding:.15rem .1rem;min-width:150px;outline:none;text-align:center}' +
    '#rumo-gate .rg-field input::placeholder{color:rgba(245,238,226,.45)}' +
    '#rumo-gate .rg-field button{border:none;background:transparent;color:#D68F6F;font-size:1.15rem;cursor:pointer;padding:0 .15rem;line-height:1}' +
    '#rumo-gate .rg-err{color:#D68F6F;font-size:.78rem;min-height:1em;margin:0}';
  document.head.appendChild(s);

  async function sha256(str) {
    var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  function build() {
    var g = document.createElement('div');
    g.id = 'rumo-gate';
    g.innerHTML =
      '<div class="rg-main">' +
        '<div class="rg-logo">rumo<em>.</em></div>' +
        '<p class="rg-tag">Hotelsoftware <em>zonder gedoe.</em></p>' +
        '<div class="rg-body">' +
          '<p>Voor hoteliers die liever met hun gasten bezig zijn dan met hun software. Reservaties, channel manager, facturatie en een handboek, alles in één. Plus Rudy, je slimme collega die \'s nachts gewoon doorwerkt.</p>' +
          '<p>Deze site is nog volop in aanbouw. Binnenkort zetten we \'m open voor iedereen; tot dan houden we \'m nog even onder ons. <em>(Geen geheimen hoor, gewoon nog niet af.)</em></p>' +
        '</div>' +
      '</div>' +
      '<form class="rg-foot">' +
        '<span class="rg-hint">Van \'t team of stiekem uitgenodigd?</span>' +
        '<div class="rg-field"><input type="password" autocomplete="off" placeholder="wachtwoord" aria-label="Wachtwoord"><button type="submit" aria-label="Binnen">&rarr;</button></div>' +
        '<p class="rg-err"></p>' +
      '</form>';
    document.documentElement.appendChild(g);
    var form = g.querySelector('form'), input = g.querySelector('input'), err = g.querySelector('.rg-err');
    input.focus();
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var ok = false;
      try { ok = (await sha256(input.value)) === HASH; } catch (e2) {}
      if (ok) {
        try { sessionStorage.setItem(KEY, '1'); } catch (e3) {}
        g.remove();
        document.documentElement.classList.remove('rumo-locked');
      } else {
        err.textContent = 'Hmm, dat klopt niet. Probeer nog eens.';
        input.value = ''; input.focus();
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
