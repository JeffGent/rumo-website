#!/usr/bin/env python3
"""Maakt de Engelse en Franse pagina's uit de Nederlandse.

WAAROM DIT BESTAAT
------------------
en/ en fr/ zijn een half jaar lang los bijgehouden en liepen daardoor achter:
de navigatie had nog acht items terwijl de Nederlandse er vijf had, de
prijzenpagina toonde vijf modules terwijl er acht bestonden, en de
features-pagina had de hele integratielijst niet. Elke keer dat er iets aan de
Nederlandse kant veranderde, moest iemand eraan denken. Dat gebeurde niet.

Nu zijn ze uitvoer. De Nederlandse pagina is de bron, per pagina staat er een
vertaaltabel naast, en dit script zet die twee samen. Verandert er iets in het
Nederlands, dan draai je dit opnieuw. Staat er een zin niet in de tabel, dan
zegt het script dat met naam en toenaam in plaats van hem stilletjes in het
Nederlands te laten staan.

DRAAIEN
-------
    cd /Users/jeffrey/Projecten/rumo-website
    python3 vertalingen/maak-en-fr.py

DE TABELLEN
-----------
vertalingen/<pagina>.json is een woordenboek van {Nederlandse tekst: {en, fr}}.
De sleutel is de tekst ZOALS DIE IN DE HTML STAAT, inclusief de tags eromheen
wanneer die nodig zijn om hem uniek te maken. Korte woorden ("wo", "Twin")
horen daarom altijd met hun markup in de tabel; los zouden ze midden in andere
woorden matchen.

WAT DIT SCRIPT NIET DOET
------------------------
faq, over-ons/about/a-propos en de juridische pagina's staan er niet in. Die
zijn nog met de hand vertaald en lopen dus opnieuw het risico achter te raken.
Wie ze hierin trekt, moet er alleen een tabel bij schrijven.
"""
import io
import json
import os
import re
import sys

WORTEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(WORTEL)

# Per pagina: de Nederlandse bron, de doelbestanden, en hoe de taalkiezer
# rechtsboven eruit moet zien.
PAGINAS = [
    {
        'bron': 'index.html',
        'tabel': 'vertalingen/index.json',
        'doel': {'en': 'en/index.html', 'fr': 'fr/index.html'},
        'zelf': {'en': 'index.html', 'fr': 'index.html'},
        'nl': 'index.html',
    },
    {
        'bron': 'features.html',
        'tabel': 'vertalingen/features.json',
        'doel': {'en': 'en/features.html', 'fr': 'fr/features.html'},
        'zelf': {'en': 'features.html', 'fr': 'features.html'},
        'nl': 'features.html',
        # de actieve navigatieregel verschilt van de gewone
        'actief': {
            'nl': '<li><a href="features.html" class="active">Wat doen we?</a></li>',
            'en': '<li><a href="features.html" class="active">What do we do?</a></li>',
            'fr': '<li><a href="features.html" class="active">Que faisons-nous&nbsp;?</a></li>',
        },
    },
    {
        'bron': 'wat-drijft-ons.html',
        'tabel': 'vertalingen/wat-drijft-ons.json',
        'doel': {'en': 'en/what-drives-us.html', 'fr': 'fr/ce-qui-nous-anime.html'},
        'zelf': {'en': 'what-drives-us.html', 'fr': 'ce-qui-nous-anime.html'},
        'nl': 'wat-drijft-ons.html',
        'actief': {
            'nl': '<li><a href="wat-drijft-ons.html" class="active">Wat drijft ons?</a></li>',
            'en': '<li><a href="what-drives-us.html" class="active">What drives us?</a></li>',
            'fr': '<li><a href="ce-qui-nous-anime.html" class="active">Ce qui nous anime</a></li>',
        },
    },
]

# Paden. en/ en fr/ staan één map dieper dan de bron, dus alles wat in die map
# geen eigen vertaling heeft, krijgt ../ ervoor.
PAD_GEDEELD = [
    ('href="overstappen.html', 'href="../overstappen.html'),
    ('href="uitgelegd/index.html', 'href="../uitgelegd/index.html'),
    ('href="kb.html', 'href="../kb.html'),
    ('href="veiligheid.html', 'href="../veiligheid.html'),
    ('href="pms.html', 'href="../pms.html'),
    ('href="rudy.html', 'href="../rudy.html'),
    ('href="handbook.html', 'href="../handbook.html'),
    ('href="channel-manager.html', 'href="../channel-manager.html'),
    ('href="guest-portal.html', 'href="../guest-portal.html'),
    ('href="prevention.html', 'href="../prevention.html'),
    ('href="privacy.html', 'href="../privacy.html'),
    ('href="cookies.html', 'href="../cookies.html'),
    ('src="gate.js"', 'src="../gate.js"'),
    ('src="demo-form.js', 'src="../demo-form.js'),
    ('href="shared.css"', 'href="../shared.css"'),
    ('href="favicon.svg"', 'href="../favicon.svg"'),
    ('src="assets/', 'src="../assets/'),
    ('href="assets/', 'href="../assets/'),
]
PADEN = {
    'en': [('href="prijzen.html', 'href="pricing.html'),
           ('href="over-ons.html', 'href="about.html'),
           ('href="wat-drijft-ons.html', 'href="what-drives-us.html')] + PAD_GEDEELD,
    'fr': [('href="prijzen.html', 'href="tarifs.html'),
           ('href="over-ons.html', 'href="a-propos.html'),
           ('href="wat-drijft-ons.html', 'href="ce-qui-nous-anime.html')] + PAD_GEDEELD,
}


def taalkiezer(taal, nl_bestand, zelf):
    """De NL/EN/FR-knopjes rechtsboven, met de juiste actief."""
    rijen = {
        'nl': '<a href="../%s">NL</a>' % nl_bestand,
        'en': '<a href="%s">EN</a>' % (zelf['en'] if taal == 'en' else '../en/' + zelf['en']),
        'fr': '<a href="%s">FR</a>' % (zelf['fr'] if taal == 'fr' else '../fr/' + zelf['fr']),
    }
    rijen[taal] = rijen[taal].replace('">', '" class="active">')
    return '<li class="nav-lang">\n      %s\n      %s\n      %s\n    </li>' % (
        rijen['nl'], rijen['en'], rijen['fr'])


def bouw(pagina, taal):
    s = io.open(pagina['bron'], encoding='utf-8').read()
    # gedeeld.json houdt de navigatie en de voettekst bij, want die staan op
    # elke pagina en hoefden niet drie keer vertaald te worden.
    tabel = json.load(io.open('vertalingen/gedeeld.json', encoding='utf-8'))
    tabel.update(json.load(io.open(pagina['tabel'], encoding='utf-8')))

    # taalkiezer eerst: die bevat paden die de padvervanging anders verminkt
    m = re.search(r'<li class="nav-lang">[\s\S]*?</li>', s)
    if not m:
        raise SystemExit('geen taalkiezer in ' + pagina['bron'])
    s = s[:m.start()] + taalkiezer(taal, pagina['nl'], pagina['zelf']) + s[m.end():]

    if 'actief' in pagina:
        s = s.replace(pagina['actief']['nl'], pagina['actief'][taal])

    # dan de teksten, en pas daarna de paden: andersom matchen de Nederlandse
    # zinnen met een link erin niet meer.
    ongebruikt = []
    for nl, vert in tabel.items():
        if nl in s:
            s = s.replace(nl, vert[taal])
        else:
            ongebruikt.append(nl)

    for oud, nieuw in PADEN[taal]:
        s = s.replace(oud, nieuw)

    s = s.replace('<html lang="nl">', '<html lang="%s">' % taal)
    io.open(pagina['doel'][taal], 'w', encoding='utf-8').write(s)
    return ongebruikt


fouten = 0
for pagina in PAGINAS:
    for taal in ('en', 'fr'):
        bouw(pagina, taal)
        print('%-30s <- %s' % (pagina['doel'][taal], pagina['bron']))
        # Een ongebruikte regel is geen fout: gedeeld.json bevat navigatie- en
        # voetteksten die niet op elke pagina voorkomen. Een achtergebleven
        # Nederlandse zin is dat wel, en die vangt de controle hieronder.

# Nog in het Nederlands? Zoek naar woorden die in geen van beide doeltalen
# bestaan. Ruw, maar het vangt vergeten zinnen.
NL_WOORDEN = re.compile(
    r'>[^<]*\b(wat|dat|niet|maar|jouw|omdat|geen|worden|wordt|deze|elke|zodat|'
    r'hoeveel|klikken|meteen|gewoon|kamers|gasten|boeking|prijzen|kalender|'
    r'handboek|veiligheid|zelfs|onze|jij|jouw)\b', re.I)
for pagina in PAGINAS:
    for taal in ('en', 'fr'):
        s = io.open(pagina['doel'][taal], encoding='utf-8').read()
        romp = s[s.index('<body'):] if '<body' in s else s
        romp = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>', '', romp)
        resten = NL_WOORDEN.findall(romp)
        if resten:
            fouten += 1
            print('   %s: mogelijk nog Nederlands (%s)' % (pagina['doel'][taal], ', '.join(sorted(set(resten))[:6])))

sys.exit(1 if fouten else 0)
