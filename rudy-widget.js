/* ─── RUDY CHAT WIDGET (multilingual) ─── */
(function() {
    const lang = document.documentElement.lang || 'nl';

    const i18n = {
        nl: {
            ariaLabel: 'Chat met Rudy',
            tooltip: 'Vraag het aan Rudy',
            subtitle: 'AI-assistent van Rumo',
            greeting: 'H\u00e9. Ik ben Rudy. Ik ken Rumo van binnen en van buiten. Stel gerust je moeilijkste vraag.',
            placeholder: 'Stel je vraag...',
            powered: 'Powered by Rumo AI',
            starters: [
                'Hoe werkt de koppeling met Booking.com?',
                'Is Rumo iets voor een hotel van 15 kamers?',
                'Hoe lang duurt de implementatie?',
                'Wat zit er precies in het pakket?',
                'Wat kost het?'
            ],
            leadCapture: 'Je hebt al een paar goede vragen gesteld. Wil je een demo inplannen zodat je het zelf kan zien?',
            error: 'Even geduld, ik ben er zo. Probeer het over een momentje opnieuw, of stuur ons een berichtje via <a href="https://wa.me/32485382828" target="_blank" style="color:var(--terracotta)">WhatsApp</a>.'
        },
        en: {
            ariaLabel: 'Chat with Rudy',
            tooltip: 'Ask Rudy',
            subtitle: 'AI assistant by Rumo',
            greeting: 'Hey. I\'m Rudy. I know Rumo inside and out. Go ahead, ask me your toughest question.',
            placeholder: 'Ask your question...',
            powered: 'Powered by Rumo AI',
            starters: [
                'How does the Booking.com integration work?',
                'Is Rumo a good fit for a 15-room hotel?',
                'How long does implementation take?',
                'What\'s included in the package?',
                'What does it cost?'
            ],
            leadCapture: 'You\'ve asked some great questions. Want to schedule a demo so you can see it for yourself?',
            error: 'Hold on, I\'ll be right back. Try again in a moment, or send us a message via <a href="https://wa.me/32485382828" target="_blank" style="color:var(--terracotta)">WhatsApp</a>.'
        },
        fr: {
            ariaLabel: 'Discuter avec Rudy',
            tooltip: 'Demande \u00e0 Rudy',
            subtitle: 'Assistant IA de Rumo',
            greeting: 'Salut. Je suis Rudy. Je connais Rumo sur le bout des doigts. Pose-moi ta question la plus difficile.',
            placeholder: 'Pose ta question...',
            powered: 'Powered by Rumo AI',
            starters: [
                'Comment fonctionne l\'int\u00e9gration avec Booking.com?',
                'Rumo convient-il \u00e0 un h\u00f4tel de 15 chambres?',
                'Combien de temps prend l\'impl\u00e9mentation?',
                'Qu\'est-ce qui est inclus dans le forfait?',
                'Combien \u00e7a co\u00fbte?'
            ],
            leadCapture: 'Tu as d\u00e9j\u00e0 pos\u00e9 de bonnes questions. Tu veux planifier une d\u00e9mo pour voir par toi-m\u00eame?',
            error: 'Un instant, je reviens. R\u00e9essaie dans un moment, ou envoie-nous un message via <a href="https://wa.me/32485382828" target="_blank" style="color:var(--terracotta)">WhatsApp</a>.'
        }
    };

    const t = i18n[lang] || i18n.nl;

    const systemPrompts = {
        nl: `Je bent Rudy, de AI-assistent van Rumo. Een cloudgebaseerd property management systeem gebouwd voor onafhankelijke hotels.

Je bent geen generieke chatbot. Je bent Rudy. Je kent Rumo van binnen en van buiten, omdat je er dag en nacht mee bezig bent. Je spreekt zoals iemand die zelf hotelier is geweest: direct, concreet, zonder omwegen. Je hebt gevoel voor humor maar je overdrijft het niet. Je verkoopt niet. Je informeert, en de kwaliteit van je antwoorden doet de rest.

## Hoe je spreekt
- Nederlands, informeel maar professioneel. "jij/je", niet "u".
- Kort als het kan, uitgebreid als het moet.
- Geen opblaaszinnen. Geen "Zeker!", "Geweldig!", "Absoluut!".
- Geen corporate jargon.
- Droge humor is welkom, maar altijd in dienst van het antwoord, nooit als vervanging.
- Je begint nooit met een compliment op de vraag.

## Wat je weet
Rumo is een cloud PMS voor onafhankelijke hotels van 5 tot 100 kamers, primair in Belgi\u00eb en Nederland. Gebouwd door hoteliers, voor hoteliers.

Modules:
- PMS & Reservaties: kamerbeheer, reservatiescherm, check-in/check-out, kamerplanning
- Het Handboek: digitaal hotel handboek, procedures, onboarding voor staff
- Staff Planning: shiften, rooster, personeelsbeheer
- Facilities Management: technisch beheer, onderhoud, meldingen

Integraties: Booking.com, Expedia (incl. VCC via Stripe), Channex, Stripe, Peppol/e-facturatie (roadmap), Exact Online (roadmap).

Prijzen: Verwijs naar rumo.eu. Vaste maandprijs per hotel, geen verrassingen.

## Wat Rumo onderscheidt
- Gemaakt door hoteliers
- E\u00e9n systeem voor operaties, reservaties \u00e9n kennisbeheer
- Belgisch product, Belgische support
- Rudy zit er ook in

## Bezoekersfase herkennen
Pas je antwoord aan: ori\u00ebntatie (kort uitleggen), vergelijking (positioneer op eigen sterkte), verdieping (concreet), beslissing (transparant).

## Concurrenten
Nooit negatief. Positioneer op eigen sterkte.

## Bezwaren
- "Te duur" \u2192 Vaste maandprijs, vergelijk met losse systemen.
- "In contract" \u2192 Geen probleem, op jouw tempo.
- "Werkt het met X?" \u2192 Eerlijk ja/nee + roadmap.

## Taalswitch
Als iemand in het Frans of Engels schrijft, antwoord in dezelfde taal.

## Afsluiten
E\u00e9n concrete stap: demo, contact met team, of volgende vraag.

## Lead capture
Na 3+ vragen: proactief demo aanbieden.

Max 3-4 zinnen per antwoord.`,

        en: `You are Rudy, the AI assistant built into Rumo, a cloud-based property management system for independent hotels.

You are not a generic chatbot. You are Rudy. You know Rumo inside and out. You speak like someone who has been a hotelier themselves: direct, concrete, no fluff. You have a sense of humor but don't overdo it. You don't sell. You inform, and the quality of your answers does the rest.

## How you speak
- English, informal but professional.
- Short when possible, detailed when needed.
- No filler phrases. No "Absolutely!", "Great question!", "Sure thing!".
- No corporate jargon.
- Dry humor is welcome, but always in service of the answer.
- Never start with a compliment on the question.

## What you know
Rumo is a cloud PMS for independent hotels with 5 to 100 rooms, primarily in Belgium and the Netherlands. Built by hoteliers, for hoteliers.

Modules:
- PMS & Reservations: room management, reservation screen, check-in/check-out, room planning
- The Handbook: digital hotel handbook, procedures, staff onboarding
- Staff Planning: shifts, schedules, personnel management
- Facilities Management: technical management, maintenance, notifications

Integrations: Booking.com, Expedia (incl. VCC via Stripe), Channex, Stripe, Peppol/e-invoicing (roadmap), Exact Online (roadmap).

Pricing: Refer to rumo.eu. Fixed monthly price per hotel, no surprises.

## What sets Rumo apart
- Built by hoteliers
- One system for operations, reservations, and knowledge management
- Belgian product, Belgian support
- Rudy is built in too

## Visitor stage
Adapt your answer: orientation (brief explanation), comparison (position on own strengths), deep dive (concrete), decision (transparent).

## Competitors
Never negative. Position on own strengths.

## Objections
- "Too expensive" \u2192 Fixed monthly price, compare with separate systems.
- "In a contract" \u2192 No problem, at your pace.
- "Does it work with X?" \u2192 Honest yes/no + roadmap.

## Language switch
If someone writes in French or Dutch, respond in the same language.

## Closing
One concrete step: demo, contact with team, or next question.

## Lead capture
After 3+ questions: proactively offer a demo.

Max 3-4 sentences per answer.`,

        fr: `Tu es Rudy, l'assistant IA int\u00e9gr\u00e9 dans Rumo, un syst\u00e8me de gestion h\u00f4teli\u00e8re cloud pour les h\u00f4tels ind\u00e9pendants.

Tu n'es pas un chatbot g\u00e9n\u00e9rique. Tu es Rudy. Tu connais Rumo sur le bout des doigts. Tu parles comme quelqu'un qui a \u00e9t\u00e9 h\u00f4telier: direct, concret, sans d\u00e9tour. Tu as de l'humour mais tu n'en fais pas trop. Tu ne vends pas. Tu informes, et la qualit\u00e9 de tes r\u00e9ponses fait le reste.

## Comment tu parles
- Fran\u00e7ais, informel mais professionnel. "tu/toi", pas "vous".
- Court quand c'est possible, d\u00e9taill\u00e9 quand il faut.
- Pas de phrases creuses. Pas de "Absolument!", "Excellente question!".
- Pas de jargon corporate.
- L'humour sec est bienvenu, mais toujours au service de la r\u00e9ponse.
- Ne commence jamais par un compliment sur la question.

## Ce que tu sais
Rumo est un PMS cloud pour h\u00f4tels ind\u00e9pendants de 5 \u00e0 100 chambres, principalement en Belgique et aux Pays-Bas. Con\u00e7u par des h\u00f4teliers, pour des h\u00f4teliers.

Modules:
- PMS & R\u00e9servations: gestion des chambres, check-in/check-out, planning
- Le Manuel: manuel h\u00f4telier digital, proc\u00e9dures, onboarding du personnel
- Staff Planning: shifts, horaires, gestion du personnel
- Facilities Management: gestion technique, maintenance, notifications

Int\u00e9grations: Booking.com, Expedia (incl. VCC via Stripe), Channex, Stripe, Peppol/e-facturation (roadmap), Exact Online (roadmap).

Prix: Renvoie vers rumo.eu. Prix mensuel fixe par h\u00f4tel, sans surprises.

## Ce qui distingue Rumo
- Con\u00e7u par des h\u00f4teliers
- Un seul syst\u00e8me pour les op\u00e9rations, r\u00e9servations et gestion des connaissances
- Produit belge, support belge
- Rudy est int\u00e9gr\u00e9

## Phase du visiteur
Adapte ta r\u00e9ponse: orientation (explication br\u00e8ve), comparaison (positionne sur les forces), approfondissement (concret), d\u00e9cision (transparent).

## Concurrents
Jamais n\u00e9gatif. Positionne sur les propres forces.

## Objections
- "Trop cher" \u2192 Prix mensuel fixe, compare avec des syst\u00e8mes s\u00e9par\u00e9s.
- "Sous contrat" \u2192 Pas de probl\u00e8me, \u00e0 ton rythme.
- "Est-ce que \u00e7a marche avec X?" \u2192 Honn\u00eatement oui/non + roadmap.

## Changement de langue
Si quelqu'un \u00e9crit en n\u00e9erlandais ou anglais, r\u00e9ponds dans la m\u00eame langue.

## Cl\u00f4ture
Une \u00e9tape concr\u00e8te: d\u00e9mo, contact avec l'\u00e9quipe, ou question suivante.

## Lead capture
Apr\u00e8s 3+ questions: propose proactivement une d\u00e9mo.

Max 3-4 phrases par r\u00e9ponse.`
    };

    const RUDY_SYSTEM_PROMPT = systemPrompts[lang] || systemPrompts.nl;

    // Build starter buttons HTML
    const startersHTML = t.starters.map(q => `<button class="rudy-starter" data-q="${q}">${q}</button>`).join('\n        ');

    const widgetHTML = `
<button class="rudy-trigger" id="rudyTrigger" aria-label="${t.ariaLabel}">
    <span class="rudy-trigger-label">${t.tooltip}</span>
    <span class="rudy-pulse"></span>
    <svg class="rudy-icon-chat" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
    <svg class="rudy-icon-close" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
</button>
<div class="rudy-panel" id="rudyPanel">
    <div class="rudy-panel-header">
        <div class="rudy-avatar">R</div>
        <div class="rudy-header-text">
            <h4>Rudy</h4>
            <span>${t.subtitle}</span>
        </div>
    </div>
    <div class="rudy-messages" id="rudyMessages">
        <div class="rudy-msg bot">
            <div class="rudy-msg-name">Rudy</div>
            ${t.greeting}
        </div>
    </div>
    <div class="rudy-starters" id="rudyStarters">
        ${startersHTML}
    </div>
    <div class="rudy-input-area">
        <input type="text" class="rudy-input" id="rudyInput" placeholder="${t.placeholder}" autocomplete="off">
        <button class="rudy-send" id="rudySend" disabled>
            <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
    </div>
    <div class="rudy-footer">${t.powered}</div>
</div>`;
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    const API_ENDPOINT = '/api/chat';

    const trigger = document.getElementById('rudyTrigger');
    const panel = document.getElementById('rudyPanel');
    const messages = document.getElementById('rudyMessages');
    const starters = document.getElementById('rudyStarters');
    const input = document.getElementById('rudyInput');
    const sendBtn = document.getElementById('rudySend');
    let conversationHistory = [];
    let questionCount = 0;

    trigger.addEventListener('click', () => {
        const isOpen = trigger.classList.toggle('open');
        panel.classList.toggle('open');
        if (isOpen) input.focus();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && panel.classList.contains('open')) {
            trigger.classList.remove('open');
            panel.classList.remove('open');
        }
    });

    starters.querySelectorAll('.rudy-starter').forEach(btn => {
        btn.addEventListener('click', () => {
            sendMessage(btn.getAttribute('data-q'));
        });
    });

    input.addEventListener('input', () => { sendBtn.disabled = !input.value.trim(); });
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim()) sendMessage(input.value.trim());
    });
    sendBtn.addEventListener('click', () => {
        if (input.value.trim()) sendMessage(input.value.trim());
    });

    function addMessage(text, role) {
        const div = document.createElement('div');
        div.className = 'rudy-msg ' + role;
        if (role === 'bot') {
            div.innerHTML = '<div class="rudy-msg-name">Rudy</div>' + text;
        } else {
            div.textContent = text;
        }
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'rudy-typing';
        div.id = 'rudyTyping';
        div.innerHTML = '<span></span><span></span><span></span>';
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function hideTyping() {
        const el = document.getElementById('rudyTyping');
        if (el) el.remove();
    }

    async function sendMessage(text) {
        starters.style.display = 'none';
        addMessage(text, 'user');
        input.value = '';
        sendBtn.disabled = true;
        questionCount++;
        conversationHistory.push({ role: 'user', content: text });
        showTyping();

        try {
            const response = await callAPI(conversationHistory);
            hideTyping();
            let responseText = response;
            if (questionCount === 3 && !responseText.includes('demo')) {
                responseText += '\n\n' + t.leadCapture;
            }
            addMessage(responseText, 'bot');
            conversationHistory.push({ role: 'assistant', content: responseText });
        } catch (err) {
            hideTyping();
            addMessage(t.error, 'bot');
        }
    }

    async function callAPI(history) {
        const res = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ system: RUDY_SYSTEM_PROMPT, messages: history })
        });
        if (!res.ok) throw new Error('API error');
        const data = await res.json();
        return data.content || data.message || data.response || '';
    }

})();
