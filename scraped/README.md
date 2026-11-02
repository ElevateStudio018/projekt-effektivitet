# Skrapat material – projekteffektivitet.se

Skrapat 2026-11-02 från https://projekteffektivitet.se med Playwright (sajten är en
React-app; undersidor ger 404 vid direktladdning och renderades via klientnavigering).

## Sidor på nuvarande sajt

| Sida | Sökväg | Text |
|---|---|---|
| Start | `/` | [texts/home.txt](texts/home.txt) |
| Tjänster | `/tjanster` | [texts/tjanster.txt](texts/tjanster.txt) |
| Loopingmodellen | `/loopingmodellen` | [texts/loopingmodellen.txt](texts/loopingmodellen.txt) |
| Kontakta oss | `/kontakt` (stödjer `?amne=`) | [texts/kontakt.txt](texts/kontakt.txt) |
| 404 | övriga | [texts/404.txt](texts/404.txt) |

Renderad HTML för varje sida ligger i [original/](original/), tillsammans med
originalets `index.html` och kompilerade `app.css`. Skärmdumpar finns i
[screenshots/](screenshots/).

Loopingmodellens fyra steg (karusell på sajten, bara steg 1 syns utan klick) hämtades
ur JavaScript-paketet:

1. **Besluta** – Nästa loop tar form: Ett business case för nästa loop beslutas och genomförandet startar.
2. **Genomföra** – Åtgärder blir handling: Förbättringsåtgärder genomförs enligt plan, med tydligt ansvar och löpande framdrift.
3. **Kontrollera** – Effekten verifieras: Resultatet kontrolleras mot business case för att säkerställa att önskad effekt har uppnåtts.
4. **Slutföra** – Lärdomar förs vidare: Förbättringsarbetet slutförs och leverans samt presentation förbereds inför nästa loop.

## Kontaktuppgifter

- Per Mattsson – PMP, Projektledningskonsult
- Telefon: +46 733 574 575
- E-post: per.mattsson@projekteffektivitet.se
- Ort: Uppsala
- Bolag: Projekteffektivitet AB
- Slogan: ”Bättre effekt. Ett projekt i taget.”
- Beskrivning: ”Struktur, framdrift och verksamhetseffekt i projekt som betyder mycket.”

## Varumärke

| | Värde | Källa |
|---|---|---|
| Marinblå (logotyp) | `#144069` | `logo_svg.svg` |
| Orange (logotyp) | `#F37021` | `logo_svg.svg` |
| Theme color | `#102f4d` | `<meta name="theme-color">` |
| Mörk marin (sajt) | `#17314a`, `#123b60` | `app.css` |
| Ljus orange (sajt) | `#ff9d61`, `#ff9b59` | `app.css` |
| Mörk orange (sajt) | `#dc5e14` | `app.css` |
| Papper (sajt) | `#f7f6f1` | `app.css` |
| Gråblå (sajt) | `#9fb0be`, `#72899a`, `#465d70` | `app.css` |

**Typsnitt:** sajten anger `Inter` men laddar inget webbtypsnitt – besökare utan Inter
installerat får systemets sans-serif. Ordmärket i logotypen är konverterat till kurvor
(ingen typsnittsfil finns att hämta).

## Bilder och logotyper ([assets/](assets/))

| Fil | Storlek | Användning |
|---|---|---|
| `logo_svg.svg` | 574×206 | Logotyp, färg |
| `logo_footer_svg.svg` | 211×206 | Symbol, vit |
| `favicon.png` | 195×195 | Favicon |
| `road_001.jpg`, `road_002.jpg`, `road_003.jpg` | 1923×600 | Bildspel startsida (bara 002 används idag) |
| `bild_projektspecialist_low.jpg` | 800×533 | Tjänst |
| `bild_projektanalys2_low.jpg` | 800×533 | Tjänst / startsida |
| `bild_projekteffekt_low.jpg` | 800×533 | Tjänst |
| `loopingmodellen_overgripande.jpg` | 1000×290 | Loopingmodellen |
| `per_mattsson.jpg` | 520×357 | Kontakt (ligger i mappen `nyheter/` på servern) |

## Fel på nuvarande sajt

- **/tjanster:** alla tre tjänster (Projektspecialist, Projektanalys, Projekteffekt) visar
  samma tre stycken text. Texten handlar om ”första hjälpen” och hör hemma under
  Projekteffekt.
- **Direktlänkar:** `/tjanster`, `/loopingmodellen` och `/kontakt` ger 404 om man laddar
  dem direkt eller delar länken. Servern saknar fallback till `index.html`.
- **Startsidan:** ”Varför Projekteffektivitet”-korten och bilden i projektanalys-avsnittet
  syns bara efter en scroll-animation. I helsidesskärmdumpar och för vissa
  skärmläsare/sökmotorer är de tomma.
- **Sidfotens logotyp** visas som en tom ruta i vissa lägen.
- **Typsnittet Inter** laddas inte (se ovan).
- Alla sidor har samma `<title>`.
