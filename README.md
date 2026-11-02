# projekteffektivitet.se – ny webbplats

Ny version av [projekteffektivitet.se](https://projekteffektivitet.se) i **tio designstilar**
med samma innehåll. Statisk HTML och CSS, inga ramverk, inga cookies, inga tredjepartsanrop.

**Vald stil: Landskap** (med Nordisks rundade hörn, pillerknappar och mjuka kort, typsnitt Poppins).

- **Förhandsvisning av endast vald stil:** [`preview/index.html`](preview/index.html) –
  via githack: https://raw.githack.com/ElevateStudio018/projekt-effektivitet/claude/loving-davinci-n3pz3g/preview/index.html
- **Skarp sajt:** `npm run build:site` bygger Landskap till `dist/`.
- **Alla tio stilar** finns kvar i [`docs/index.html`](docs/index.html) för jämförelse.

**Förhandsvisning:** öppna [`docs/index.html`](docs/index.html) – en översikt över alla tio
stilar. På varje sida finns en stilväljare nere till vänster som byter stil men stannar på
samma sida.

## Sidor

| Sida | Sökväg |
|---|---|
| Startsida | `/` |
| Tjänster (översikt) | `/tjanster/` |
| Projektspecialist, Projektanalys, Projekteffekt | `/tjanster/<tjänst>/` |
| Loopingmodellen | `/loopingmodellen/` |
| Om oss | `/om-oss/` |
| Nyheter (lista) + 6 artiklar | `/nyheter/`, `/nyheter/<artikel>/` |
| Kontakt (med formulär, stödjer `?amne=`) | `/kontakt/` |
| Integritetspolicy | `/integritetspolicy/` |
| 404 | `/404.html` |

## De tio stilarna

| # | Stil | Karaktär | Typsnitt |
|---|---|---|---|
| 1 | **Kärna** | Varumärket som det är, städat. Fotografisk startsida. | Inter Tight + Inter |
| 2 | **Redaktion** | Fackpublikation: serif, spalter, nyheter på startsidan. | Newsreader + Inter |
| 3 | **Rutnät** | Schweizisk typografi, tolvkolumnsrutnät, svartvita bilder. | Public Sans |
| 4 | **Nordisk** | Ljus, varma stentoner, mjuka former. | Manrope |
| 5 | **Natt** | Mörk, exekutiv, detaljer i monospace. | IBM Plex Sans + Mono |
| 6 | **Ritning** | Teknisk ritning, rutpapper, numrerade avsnitt. | IBM Plex Mono + Inter |
| 7 | **Rapport** | Fast sidomeny, rapportomslag, kapitelnumrering. | Source Serif 4 + Inter |
| 8 | **Signal** | Bred grotesk i versaler, stora färgfält. | Archivo |
| 9 | **Byrå** | Etablerad rådgivningsbyrå, centrerad, Garamond. | EB Garamond + Inter |
| 10 | **Landskap** ✔ vald | Helsidesfoton och transparent sidhuvud på varje sida, rundade hörn, pillerknappar och mjuka kort från Nordisk. | Poppins |

Alla stilar använder logotypens färger (marinblå `#144069`, orange `#F37021`) i någon form.
Typsnitten är självhostade (SIL Open Font License, se `src/assets/fonts/licenses/`).

## Bygga

Kräver Node 18 eller senare. Inga beroenden behöver installeras för att bygga.

```bash
npm run build
```

Bygger förhandsvisningen av alla tio stilar till `docs/` (relativa länkar, `noindex`,
stilväljare).

```bash
npm run build:preview
```

Bygger både `docs/` och `preview/` – den senare innehåller bara vald stil, utan stilväljare.

```bash
npm run build:site
```

Bygger den skarpa sajten i vald stil (Landskap) till `dist/`: absoluta länkar, canonical-URL:er,
`sitemap.xml` och `robots.txt`, ingen stilväljare. Innehållet i `dist/` laddas upp till
webbhotellets rotkatalog.

En annan stil byggs med `node src/build.mjs --theme karna --out dist`. Vilken stil som är vald
styrs av `chosen: true` i `src/themes.mjs`.

Kvalitetskontroll och skärmdumpar kräver Playwright (`npm i -D playwright && npx playwright install chromium`):

```bash
npm run check
```

```bash
npm run screenshots
```

`check` letar trasiga länkar och bilder, horisontell scroll på fem skärmbredder och JavaScript-fel.

## Reklamfilm

`film/` innehåller en 22 sekunder lång reklamfilm i webbplatsens stil, berättad som ett
chattsamtal, i två format: `projekteffektivitet-reklamfilm-16x9.mp4` (1920×1080) och
`projekteffektivitet-reklamfilm-9x16.mp4` (1080×1920). Visa dem i `film/index.html`.

Filmen är en HTML-animation (`film/kalla/film.html`) som renderas bildruta för bildruta.
Ändra texter eller tider där och rendera om med `node film/render.mjs` (kräver Playwright och ffmpeg).
Öppnad direkt i webbläsaren spelas animationen upp i realtid.

## Struktur

```
src/
  content/site.mjs        Alla texter utom artiklar
  content/nyheter/*.md    Nyhetsartiklar (Markdown med front matter)
  themes.mjs              De tio stilarnas inställningar
  templates/              Sidmallar, sidhuvud/sidfot, Loopingmodellen som SVG
  styles/base.css         Gemensam grund
  styles/themes/*.css     En fil per stil
  assets/                 Bilder, logotyper, typsnitt
tools/                    Kvalitetskontroll och skärmdumpar
scraped/                  Allt material från nuvarande sajt (texter, bilder, skärmdumpar)
docs/                     Byggd förhandsvisning (kan publiceras med GitHub Pages)
```

**Ny artikel:** lägg en `.md`-fil i `src/content/nyheter/` med `title`, `date`, `category`,
`lead`, `image` och `imageAlt` i front matter och kör `npm run build`. Interna länkar skrivs
som `[text](/kontakt/)`.

## Att granska innan publicering

Texter från nuvarande sajt är oförändrade. Följande är **nyskrivna utkast** och behöver
läsas igenom:

- **Projektspecialist** och **Projektanalys** – den gamla sajten visade samma text för alla
  tre tjänster. Originaltexten (”första hjälpen”) ligger nu under Projekteffekt, där den hör
  hemma. De två andra har fått egna texter.
- ”Passar när”-listor och ”Vad insatsen leder till” på tjänstesidorna.
- **Så börjar ett uppdrag** (fyra steg) på tjänsteöversikten.
- **Om oss**: bygger bara på uppgifter från sajten. Pers bakgrund saknas – se `TODO(Per)` i
  `src/content/site.mjs`.
- **Alla artiklar** och deras **publiceringsdatum** (datumen är satta för förhandsvisningen).
- **Artikeln om Elevate Studio** bygger på uppgifter från elevatestudio.nu (skrapat underlag i
  `scraped/elevatestudio/`). Bilden `pjmp-elevate-paraply.jpg` är förslag 1 av 5 i `forslag/elevate-bild/`
  (källfiler i `forslag/elevate-bild/kalla/`).
- **Bolagsnamn:** elevatestudio.nu anger bolaget som *PJM Projekteffektivitet AB*, org.nr
  556969-4358. Nuvarande projekteffektivitet.se skriver *Projekteffektivitet AB*. Om det är samma
  bolag bör `legalName` i `src/content/site.mjs` uppdateras och org.nr läggas till i sidfoten.
- **Integritetspolicy**: stämmer för sajten som den är byggd (inga cookies, ingen statistik,
  formuläret skickar inget till någon server). Kontrollera mot hur förfrågningar hanteras i praktiken.
- På startsidan länkar ”Öka verkningsgraden” nu till Loopingmodellen i stället för till
  Projektspecialist.

## Publicering

Sajten är helt statisk och kan läggas på vilket webbhotell som helst. För att förhandsvisningen
ska bli nåbar via länk: aktivera GitHub Pages för repot med källan `docs/`.

Nuvarande sajt ger 404 när man laddar `/tjanster`, `/loopingmodellen` eller `/kontakt` direkt.
Den nya sajten har en riktig `index.html` per sida och har inte det problemet.
