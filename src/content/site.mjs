// Allt innehåll som inte är nyhetsartiklar.
//
// Källa: projekteffektivitet.se (skrapad 2026-11-02). Texter markerade
// UTKAST är nyskrivna för de nya sidorna och behöver granskas av Per
// innan publicering. Övriga texter är tagna ordagrant från nuvarande sajt.

export const site = {
  name: 'Projekteffektivitet',
  legalName: 'Projekteffektivitet AB',
  url: 'https://projekteffektivitet.se',
  tagline: 'Bättre effekt. Ett projekt i taget.',
  description: 'Struktur, framdrift och verksamhetseffekt i projekt som betyder mycket.',
  metaDescription:
    'Projekteffektivitet hjälper organisationer att öka verkningsgraden, driva strategiska projekt mot mål och få fart på projekt som stannat av.',
  city: 'Uppsala',
  phone: '+46 733 574 575',
  phoneHref: 'tel:+46733574575',
  email: 'per.mattsson@projekteffektivitet.se',
  web: 'www.projekteffektivitet.se',
  person: {
    name: 'Per Mattsson',
    title: 'PMP, Projektledningskonsult',
    image: 'per_mattsson.jpg',
  },
  year: 2026,
};

export const nav = [
  { label: 'Tjänster', path: 'tjanster/' },
  { label: 'Loopingmodellen', path: 'loopingmodellen/' },
  { label: 'Nyheter', path: 'nyheter/' },
  { label: 'Om oss', path: 'om-oss/' },
  { label: 'Kontakt', path: 'kontakt/' },
];

// ---------------------------------------------------------------- Tjänster
export const services = [
  {
    id: 'projektspecialist',
    headImage: 'road_002.jpg',
    number: '01',
    title: 'Projektspecialist',
    summary: 'Erfaret stöd när ett projekt behöver avlastning, nya perspektiv och snabb handlingskraft.',
    image: 'bild_projektspecialist_low.jpg',
    imageAlt: 'Projektgrupp samlad kring en dator',
    // UTKAST – nyskriven text (originalsajten visade samma text för alla tre tjänster).
    body: [
      'Ett strategiskt viktigt projekt kräver ofta mer erfarenhet och kapacitet än vad organisationen har tillgänglig just när det behövs. Som projektspecialist går vi in i projektet och tar ansvar för det som behöver hända – som projektledare, som stöd till befintlig projektledning eller med ett avgränsat uppdrag inom styrning, planering och uppföljning.',
      'Arbetet handlar om struktur, tempo och fokus: att målen är tydliga, att beslut fattas i rätt forum och att alla vet vad som förväntas av dem. Vi arbetar tillsammans med er organisation, så att arbetssätten finns kvar när uppdraget är avslutat.',
    ],
    when: [
      'Ett viktigt projekt saknar en erfaren projektledare',
      'Projektledningen behöver avlastning eller ett oberoende bollplank',
      'Styrning, planering och uppföljning behöver struktureras upp',
    ],
    outcomes: [
      ['Struktur', 'Tydliga mål, roller och beslutsvägar.'],
      ['Tempo', 'En plan som går att följa – och följa upp.'],
      ['Fokus', 'Prioriteringar som utgår från den effekt projektet ska ge.'],
    ],
  },
  {
    id: 'projektanalys',
    headImage: 'road_001.jpg',
    number: '02',
    title: 'Projektanalys',
    summary: 'En oberoende genomlysning av läget och det som hindrar projektet från att nå målet.',
    image: 'bild_projektanalys2_low.jpg',
    imageAlt: 'Analys av projektdata på en surfplatta',
    // UTKAST – stycke 1 bygger på startsidans text om projektanalys.
    body: [
      'När beslut dröjer, mandat är otydliga eller styrningen inte håller ihop tappar projektet kraft. Symptomen syns ofta tydligt – förseningar, växande kostnader, ett trött team – medan orsakerna är svårare att peka ut inifrån.',
      'Genom en oberoende analys identifierar vi vad som hindrar framdriften och vilka åtgärder som krävs för att få projektet tillbaka på rätt spår. Vi går igenom underlag, planer och styrning och samtalar med dem som äger, leder och genomför projektet. Insikten blir värdefull först när den går att omsätta i tydliga beslut och handling – därför slutar analysen alltid i konkreta förslag.',
    ],
    when: [
      'Projektet har tappat fart och ingen kan riktigt säga varför',
      'Styrgruppen behöver ett oberoende beslutsunderlag',
      'Inför ett vägval: fortsätta, ställa om eller avbryta',
    ],
    outcomes: [
      ['Nuläge', 'Tydlig bild av nuläge och orsaker.'],
      ['Beslut', 'Prioriterade åtgärder och beslut.'],
      ['Vägen framåt', 'En genomförbar väg framåt.'],
    ],
  },
  {
    id: 'projekteffekt',
    headImage: 'road_003.jpg',
    number: '03',
    title: 'Projekteffekt',
    summary: 'Första hjälpen i kritiska projekt – eller en förebyggande insats innan problemen vuxit sig stora.',
    image: 'bild_projekteffekt_low.jpg',
    imageAlt: 'Hand som pekar på diagram på en surfplatta',
    // Originaltext från projekteffektivitet.se/tjanster.
    body: [
      'Ibland kan det av olika anledningar uppstå akut svåra situationer i ett pågående projekt. En större risk kanske infaller och vänder allt på ända, en svårlöst konflikt blossar upp eller det har blivit uppenbart att projektet inte kommer att kunna leverera i tid med stora fördyringar som följd.',
      'Att snabbt få ”första hjälpen” i ett projekt som hamnat i någon av de situationerna kan vara avgörande för att ett totalt haveri inte ska uppstå. Att få hjälpen kanske inte bara är en ren avlastning utan motverkar också risken för hemmablindhet.',
      'Att göra denna typ av insatser är något som Projekteffektivitet älskar; vi kallar det projekteffekt. Ännu bättre tycker vi såklart att det är att göra det i förebyggande syfte – innan orosmolnen tornat upp sig på rad i horisonten.',
    ],
    when: [
      'En stor risk har inträffat och planen gäller inte längre',
      'En konflikt låser projektet',
      'Det står klart att projektet inte levererar i tid',
    ],
    outcomes: [
      ['Stabilisering', 'Ett snabbt och samlat grepp om läget.'],
      ['Nya ögon', 'Motverkar hemmablindhet i ett pressat team.'],
      ['Förebyggande', 'Insatsen kan göras innan problemen vuxit sig stora.'],
    ],
  },
];

// ------------------------------------------------------------- Startsidan
export const home = {
  title: 'Projekteffektivitet – bättre effekt i projekt',
  heroTitle: 'Vi skapar bättre effekt i projekt.',
  heroLead:
    'Vi hjälper organisationer att öka verkningsgraden, få fart på projekt som har stannat av och driva strategiskt viktiga initiativ säkert mot mål.',
  situationsTitle: 'Vad behöver ert projekt just nu?',
  situationsLead:
    'Olika situationer kräver olika insatser. Vi börjar där behovet är som störst och bygger framdrift därifrån.',
  situations: [
    {
      kicker: 'Utveckla förmågan',
      title: 'Öka verkningsgraden',
      text: 'Skapa tydligare arbetssätt, roller och styrning i hela projektorganisationen.',
      path: 'loopingmodellen/',
      link: 'Om Loopingmodellen',
    },
    {
      kicker: 'Säkra genomförandet',
      title: 'Driv projektet mot mål',
      text: 'Ta in en projektspecialist som skapar struktur, tempo och fokus i ett viktigt projekt.',
      path: 'tjanster/projektspecialist/',
      link: 'Om projektspecialist',
    },
    {
      kicker: 'Återställ framdriften',
      title: 'Få fart på projektet',
      text: 'Identifiera det som bromsar och omsätt analysen i konkreta åtgärder.',
      path: 'tjanster/projektanalys/',
      link: 'Om projektanalys',
    },
  ],
  servicesTitle: 'Stöd från problem till resultat',
  servicesLead:
    'Vi arbetar i skärningspunkten mellan styrning, människor och genomförande. Alltid med verksamhetseffekten som riktmärke.',
  feature: {
    kicker: 'När projektet har tappat fart',
    title: 'Se hindren. Återställ riktningen.',
    lead: 'När beslut dröjer, mandat är otydliga eller styrningen inte håller ihop tappar projektet kraft.',
    text: 'Genom en oberoende analys identifierar vi vad som hindrar framdriften och vilka åtgärder som krävs för att få projektet tillbaka på rätt spår.',
    points: ['Tydlig bild av nuläge och orsaker', 'Prioriterade åtgärder och beslut', 'En genomförbar väg framåt'],
    image: 'bild_projektanalys2_low.jpg',
    imageAlt: 'Analys av projektdata på en surfplatta',
    caption: 'Oberoende projektanalys',
  },
  loopTitle: 'Förbättring som fortsätter ge effekt',
  loopLead:
    'Fyra tydliga steg. En återkommande rytm som gör utvecklingen greppbar, mätbar och möjlig att bygga vidare på.',
  principlesTitle: 'Vi håller ihop analys och handling',
  ctaTitle: 'Behöver ni få bättre effekt i era projekt?',
  ctaText:
    'Oavsett om ni vill utveckla projektorganisationen, driva ett viktigt projekt i mål eller få tillbaka framdriften börjar vi gärna med ett första samtal.',
};

export const principles = [
  { title: 'Effekt före aktivitet', text: 'Vi håller fokus på varför projektet finns och vad det ska förändra i verksamheten.' },
  { title: 'Analys som leder vidare', text: 'Insikten blir värdefull först när den går att omsätta i tydliga beslut och handling.' },
  { title: 'Förbättring som arbetssätt', text: 'Små, avgränsade loopar skapar lärande, riktning och kontinuerlig utveckling.' },
];

// --------------------------------------------------------- Loopingmodellen
export const loop = {
  title: 'Loopingmodellen',
  heading: 'Kontinuerlig förbättring i en tydlig rytm',
  lead: 'En återkommande modell som hjälper organisationen att besluta, genomföra, kontrollera och lära – en hanterbar loop i taget.',
  steps: [
    { n: '01', short: 'Besluta', title: 'Nästa loop tar form', text: 'Ett business case för nästa loop beslutas och genomförandet startar.' },
    { n: '02', short: 'Genomföra', title: 'Åtgärder blir handling', text: 'Förbättringsåtgärder genomförs enligt plan, med tydligt ansvar och löpande framdrift.' },
    { n: '03', short: 'Kontrollera', title: 'Effekten verifieras', text: 'Resultatet kontrolleras mot business case för att säkerställa att önskad effekt har uppnåtts.' },
    { n: '04', short: 'Slutföra', title: 'Lärdomar förs vidare', text: 'Förbättringsarbetet slutförs och leverans samt presentation förbereds inför nästa loop.' },
  ],
  principleTitle: 'Varje loop bygger förmåga',
  principle: [
    'I stället för ett stort förbättringsarbete utan tydliga avstämningar delas utvecklingen upp i avgränsade loopar. Varje loop får ett business case, ett genomförande och en kontrollerad effekt.',
    'När resultatet är säkrat slutförs arbetet och lärdomarna blir ingång till nästa loop.',
  ],
  // UTKAST – nyskrivet stycke.
  whyTitle: 'Varför loopar i stället för ett stort program?',
  why: [
    'Stora förbättringsprogram riskerar att tappa riktning långt innan de levererar. En loop är tillräckligt liten för att överblicka och tillräckligt tydlig för att följa upp. Varje varv ger ett mätbart resultat och ett beslutsunderlag för nästa.',
    'Rytmen gör det också enklare för ledningen att styra: i stället för att ta ställning till hela förändringen på en gång fattas beslut loop för loop, med facit från föregående varv på bordet.',
  ],
};

// ----------------------------------------------------------------- Om oss
// UTKAST – nyskriven sida. Bygger enbart på uppgifter från nuvarande sajt.
export const about = {
  title: 'Om oss',
  heading: 'Struktur, framdrift och verksamhetseffekt',
  lead: 'Projekteffektivitet AB är ett konsultföretag i Uppsala som hjälper organisationer att få bättre effekt av sina projekt.',
  body: [
    'Vi arbetar i skärningspunkten mellan styrning, människor och genomförande. Uppdragen spänner från att utveckla en hel projektorganisation till att gå in i ett enskilt projekt som behöver hjälp att nå målet – eller som har stannat av.',
    'Gemensamt för alla uppdrag är riktmärket: den effekt projektet ska ge i verksamheten. Aktiviteter, rapporter och planer är medel. Det som räknas är vad som faktiskt förändras.',
  ],
  personHeading: 'Per Mattsson',
  personBody: [
    'Per Mattsson driver Projekteffektivitet och är certifierad Project Management Professional (PMP). PMP är en internationell certifiering för projektledare som utfärdas av Project Management Institute.',
    // TODO(Per): komplettera med bakgrund, branscher och tidigare uppdrag.
  ],
};

// ---------------------------------------------------------------- Kontakt
export const contact = {
  title: 'Kontakt',
  heading: 'Låt oss börja med projektets nuläge',
  lead: 'Ett första samtal räcker för att börja ringa in behovet, möjliga vägval och ett klokt nästa steg.',
  directTitle: 'Prata med Per om ert projekt',
  directText: [
    'Oavsett om ni vill utveckla projektorganisationen, behöver specialiststöd eller vill återställa framdriften i ett problemprojekt börjar dialogen här.',
    'Välkommen att ringa eller mejla för ett första samtal.',
  ],
  topics: [
    ['', 'Allmän förfrågan'],
    ['projektspecialist', 'Projektspecialist'],
    ['projektanalys', 'Projektanalys'],
    ['projekteffekt', 'Projekteffekt'],
    ['loopingmodellen', 'Loopingmodellen'],
    ['annat', 'Annat'],
  ],
};

// ------------------------------------------------------- Integritetspolicy
// UTKAST – kontrollera mot faktisk hantering innan publicering.
export const privacy = {
  title: 'Integritetspolicy',
  heading: 'Integritetspolicy',
  lead: 'Så hanterar Projekteffektivitet AB personuppgifter.',
  sections: [
    ['Personuppgiftsansvarig', 'Projekteffektivitet AB, Uppsala, är personuppgiftsansvarig för de uppgifter som beskrivs här. Frågor skickas till per.mattsson@projekteffektivitet.se.'],
    ['När du kontaktar oss', 'När du mejlar eller ringer oss behandlar vi de uppgifter du själv lämnar – till exempel namn, organisation, e-postadress, telefonnummer och innehållet i ditt meddelande – för att kunna besvara din förfrågan. Den rättsliga grunden är vårt berättigade intresse av att hantera förfrågningar. Uppgifterna sparas så länge dialogen pågår och därefter så länge det krävs enligt lag, till exempel bokföringslagen om ett uppdrag blir av.'],
    ['Kontaktformuläret', 'Det du skriver i kontaktformuläret – namn, organisation, e-post, telefon och meddelande – skickas via tjänsten FormSubmit (formsubmit.co) till vår e-post. FormSubmit vidarebefordrar meddelandet och sparar det inte längre än nödvändigt för leveransen. Vi använder uppgifterna bara för att svara dig.'],
    ['Cookies och statistik', 'Webbplatsen använder inga cookies och ingen besöksstatistik eller spårning. Typsnitt och bilder levereras från webbplatsen själv, inte från tredje part.'],
    ['Dina rättigheter', 'Du har rätt att begära information om, rättelse av och radering av dina personuppgifter, samt att invända mot behandlingen. Du kan också lämna klagomål till Integritetsskyddsmyndigheten (IMY).'],
  ],
};
