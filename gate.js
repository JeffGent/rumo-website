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
    'html.rumo-locked{background:#F5EEE2}' +
    'html.rumo-locked body{display:none!important}' +
    '#rumo-gate{position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;' +
    'align-items:center;justify-content:center;gap:1.4rem;padding:2rem;text-align:center;' +
    'background:#F5EEE2;color:#1B1917;font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif}' +
    '#rumo-gate h1{font-family:Fraunces,Georgia,serif;font-weight:400;font-size:2.6rem;color:#b96b4a;letter-spacing:-.02em;margin:0}' +
    '#rumo-gate p{max-width:32rem;line-height:1.6;color:#3a3531;margin:0}' +
    '#rumo-gate form{display:flex;gap:.5rem;flex-wrap:wrap;justify-content:center;margin-top:.3rem}' +
    '#rumo-gate input{padding:.7rem 1.1rem;border:1px solid #1B191720;border-radius:100px;font-size:1rem;' +
    'font-family:inherit;background:#FAF5EA;color:#1B1917;min-width:230px;outline:none}' +
    '#rumo-gate input:focus{border-color:#D68F6F}' +
    '#rumo-gate button{padding:.7rem 1.5rem;border:none;border-radius:100px;background:#1B1917;color:#F5EEE2;' +
    'font-size:1rem;font-family:inherit;cursor:pointer}' +
    '#rumo-gate .err{color:#b96b4a;font-size:.85rem;min-height:1.1em;margin:0}' +
    '#rumo-gate .note{font-size:.8rem;color:#8d8378;font-style:italic}';
  document.head.appendChild(s);

  async function sha256(str) {
    var buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  function build() {
    var g = document.createElement('div');
    g.id = 'rumo-gate';
    g.innerHTML =
      '<h1>rumo</h1>' +
      '<p>Deze site is nog volop in ontwikkeling. Ben je van het team of uitgenodigd om mee te kijken? Vul even het wachtwoord in.</p>' +
      '<form><input type="password" autocomplete="off" placeholder="Wachtwoord" aria-label="Wachtwoord"><button type="submit">Binnen &rarr;</button></form>' +
      '<p class="err"></p>' +
      '<p class="note">Momenteel in ontwikkeling. We houden je op de hoogte.</p>';
    document.documentElement.appendChild(g);
    var form = g.querySelector('form'), input = g.querySelector('input'), err = g.querySelector('.err');
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
        err.textContent = 'Hmm, dat klopt niet. Probeer opnieuw.';
        input.value = ''; input.focus();
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
