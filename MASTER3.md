# MASTER

> **Single source of truth.** Co tu není, neexistuje.  
> Pokud se realita produktu začne hádat s tímhle dokumentem, beru to jako bug. Opravím buď produkt, nebo rozhodnutí. **Ne** že to budu obcházet “výjimkou”, “poznámkou bokem” nebo jiným alibismem.

Tenhle dokument je moje páteř. Ne moodboard, ne wish-list, ne backlog. Je to závazek, podle kterýho se ten produkt chová.

---

<a id="pravidla-dokumentu"></a>
## Pravidla dokumentu

Tohle je moje ústava. Ne deníček, ne hromada poznámek z hospody. Píšu sem **jen** věci, podle kterých se produkt reálně chová, nebo chovat má.

Co sem patří:
- **Koncepty, definice, rozhodnutí** a jejich *důvod* (co platí a proč).
- Věci, které když poruším, tak se rozpadne **důvěra** nebo **charakter** produktu.

Co sem nepatří:
- Žádný kód. Žádný DB schémata. Žádný “jak to udělám”.
- Žádný technický výmluvy typu “tohle zatím nejde”.
- Žádný duplicitní přežvykování toho samýho na pěti místech.

Formát a tón:
- Píšu v **ich-formě**. Jsem autor, beru odpovědnost.
- Když je něco vágní, je to k ničemu. Když je něco zbytečný, tak to smažu.
- Každý nový kus textu musí projít otázkou: **„Pomůže mi to udělat správný rozhodnutí, až budu unavenej?“**

Struktura dokumentu (nový základ):
- **Koncepty** jsou hlavní “katalog reality”.  
  Když se někdo zeptá „jak funguje inzerát / draft / transakce / feed…“, odpověď má být *na jednom místě* v příslušným konceptu.
- Každý koncept si může nést svoje podsekce typu: **Přehled, Data & eventy, UX, UI, Pravidla, Edge-cases**.
- Když něco patří do konkrétního konceptu, **nepíšu to nikam jinam**. Jinde jen odkaz.

---

<a id="obsah"></a>
## Obsah

- [Směr produktu](#smer-produktu)
  - [Identita](#identita)
  - [Tone of Voice](#tov)
  - [Produktové cíle](#produktove-cile)
  - [UX principy](#ux-principy)
  - [Komunikace a transparentnost](#komunikace)
- [Konkurenceschopnost](#konkurenceschopnost)
  - [Co umím líp](#co-umim-lip)
  - [V čem je má slabina](#slabina)
  - [Co vědomě nedělám](#co-nedelam)
- [Kodex](#kodex)
  - [Důvěra jako výchozí stav](#duvera-default)
  - [Férová monetizace a neaktivita](#ferova-monetizace)
  - [Žádné pay-to-win](#no-p2w)
  - [Respekt k uživateli](#respekt)
  - [Otevřenost a odpovědnost](#otevrenost)
- [Koncepty](#koncepty)
  - *(tady budou všechny „jak funguje X?“ věci pohromadě: Inzerát, Draft, Feed, Transakce, Zprávy, Inbox, Lokace, Kategorie, Viditelnost, Limity, Citlivost, Reputace, Metriky… a další)*  
- [Ekonomika](#ekonomika)
  - *(tokeny, kupóny, passy, předplatné, payback, pravidla férovosti, balíčky)*  
- [Uvedení na trh](#uvedeni-na-trh)
- [Retence a paměť trhu](#retence)
- [Odhady monetizace a růstu](#odhady)

---

<a id="smer-produktu"></a>
## Směr produktu

Tady je moje páteř. Ne “seznam featur”, ne backlog, ne výmluvy. Jsou tu pravidla, která drží tenhle projekt pohromadě, i když budu unavenej, ve stresu a budu mít chuť udělat z toho další obyč bazar.

Platí pár jednoduchých věcí:

- **Klid a jistota jsou cíl.** Úspěch není wow-efekt, ale moment, kdy uživatel nic neřeší.
- **Když to nejde pochopit samo, je to špatně.** Ne “uživatel je blbej”, ale já jsem to dojebal.
- **Minimum keců, maximum signálu.** UI se chová fyzikálně přirozeně, žádný kejkle.
- **Důvěra není feature.** Je to výsledek: konzistence, transparentnost, férový pravidla.

Tohle je část, ke který se vracím pokaždý, když mě napadne “jenom malá výjimka”. Malý výjimky jsou nejrychlejší cesta, jak zabít charakter produktu.

<a id="identita"></a>
### Identita

Zbav-se.me není “platforma”. Je to moje práce a můj postoj. A ten postoj je napsanej natvrdo:

> **Prodávám, neojebávám.**

Co z toho plyne:

- **Klid místo chaosu.** Žádný bazarový peklo, kde se člověk prokliká k migréně.
- **Minimum psaní.** Domluva má být primárně klikací a strukturovaná. Chat existuje, ale není střed vesmíru.
- **Lokálnost a setkání jako default.** Podporuju osobní předání a sousedský prodej. Ne “všude posílej balíky”.
- **Transparentnost jako design.** Žádný skrytý penalizace, žádný “nevíš proč se ti to nezobrazuje”.
- **Férová monetizace.** Platí se za hodnotu (nástroje, čas, pohodlí), ne za manipulaci.
- **Měření je pro lidi, ne pro inzerenty.**  
  Měřím to, co má viditelnej smysl v produktu (signál trhu, férový mechaniky). Nedělám reklamní profilování a nic neprodávám třetím stranám.

Prakticky: uživatel má mít pocit, že systém je **předvídatelnej**. Když něčemu nerozumí, je to můj problém. Ne jeho.

<a id="tov"></a>
### Tone of Voice

> „**Klikej. Zkoumej. Není tu co posrat.**“  
> Onboarding nastaví vztah. A pak už držím hubu a nechám UI dělat práci.

Mluvím přímo, krátce a lidsky. Ne protože jsem drsňák, ale protože *kecy zvyšujou nejistotu*.

- **Tykám.** Jsme lidi, ne úřad.
- **Mužský rod beru jako neutrální default** (kvůli konzistenci a kratším větám).  
  Příklad: „Odmítl jsi“, „Potvrdil jsi“, „Máš novou zprávu“.
- **Žádnej pasiv a úředničina.**  
  Ne „bylo odmítnuto“, ale „Odmítl jsi“ / „Prodejce tě odmítl“.
- **Žádný školení v UI.** Žádný tooltipy, žádný “(?)”, žádný “tady klikni”.  
  Když to potřebuje nápovědu, je to špatně navržený.
- **Běžnej workflow je klidnej a tichej.**  
  Ostrý, osobní tón patří jen do výjimečných míst (onboarding, landing, founder podpis, bezpečnostní hranice).
- **Mikrocopy je uklidnění, ne show.**  
  Když něco načítám, klidně “...rozjímám...”, ale bez cirkusu.

<a id="produktove-cile"></a>
### Produktové cíle

Nechci stavět “appku”. Chci postavit **trh**, kterej se chová slušně a předvídatelně.

- **Ticho = úspěch.**  
  Když uživatel nic neřeší, nikde se nezasekne a nemá potřebu přemýšlet „co tím autor myslel“, vyhrál jsem.
- **Známý mentální model marketplace, ale bez bordelu.**  
  List → detail → zájem → domluva. Jen bez chaosu v chatu a bez nátlaku.
- **Minimum psaní, maximum faktů.**  
  Domluva má být timeline událostí (zájem, přijetí, čas, místo, hotovo). Chat je doplněk.
- **Lokální základ.**  
  Poloha je core. Řazení i filtry jedou přes vzdálenost a radius.
- **Důvěra jako výsledek systému.**  
  Jasný pravidla, “měkká frikce”, definitivní konce (“zavřeno je zavřeno”), žádný obcházení.
- **Férová monetizace bez překvapení.**  
  Když něco stojí peníze, je to vidět, je to pochopitelný a dává to smysl.

<a id="ux-principy"></a>
### UX principy

> **Když to potřebuje nápovědu, je to špatně navržený.**  
> Tooltipy a otazníčky jsou náplast na design fail.

Moje pravidla UX:

- **Nulová tolerance k “hintům”.**  
  Žádný tooltipy, žádný bubliny, žádný “tady klikni”. UI musí obstát samo.
- **Konzistence > chytrost.**  
  Radši nudně správně než “wow” a pak milion výjimek.
- **Empty state je status, ne chyba.**  
  Vzor: **status → krátký proč → jedno jasný CTA**.
- **Prázdno je záměr.**  
  Méně šumu = méně nejistoty. Prázdnej feed není ostuda, je to signál.
- **Emoce můžou být v textu. Akce musí být mechanická.**  
  Status může být lidskej, CTA musí být vždycky jasný.
- **UI se chová fyzikálně přirozeně.**  
  Žádná magie, co se nedá předvídat. Když něco zmizí, má to důvod.
- **Animace jsou luxus, ne výmluva.**  
  Animace nikdy nesmí blokovat ovládání. UI je interaktivní hned.  
  Respektuju **`prefers-reduced-motion`**.

Cíl není udělat dojem. Cíl je odstranit frustraci tak, aby si toho uživatel skoro nevšiml.

<a id="komunikace"></a>
### Komunikace a transparentnost

Nejrychlejší způsob, jak zabít důvěru, je dělat tajnosti a pak se tvářit, že “to je pro tvoje dobro”. Já na to seru. Chci, aby bylo jasný **kdo** za tím stojí, **proč** to tak je, a **co přesně** se děje s datama a penězma.

Standard, kterej držím:

- **Jsem vidět.**  
  Žádný anonymní “tým”. Jméno, ksicht, odpovědnost.
- **Monetizace je přiznaná, čitelná a férová.**  
  Ceny, limity i důvod existence rozšíření jsou jasně napsaný.
- **Zdroják je veřejně k nahlédnutí (source-available, ne OSS).**  
  Důvěra nemá stát na tom, že mi “prostě věříš”, ale na tom, že si to jde ověřit.  
  Zároveň to není “dělej si s tím co chceš”. Licence je moje, pravidla použití jsou jasný.
- **Transparentní účet.**  
  Mám bankovní transparentní účet a je viditelně vytaženej i na landingu. Ne kvůli show, ale kvůli průhlednosti toků.
- **Žádný prodej dat třetím stranám.**  
  Ne reklamy, ne datový brokery, ne “partneři”. Tečka.
- **Měření bez šmírovacího cirkusu.**  
  Měření má dát lidem signál trhu a umožnit mechaniky. Neukládám IP, fingerprinty ani marketingový identifikátory.  
  Když něco měřím, umím říct *co*, *proč* a *co z toho má uživatel*.
- **Pravidla jsou veřejný a konzistentní.**  
  Když něco bloknu nebo omezím, musí být jasný proč. Žádný skrytý penalizace.
- **Změny nejsou tichý ojeb.**  
  Když změním něco zásadního, přiznám to.

---

<a id="konkurenceschopnost"></a>
## Konkurenceschopnost

Konkurence (Sbazar, Bazoš, FB Marketplace a spol.) není “špatná”. Je to starej svět: hodně šumu, hodně náhody, hodně domlouvání v mlze, málo jistoty. Lidi tam prodávají, protože tam “někdo je”, ne proto, že by to bylo příjemný.

Moje výhoda není jedna “killer feature”. Moje výhoda je **charakter trhu** a **klidnej systém**, kterej snižuje mentální dluh.

> Cíl není porazit všechny. Cíl je být tak příjemnej, že návrat do starýho chaosu bude bolet.

<a id="co-umim-lip"></a>
### Co umím líp

1) **Domluva: normální chat + strukturovaný fakta navíc**  
Chat existuje, ale systém drží fakta: zájem, přijetí/odmítnutí, čas, místo, potvrzení, ukončení, případně odkazy.

2) **Klidný UX, co nevysvětluje a netlačí**  
Žádný “školení”, žádný tooltipy. UI má být tak čitelný, že nepotřebuje kecy.

3) **Lokace jako core**  
Poloha je součást inzerátu. Vzdálenost a kontext jsou vidět rovnou v listu i detailu.

4) **“Zavřeno je zavřeno” + žádný obcházení**  
Transakce má začátek a konec. Zavřený znamená zavřený.

5) **Ochrana prodejce jako feature**  
Ignor zájmu bez postihu. Odpovědnost začíná až přijetím. Míň mentálního dluhu, míň stresu.

6) **Transparentnost jako systémová vlastnost**  
Pravidla jsou jasný, viditelný a konzistentní. Žádný black box.

7) **Data dělám pro uživatele**  
Metriky mají dávat signál trhu. Ne prodávat pozornost nebo uživatele.

8) **Měkká frikce místo manipulace**  
Jemná struktura, která zlepšuje chování bez moralizování.

9) **Minimalismus i v médiích**  
Nechci z feedu dělat video cirkus.

10) **Osobní data jen dočasně**  
Co je osobní a patří jen do kontextu transakce, nesmí v systému hnít věčně.

<a id="slabina"></a>
### V čem je má slabina

- **Network efekt:** Na začátku tam nebude “všechno”. Řešení je lokální start a budování komunity.
- **Míň impulsního prodeje přes chaos:** Míň šumu může krátkodobě vypadat pomaleji, dlouhodobě je to zdravější trh.
- **Transparentnost je závazek:** Znamená míň kliček a víc práce. Je to správně.
- **Nejsem pro každýho:** Někoho tenhle styl odradí. Filtr je záměr.
- **Průhlednost přitahuje i hejtry:** Počítám s tím. Je to cena za důvěru.

<a id="co-nedelam"></a>
### Co vědomě nedělám

- **Žádný prodej dat.** Nikdy.
- **Žádný dark patterns.** Žádný “nejde odejít”, schovaný volby, vynucený souhlasy.
- **Žádný pay-to-win.** Platíš za nástroje, ne za “vítězství”.
- **Žádný spam-notifikace a onboarding maily.** Informace ano, nátlak ne.
- **Žádný “AI řeší všechno”.** Důvěra stojí na prevenci, pravidlech a struktuře.
- **Žádný video feed.** Nechci dělat TikTok.
- **Žádný vysvětlování rozdílů proti konkurenci.** Rozdíl se má projevit chováním UI.

---

<a id="kodex"></a>
## Kodex

Kodex je moje “no bullshit” vrstva. Není to právní text, ale sada pravidel, který držím i ve chvíli, kdy by bylo lákavý je ohnout kvůli růstu nebo penězům.

> Pokud nějaká feature nebo monetizační nápad poruší kodex, tak je to automaticky **špatně**.  
> Ne “možná”, ne “nějak to vysvětlíme”. Prostě špatně.

Co je tady svatý:
- **Důvěra je výchozí stav**, ne odměna za poslušnost.
- **Žádný skrytý motivy** (tajný penalizace, “doporučení” co je ve skutečnosti reklama).
- **Monetizace je férová a přiznaná**: platí se za hodnotu, ne za manipulaci.
- **Žádný pay-to-win**: peníze nesmí dělat z lidí “lepší občany”.
- **Minimum dat a čistý důvody**: držím jen to, co má smysl držet.

<a id="duvera-default"></a>
### Důvěra jako výchozí stav

Důvěra není razítko po ověření identity. Je to vlastnost prostředí, kterou dělám tím, jak se systém chová.

- **Neověřuju důvěru přes identitu.** Nepotřebuješ občanku, aby ses mohl chovat normálně.
- **Hranice jsou jasný a vymahatelný.** Co nejde, prostě nejde (a nedá se to obcházet).
- **Odpovědnost začíná přijetím.** Nezájem není zločin. Přijetí je vědomý závazek.
- **Definitivní konce.** Zavřený věci zůstávají zavřený. Nový kontakt = nový začátek.
- **Systém je klidnej, lidi můžou být emotivní.** UI nezvyšuje stres, jen drží strukturu.

<a id="ferova-monetizace"></a>
### Férová monetizace a neaktivita

Monetizace je přiznaná a čitelná. Paywall není past. Je to cedule u dveří: vidíš ji dřív, než do nich vejdeš.

- **Platí se za hodnotu, ne za nátlak.**
- **Žádný “gotcha” momenty.** Žádný “dokonči to a pak zaplať”.
- **Férovost i v neaktivitě.** Nechci někoho potichu cucat jen proto, že zapomněl.
- **Zrušení musí být snadný a jasný.** Žádný schovávání.

<a id="no-p2w"></a>
### Žádné pay-to-win

- **Platíš za nástroje, ne za lež.**
- **Žádný skrytý boosty mimo pravidla.**
- **Žádný penalizace pro “neplatící”.**
- **Rovný základ trhu.**

<a id="respekt"></a>
### Respekt k uživateli

- **Neotravovat.** Notifikace jsou informace, ne bič.
- **Nemanipulovat.** Žádný dark patterns, žádný confirm shaming.
- **Dávat kontrolu.** Filtry, ignor, citlivost, ukončení.
- **Neznehodnocovat čas.** Minimum kroků, žádný zbytečný potvrzování.
- **Nebýt creepy.** Data mají účel v produktu, ne v reklamním profilování.

<a id="otevrenost"></a>
### Otevřenost a odpovědnost

Nejsem anonymní “tým” a nechci se za nic schovávat. Když něco poseru, je to moje. Když něco funguje, je to taky moje. One-man projekt, žádný zákulisní magie.

- **Jsem dohledatelnej a viditelnej.**
- **Pravidla nejsou magie.** Když systém něco dělá (gating, řazení, omezení), má to čitelný důvody.
- **Systém má běžet bez ručního cirkusu.** Co jde vyřešit strukturou a mechanikama, má vyřešit struktura a mechaniky.

---

<a id="koncepty"></a>
## Koncepty

Tady je ta část, kvůli který tenhle dokument existuje.

Cíl: když se zeptáš **„Jak funguje X?“**, tak to najdeš **na jednom místě**.  
Žádný sbírání drobků napříč “UI”, “mechaniky”, “kameny”… tohle je jeden celek.

### Pravidla konceptů
- Každej koncept je **uzavřená kapitola**: definice, pravidla, UX/UI dopady, eventy, edge-cases.
- Když je něco “obecně”, ale prakticky to patří do konkrétního konceptu, **je to v konceptu**.
- Křížový věci (např. citlivost, limity, ekonomika) existují jako vlastní koncepty a ostatní na ně odkazují.

### Navigace
- [Uživatel](#koncept-uzivatel)
- [Kategorie](#koncept-kategorie)
- [Lokace](#koncept-lokace)
- [Inzerát](#koncept-inzerat)
- *(další koncepty budou pokračovat: Draft, Feed, Transakce, Zprávy, Inbox, Viditelnost & gating, Limity, Lifecycle, Reputace & metriky, Ekonomika…)*

---

<a id="koncept-uzivatel"></a>
### Uživatel

#### Přehled
Uživatel je core entita. Je na něj navázaný skoro všechno (inzeráty, drafty, feedy, transakce, inbox…), ale **osobní data držím na minimu** (viz kodex). Tady řeším hlavně vazby a to, co uživatel *ovládá*.

#### Co uživatel ovládá (konceptuálně)
- svoje **Feedy** (uložený pohledy na trh),
- svoje **Drafty** (rozpracovaný inzeráty),
- svoje **Inzeráty** (živý i historický),
- svoje **Transakce** (zájem, domluva, uzavření),
- svůj **Inbox** (co se stalo),
- **nastavení citlivosti** a další gatingy (aby měl kontrolu nad obsahem),
- **rozšíření / passy / předplatný** (ekonomika, řeší se v konceptu Ekonomika).

> Důležitý pravidlo: systém se snaží být klidnej. Uživatel nemá pocit, že mu něco “někde utíká”.

---

<a id="koncept-kategorie"></a>
### Kategorie

#### Přehled
Kategorie je organizační vrstva trhu. Dává kontext: “v autech dává smysl něco jinýho než u oblečení”. Nechci univerzální formulář pro všechno, protože to končí balastem.

Kategorie nese:
- **název**
- **slug**
- **locale**

#### Category Spec (parametry)
Kategorie může definovat “spec” parametrů (dobrovolně), který dávají smysl právě v ní (auta: rok, byty: plocha, vaping: typ baterky…).

Spec je autorita pro:
- **UI tvorby inzerátu** (jaký pole existujou, jak se editujou),
- **UI filtrování feedu** (jaký filtry jsou relevantní).

Parametr má:
- identifikátor,
- typ (text / enum / number / bool / date …),
- režim filtru:
  - **nefilterovatelný** (jen informativní),
  - **equality** (shoda),
  - **range** (od–do).

**Range filtry jsou vždy vědomý rozhodnutí.** Nikdy se nestanou “samy od sebe”, protože by to potichu rozbíjelo UX i výkon.

---

<a id="koncept-lokace"></a>
### Lokace

#### Přehled
Lokace je autorita na polohu. Ne “nějakej string co člověk napíše”, ale validní záznam z vyhledávání adres (jako autority).

#### Pravidla
- Neukládám random texty typu “u Pepy na rohu”.
- Všechno, co používá polohu, se váže na lokaci:
  - **Feed** (radius, řazení podle vzdálenosti),
  - **Inzerát** (povinná poloha),
  - **Předání** v transakci (strukturovaná lokace v timeline).

> Lokace je core: bez ní nejde dělat lokální trh, radius ani přirozený řazení.

---

<a id="koncept-inzerat"></a>
### Inzerát

#### Přehled
Inzerát je souhrn atributů a galerie fotek reprezentující nabízenou věc.  
Veškerá interakce mezi lidmi se nakonec váže na inzerát, i když technicky vzniká přes Draft.

#### Atributy (co inzerát nese)
| Oblast | Co typicky obsahuje | Poznámka |
|---|---|---|
| Obsah | title, description (Markdown), pros/cons | Popis je informativní, ne indexovaný “fulltextem” jako klíčová autorita |
| Galerie | uploady + pořadí | Video u inzerátů nepodporuju |
| Cena | částka + měna + typ (pevná / otevřená) | “Otevřená” je signál, ne smlouva |
| Globální parametry | condition (A–F), age (A–F), delivery, warranty | Škály A–F jsou abstraktní signál (detail řeší vlastní koncept) |
| Kategorie-spec parametry | data dle Category Spec | typicky JSON objekt / JSONB |
| Lokalita | locationId + lat/lon | kvůli řazení podle vzdálenosti + radius filtry |
| Čas | createdAt / updatedAt / expiresAt | expirace je přirozený úklid trhu |

#### Kategorie-spec parametry: defaultně “JSON”, vytknutí je vědomý krok
Nové a specifické atributy přichází defaultně jako **kategorie-spec** (JSON).  
Pokud je něco dlouhodobě zásadní (výkon, filtr, UX), můžu to **vytknout** jako samostatný atribut (a udělat migraci).

Není to automatika. Je to vědomý rozhodnutí autora.

---

#### Měření (eventy a metriky)

Měření slouží ke dvěma věcem:
1) dát prodávajícímu férovej signál „děje se to / neděje se to“,  
2) umožnit mechaniky (např. anti-topper / payback) bez šmírovacího cirkusu.

Měření je **objektově orientované**: sleduju **inzerát**, ne člověka.

##### Principy
- Eventy jsou **append-only** a používají se pro agregace.
- Neukládám IP, device fingerprinty ani marketingový identifikátory.
- Deduplikace je záměrně “měkká” (typicky na klientovi v rámci jedný relace). Nehoním laboratorní přesnost, chci konzistentní signál.

##### Eventy + metriky (vznik + pravidla)

| Event | Kdy vzniká (pravidlo) | Smysl / poznámka | Deduplikace / limity |
|---|---|---|---|
| `visible` | karta v listu ve viewportu ≥ **0,5 s** | „uživatel to reálně viděl“ | max 1× na jedno zobrazení listu pro danej inzerát |
| `impression` | karta v listu ve viewportu ≥ **1,6 s** | „zaujal, zpomalil“ | max 1× na jedno zobrazení listu pro danej inzerát |
| `view` | detail otevřený ≥ **2,5 s** | „reálnej zájem o detail“ | max 1× na jedno otevření detailu |
| `anti-topper` | když má uživatel aktivní anti-topper a inzerát by měl být v listu zvýrazněnej (Top/Mark), systém místo `visible` zapíše `anti-topper` | měří „kolikrát bylo zvýraznění potlačeno“ (metriky + případnej payback); pro **Top Maxxi** se negeneruje | typicky stejný limity jako `visible` (ne spam) |

##### Deduplikace a frekvence (ať z toho není spam)
- `visible` / `impression` max. jednou na jedno zobrazení listu pro danej inzerát
- `view` max. jednou na jedno otevření detailu

> Stavy inzerátu + lifecycle (live/expired/sold/closed) budu držet přímo v konceptu Inzerát, ale rozepíšu je až po Draftu a Viditelnosti, protože to spolu souvisí.

#### Stav a lifecycle (kdy je inzerát “ve hře”)

Inzerát má v DB **tvrdý status** (enum). To je autorita. Žádný “vibe”.

| Stav | Co to znamená | Feed (default) | Přímý odkaz / detail | Interakce |
|---|---|---|---|---|
| `live` | aktivní, k dispozici pro nový obchod | ano | ano | vše relevantní (zájem, ignor, oblíbené, flag…) |
| `expired` | vypršela expirace (`expiresAt`), automatický konec | ne (jen přes explicitní filtr / historický režim) | ano (read-only) | zakázáno, výjimka **flag** |
| `closed` | prodejce to ručně zabil | ne (stejně jako `expired`) | ano (read-only) | zakázáno, výjimka **flag** |
| `sold` | prodáno, není k dispozici pro nový obchod | ne (není k dispozici) | ano (read-only) | zájem ne; bezpečný věci typu flag/undo ignor ok |

Poznámky:
- **Draft není stav inzerátu.** Draft je separátní entita (viz níž).
- **`deleted` neexistuje.** Inzeráty nemažu. Jen mění stav (`live` / `expired` / `closed` / `sold`). Paměť trhu je záměr.
- `sold` se **nepočítá** jako aktivní (neleze do limitu aktivních inzerátů).

---

#### Automatické ukončení (expirace)

Expirace je povinná volba, protože drží pořádek a brání hřbitovům mrtvol. Nechci ruční úklid a nechci “navždy” jen proto, že někdo zapomněl.

Jak to funguje:
- Prodejce při tvorbě nastaví, **kdy se má inzerát automaticky ukončit**.
- Čas běží **až po zveřejnění**, ne v draftu.
- Po uplynutí doby se inzerát přepne do **`expired`**.

Předdefinované volby:
- **Za týden**
- **Za dva týdny**
- **Za měsíc** *(placená volba)*  
  Záměrně placená, protože jinak kanibalizuje **Kontinuální nabídku**. Zpřístupní se přes Kupón (např. „Prodloužený inzerát“) nebo v rámci předplatného.

UI u volby ukazuje i konkrétní datum (žádná matematika v hlavě).

Důsledek expirace:
- `expired` zůstává dostupný přes přímý odkaz (read-only),
- ve feedech se ukáže jen s vědomým filtrem,
- interakce jsou vypnuté, výjimka je **flag**.

---

#### Listing vs detail (viditelnost a brány)

Seznam (listing) je **vždycky výsledek dotazu** (feed/hledání). Detail je otevření konkrétní entity.

1) **Listing (seznam)**  
Inzerát buď projde filtrem, nebo vypadne.

2) **Detail (přímý odkaz)**  
Detail se má dát otevřít i mimo seznam (sdílení linku, historie, uložený odkaz).  
Tvrdé pravidlo: **jen citlivost** může blokovat detail a vracet **404** (aby nešlo obcházet).

Defaultně se v listingu neukazuje:
- `expired` a `closed` (jen přes explicitní filtr / historický režim),
- `sold` (není k dispozici), ale detail zůstává jako paměť trhu.

Hard strop výstupu listingu:
- **200 inzerátů na dotaz** (výkon + použitelnost). Když chce někdo víc, ať zúží filtr. Hotovo.

---

#### Boosty, priority sort a Anti-topper

Listing má priority (boosty nejsou kosmetika, ale produktová mechanika):

1) **Top Maxxi** (vždy nahoře, imunní)
2) **Top**
3) **Běžné inzeráty**

Uvnitř skupiny řadím podle preference uživatele (cena, vzdálenost…).

**Anti-topper** mění chování listingu:
- **Top Maxxi** zůstává nahoře (imunní).
- **Top + běžné** se smíchají a řadí se čistě podle preference uživatele.  
  Top ztratí výhodu pozice, zůstane mu badge.

Anti-topper nikdy neblokuje detail. Je to mechanika listingu, ne “zákaz existence”.  
A pro měření používám `anti-topper` event (viz tabulka eventů výš).

---

#### Release window (Early Access / Early Delivery)

Nově publikovaný inzerát má release window: běžným uživatelům se v listingu ukáže až za **+8 hodin** od publikace.

- **Bez Early Access:** do listingu se nedostane, dokud neuplyne +8h.
- **S Early Access (kupující):** vidí ho hned (release window ignoruje).
- **S Early Delivery (prodávající / per-inzerát):** zruší okno úplně, takže ho vidí hned i lidi bez Early Access.

Pravidlo “žádný stackování”:
- maximum posunu je vždycky **8 hodin**.  
  Early Delivery ruší okno, nedělá “super-early”.

Release window **neblokuje detail přes přímý odkaz** (zase: krom citlivosti).

---

#### Kontinuální nabídka

Kontinuální nabídka je legální způsob, jak **řízeně prodloužit život** bez toho, aby tu věci hnily navěky zadarmo.

Jak to funguje:
- Je to **Pass**, který prodlužuje aktivní cyklus inzerátu (prakticky posouvá “efektivní expiraci”).
- Aktivuje ji **vlastník inzerátu**.
- Lze ji zapnout kdykoliv:
  - když je inzerát ještě `live`, prodloužení se **naváže na expiraci** (nekrade čas),
  - když je už `expired`, začne to **okamžitě** a inzerát se vrátí mezi `live`.

Chování během aktivního passu:
- Inzerát se chová jako normální `live`:
  - leze do feedů (přes filtry),
  - jde na něj založit transakce,
  - metriky se počítají normálně.
- Po vypršení passu se vrací do režimu `expired` (read-only, mimo standardní feedy).

Nic z toho nikdy neobchází systémový brány (citlivost, ignor, release window…).

---

<a id="koncept-draft"></a>
### Draft

Draft je vstupní bod tvorby. Inzerát nenechám vzniknout “kliknutím”. Vzniká až publikací Draftu.

Co je Draft:
- kopie atributů budoucího inzerátu “ve stavu zrodu”,
- podporuje postupnou tvorbu (autosave) bez rizika ztráty dat,
- spravuju seznam Draftů (a do budoucna to přirozeně umožní šablony / kopírování).

Co Draft není:
- není to “stav inzerátu”,
- není to něco, co by se mělo hromadit jako skladiště nedodělků (drafty jsou samostatná kategorie, ale nemají být nekonečná hromada).

UX kontrakt Draftu:
- návrat/back je vždycky bezpečnej (autosave),
- editor je otevřenej, ne-lineární: sekce jsou klikací “karty” (klik & edit) a každá úloha má vlastní full-focus edit obrazovku,
- žádnej sticky header “abych se cítil produktově”, žádnej horní křížek, bottom nav je mentální kotva,
- destruktivní akce (smazání draftu) je dvoufázově inline, ne modalovej teatr.

---

<a id="koncept-feed"></a>
### Feed (Entita)

Feed je uložené nastavení filtru nad inzeráty. Není to “seznam”, je to **předpis**: „co chci vidět a odkud“.

Co feed nese:
- filtry (kategorie, parametry, cena…),
- radius + vlastní lokalitu (např. “domov” vs “chalupa”), včetně řazení podle vzdálenosti,
- řazení (v rámci pravidel systému).

Typy feedu:
- `user` = vědomě uložený feed (“můj seznam”)
- `search` = systémový kontext hledání (UI zkratka), není to “můj seznam”

Pravidla:
- defaultně zakládám uživateli jeden obecný feed bez filtrů (bezpečná návratová volba).
- “Hledání” je systémově special-case instance Feedu, ne jiný datový svět.
- feed nikdy neobchází globální brány (citlivost, ignor, stavy inzerátu, release window…).

---

<a id="koncept-citlivost"></a>
### Citlivost (hard gate)

Obsah není jen “co prodávám”. Obsah je i to, *jestli to můžeš vůbec vidět*. Citlivost je hard gate: chrání veřejnej prostor před obsahem, kterej určitá skupina lidí buď **nechce**, nebo ho **ani nesmí** vidět.

Tohle je kritická část appky, protože tady se důvěra vědomě svěřuje uživateli. Zbavík není puritán ani cenzor. Platí jednoduchý rámec:

> **Na Zbavíku se dá prodávat všechno, co dovoluje zákon.**  
> A uživatel má povinnost ten zákon respektovat. Tečka.

#### Úrovně citlivosti (stupňovaně)

| Úroveň | Enum | Co to je | Typické příklady | Poznámky |
|---|---|---|---|---|
| Běžný | `common` | Normální věci, co nikoho rozumnýho nepřekvapí | elektronika, nábytek, oblečení, knihy, dětský věci, sport, nářadí, domácnost | default |
| Pro dospělé | `adult` | Adult kontext / 18+ | alkohol, vaping / e-cigarety a příslušenství, legální erotika, “adult” doplňky | nechci míchat do veřejnýho feedu pro děti |
| Citlivé | `sensitive` | Kontroverznější věci, co můžou znervóznit nebo vyžadujou víc rozumu | airsoft výbava, repliky, taktický gear, některý sběratelský věci “na hraně” | pořád může být legální, jen to nechci cpát všem |
| Omezené | `restricted` | Věci se zákonným omezením / vyžadují konkrétní oprávnění | typicky zbraně apod. | systém **neověřuje oprávnění**, odpovědnost je na prodejci |

Pravidlo stupňování: `common < adult < sensitive < restricted`.  
Kdo si povolí vyšší, implicitně povoluje i všechny nižší.

#### Gating a viditelnost (dvoufázově, schválně)

| Kde | Co se děje | Smysl |
|---|---|---|
| Default | každý vidí jen `common` | veřejnej prostor zůstane klidnej |
| Profil (maximum) | nastavíš **strop**: kam *smíš / jsi ochotnej jít* (např. až `restricted`) | profil = co **smíš** |
| Feed / hledání (filtr) | v rámci maxima si **vědomě** zapneš, co *chceš vidět* | feed = co **chceš** |
| Listing (feed, search, jakýkoliv seznam) | cokoliv **nad maximum** se **vůbec nedostane do výsledků** | žádný “náhodou jsem to zahlídnul” |
| Detail přes přímý odkaz | pokud citlivost nesedí na maximum uživatele, server vrací **404** | žádný obcházení přes link, žádný “aspoň víš že to existuje” |

UI pravidlo po opt-inu:
- žádný blur, žádný “jsi si jistý?”, žádný divadlo,
- citlivost se jen ukazuje jako **badge** (v listingu i detailu).

#### Hard gate pravidla a výjimky

- Citlivost je **tvrdá brána napříč celou aplikací** (feed, hledání, uložený feedy, přímý odkazy).
- **Citlivost je jediná výjimka**, která smí detail tvrdě schovat (404).  
  Ostatní brány (ignor, expirace, release window, anti-topper…) můžou ovlivnit **seznam**, ale **nesmí** dělat “ten inzerát pro tebe neexistuje”.

#### Odpovědnost a enforcement

- Citlivost je primárně **sebeoznačení** (odpovědnost prodávajícího).
- Opakovaný a zjevný zneužití (maskování citlivýho/omezenýho jako běžný) = porušení pravidel a důvod k **ručnímu banu**.
- Cíl není hrát si na policajta. Cíl je mít **jasný brány a jasný signál**, aby feed nezdegeneroval v bordel.

---

<a id="koncept-ignor"></a>
### Ignorování

Ignor je osobní úklid. Není to trest, není to report, není to drama.

Co ignor znamená:
- ignorovaný inzerát je pro uživatele **skrytej ze všech seznamů** (feedy, hledání),
- ignor **nic nemění globálně** (nepenalizuje prodejce, nikomu se o tom nic nehlásí),
- ignor se propíše do metrik inzerátu jako signál „tohle lidi nechtějí vidět“.

Detail přes přímý odkaz:
- ignor nesmí blokovat otevření detailu,
- v detailu je vidět stav „Ignoruješ“ + akce „Zrušit ignor“.

Parametr listingu:
- feed i hledání podporují `withIgnored`:
  - `false` (default) = ignorované se nezobrazují
  - `true` = ignorované se zobrazují (např. kontrola)

Scope:
- ignor je globální per-user (napříč zařízeními),
- je to per-user doménovej stav (ne anonymní analytika).

Ignor není flag:
- ignor = “nezajímá mě to”
- flag = “porušuje pravidla / ojeb / nebezpečný”
UI to nesmí míchat.

---

<a id="koncept-limity"></a>
### Limity

Limity nejsou trest. Jsou to mantinely, aby se systém nezměnil v hromadu mrtvol a nekonečných rozpracovaných pokusů.

Limit feedů:
- počítám jen feedy typu `user`,
- `search` je mimo limity,
- při překročení feedy nemažu, jen ty nadlimitní v UI skryju/disable (existují, ale uživatel ví, že je má navíc).

Limit aktivních inzerátů:
- limituju pouze inzeráty ve stavu `live`,
- při překročení limitu (typicky vypršení passu):
  - existující `live` nechám doběhnout,
  - aktivuje se **Draft Gate** (uživatele nepustím vytvářet/publikovat nový `live`).

<a id="koncept-notifikace"></a>
### Notifikace a Inbox

Notifikace nejsou nástroj na otravování. Jsou to **zrcadlo reality**, aby člověk věděl, co se stalo, a nemusel paranoidně refreshovat appku.

#### Filosofie ticha
Defaultní stav je **ticho**.
- pushky v MVP **vůbec neřeším**
- žádný “marketingový připomínky”
- žádný umělý FOMO

Když se něco stane, je to dostupný v Inboxu. Tečka.

#### Inbox First (single source of truth)
Inbox je **jedinej zdroj pravdy** pro události v systému:
- nový zájemce / změna stavu transakce
- nová zpráva
- expirace inzerátu / konec passu
- systémové změny, které se týkají uživatele (pravidla / podmínky / incidenty)

Email je jen volitelný „přenos“ toho, co už je v Inboxu.

#### Email jako zrcadlo (forwarder / digest)
Email není primární kanál. Je to nastavitelný výstup:

| Režim | Co to dělá | Default |
|---|---|---|
| nikdy | nic neposílám | ✅ |
| okamžitě | forward (přeposílám hned) |  |
| denní souhrn | digest (1× denně) |  |

Uživatel si může vybrat i **typy**, které chce posílat:
- transakční (obchodní věci)
- systémové (důležitý stavy a expirace)
- marketing (default **off**)

#### Kritické výjimky
Některý věci se neptají a na email jdou vždy:
- reset hesla
- bezpečnostní alerty (přihlášení, podezřelá aktivita)

---

<a id="koncept-hledat"></a>
### Hledat

Hledat je samostatná primární sekce. UXově to není „feed“, ale **vyhledávací kontext**, který se v backendu chová jako feed, protože používá **stejnej engine, stejný filtry a stejnej list UI**.

#### `search` jako systémový kontext
- V systému existuje feed typu **`search`**.
- `search` je **singleton**: max 1 instance na účet.
- `search` se **nezobrazuje v “Moje seznamy”** a uživatel ho nespravuje jako normální feed.
- `search` je mimo limity: **nezabírá slot** (limity se týkají jen feedů typu `user`).

`search` si pamatuje poslední stav Hledat (dotaz, filtry, radius, lokaci, řazení…), aby se člověk vracel do stejného kontextu.

#### UI kontrakt
- input + filtry + výsledky v listu
- výsledky používají **stejný list** jako feedy (karty, interakce, eventy)
- žádná “speciální pravidla” navíc: jen skládám filtry a ukazuju výsledek

#### Uložení hledání jako feed
Akce **„Uložit jako feed“**:
- vytvoří nový feed typu `user`
- zobrazí se v „Moje seznamy“
- **počítá se do limitu**

Když je uživatel na limitu feedů:
- ukládání se blokuje (jasný důvod, žádný kecy)
- Hledat dál funguje normálně

#### Reset
Hledat má vždy rychlou akci **„Reset“** (vrátí dotaz/filtry do neutrálu).  
Bez modalů, bez výčitek, prostě reset.

---

<a id="koncept-multi-category"></a>
### Multi-Category

Multi-Category je **distribuce**, ne duplikace. Nevznikají žádné kopie inzerátu, jen se rozšíří množina kategorií, přes které se může zobrazit.

#### Jak to funguje
- Inzerát má jednu **primární kategorii** (autorita pro UI, jazyk a Category Spec).
- Multi-Category přidá k primární až **2 sekundární kategorie** (čistě distribuční).
- Sekundární kategorie **nikdy** nejsou cesta, jak si vybrat “výhodnější” atributy. Primární je pravda.

#### Viditelnost a deduplikace
- V rámci jednoho renderovanýho seznamu se inzerát zobrazí **právě jednou**, i když matchuje víc kategorií.
- Po přepnutí do jinýho kontextu (jiný feed/hledání) ho může uživatel vidět znovu. To je v pořádku.

Feed/hledání, které filtruje konkrétní kategorii, bere inzerát jako match, když:
- filtr = primární kategorie **nebo**
- filtr = jedna ze sekundárních kategorií

---

<a id="koncept-reputace"></a>
### Reputace a metriky

Reputace není show pro veřejnost. Je to nástroj, který lidem pomáhá dělat rozhodnutí bez paranoie a bez tajný magie.

Dvě zásady:
- nesnažím se „hodnotit lidi místo lidí“
- nebuduju tajný skóre, co někoho tiše pohřbí

#### Signály v systému

| Signál | Cíl | Kde / kdy | Důležitý pravidlo |
|---|---|---|---|
| Flag inzerátu | „tady je problém“ | detail inzerátu (toggle) | žádnej auto-shadowban; je to signál + ruční rozhodnutí |
| Flag uživatele | problém s člověkem | **jen v rámci transakce** a až po `open` | bez kontextu je to toxická zbraň |
| Palce (Like/Dislike) | atraktivita nabídky | per-inzerát | nejsou veřejný ego-lajky; je to data + signál |
| Karma (Like/Dislike) | jak proběhl obchod | v transakci, až po `open` | kdo nehlasuje = neutrál; karma != flag |
| Ban | stopka | ručně (já) | ne automat; důvody: podvody/spam/ojeby + opakovaný maskování citlivosti |

#### Detail protistrany (placený nástroj)
Bez passu **neukazuju nic**. Ani “Score”. Buď máš nástroj, nebo nemáš.

S passem ukazuju:
- **Score (A–F)** + konkrétní metriky (ať to není magie)

Co měřím (příkladový výtah):
- u **prodejce**: reakční doba, rate odmítnutí bez interakce, resolved rate, expirace, vytížení paralelníma obchodama, aktivita, flag rate
- u **kupujícího**: reakční doba, closer rate (instant uzavírání bez interakce), decision rate, expirace, vytížení, aktivita

UX pravidlo: žádný grafový porno. Každá metrika má krátký lidský popisek „co to znamená“.

---

<a id="koncept-transakce"></a>
### Transakce

Transakce je most mezi prodávajícím a kupujícím. V UI je to „Zprávy“, ale je to **řízená interakce**, ne volný DM.

Základní kontrakty:
- 1 vlákno = 1 transakce = 1 konkrétní inzerát (izolovaný kontext)
- transakce má stav a lifecycle
- „zavřeno je zavřeno“: finální stavy jsou read-only, nejde re-open

#### Stavový model (prakticky)

| Stav | Kdy | Co je povolený |
|---|---|---|
| `pending` | kupující klikne „Mám zájem“ | kupující **nemůže psát**; prodejce jen **Přijmout** / **Odmítnout** |
| `open` | prodejce přijme | odemknou se zprávy + strukturovaný widgety |
| `rejected` | prodejce odmítne | read-only |
| `closed` | někdo ukončí / dohoda skončí | read-only |
| `sold` | prodáno | read-only |
| `expired` | transakce vyprší (nedotažená) | read-only |

Pozn.: pokud existuje režim `resolved` / dispute, čistky se pozastaví, dokud to není definitivně ukončený.

#### Anti-spam a ochrana prodejce
- Prodejce může zájem **ignorovat bez postihu**. Odpovědnost začíná až přijetím.
- Kupující v `pending` **nemůže spamovat zprávama**.
- Odmítnutí je legitimní volba bez vysvětlování. Žádnej mentální dluh.

#### Timeline místo chatu
Detail transakce je **časová osa faktů**:
- systémové stavy (zájem, přijetí/odmítnutí, ukončení, prodáno)
- textový zprávy (když chtějí)
- strukturovaný widgety (když je text zbytečnej)

Systém drží pravdu vedle toho, i když si lidi píšou normálně.

---

<a id="koncept-zpravy"></a>
### Zprávy (obsah transakce)

Zprávy jsou obsah transakce. Vedle textu podporuju i strukturovaný data, protože spoustu věcí je blbost řešit slohovkou.

| Typ obsahu | Příklad | Proč existuje |
|---|---|---|
| text | domluva, doplnění | volnost pro lidi |
| obrázky | detail věci / doplnění | rychlej důkaz místo keců |
| strukturovaná data | lokace, tracking, kontaktní údaje… | čitelnost + cílený mazání |
| systémové zprávy | „Prodáno“, „Odmítl“, „Ukončeno“… | timeline faktů, ne interpretace |

Strukturovaná data ukládám **odděleně**, aby šla snadno a cíleně mazat (GDPR / clean-up).

---

<a id="koncept-cistky"></a>
### Čistky dat (retence transakcí)

Transakce je dočasná věc. Slouží k domluvě a uzavření obchodu. Pak už nemá důvod existovat věčně, protože z toho leze jen riziko a bordel.

#### Dvoufázový úklid po ukončení transakce

| Kdy | Co se děje | Proč |
|---|---|---|
| ihned po finálním stavu (`closed` / `sold` / `expired`) | mažu **strukturovaná PII** (adresy/přesná místa, telefon, kontakty, poznámky k předání jako struktura, cokoliv explicitně označený jako PII) | rychle snížit riziko |
| po 3 měsících od definitivního ukončení | **hard delete celé transakce** (zprávy text+obrázky, systémové události ve vlákně, vazby na transakční uploady) | trvalý úklid |

Zůstávají jen agregované metriky a anonymní eventy, které nejsou navázaný na obsah konverzace.

#### Co úklid nepřepisuje
- Čistky se týkají **transakcí**, ne inzerátů.  
  Inzerát jako “paměť trhu” zůstává (read-only), chat jako dočasná domluva po čase mizí.

#### Pozastavení čistek
- Pokud je transakce `open` / `resolved` / aktivně se řeší (včetně dispute), čistky neběží.
- Timer “3 měsíce” se počítá od okamžiku, kdy je transakce **definitivně ukončená**.

<a id="koncept-tracking"></a>
### Tracking odkaz v chatu (zásilka)

Tracking není “bezpečnostní feature”. Je to jen fakt v timeline. Nechci dělat falešný bezpečí. Chci jen, aby člověk nepřehlídl divnou/falešnou doménu.

#### Co ukládám
- **URL je vždy povinná** (bez URL to nemá smysl).
- **Tracking number je volitelný**.

#### Jak to zobrazuju (UX)
Cíl: doména musí být vidět jako první. Zbytek je stejnej technickej text, žádný chytrý komentáře.

| Prvek | Jak vypadá | Proč |
|---|---|---|
| Doména | velká, výrazná | nejrychlejší signál, kam to vede (anti-phishing v praxi) |
| Celá URL | menší “technickej” styl | kontrola bez vizuálního křiku |
| Tracking number (když je) | label `Zásilka: XYZ` | čitelný, krátký, konzistentní |

Pravidla:
- **Žádný heuristiky.**
- **Žádná validace.**
- **Žádnej whitelist dopravců.**
- **Žádný auto-preview / fetch metadat.**
- Když tracking number **není**, prostě se **nic navíc nepíše** (žádný “odkaz na stránky dopravce”).

---

<a id="koncept-warranty"></a>
### Záruka (enum)

Záruka je signál pro filtrování, ne právní nástroj platformy. Platforma záruky neřeší. Je to mezi lidma.

| Hodnota | Enum | Význam | Příklad |
|---|---|---|---|
| Bez záruky | `no-warranty` | nic nenabízím | „kupuješ jak stojí a leží“ |
| Vlastní záruka | `custom` | něco mimo zákon | „7 dní na vyzkoušení“ |
| Zákonná záruka | `warranty` | typicky účtenka / doložitelný nákup | „mám účtenku“ |

Použití:
- jde přes filtry ve feedu
- není to “garance” od platformy

---

<a id="koncept-delivery"></a>
### Způsob předání (delivery)

Způsob předání je signál pro kupujícího a filtr ve feedu. Není to smlouva ani závazek, jen preference prodejce.

#### Enum hodnot

| Hodnota | Enum | Co to znamená | Poznámka |
|---|---|---|---|
| Osobně | `personal` | osobní předání | defaultní “sousedský” režim |
| Pošta | `post` | dopis/pošta obecně | neřeším dopravce, jen typ |
| Balík | `package` | balíková služba / zásilkovna / kurýr | pořád jen signál, ne integrace |
| Jinak | `other` | cokoliv mimo standard | pro specifika (např. “jen přes firmu”, “jen na místě”) |

#### Pravidla
- delivery je **dobrovolný atribut** inzerátu
- slouží pro:
  - zobrazení v detailu (rychlý očekávání)
  - filtr ve feedu
- platforma nevynucuje logistiku ani nedělá “garanci doručení”

---

<a id="koncept-popis-inzeratu"></a>
### Popis inzerátu (Markdown)

Popis je dobrovolná “měkká vrstva informací”. Nechci z toho dělat SEO pole ani databázi pravdy.

Pravidla:
- popis je v **Markdownu** (volitelně)
- **nepoužívá se pro technické vyhledávání ani indexaci**
- slouží jen jako hrubá informativní vrstva pro lidi v detailu

Cíl: aby se produkt nezvrhl do “piš romány, aby tě někdo našel”. Signál má být ve strukturách, ne v balastu.

---

<a id="koncept-video"></a>
### Video u inzerátů (ne)

Video je v 95 % případů šum, ne hodnota. A technicky je to černá díra na náklady.

Rozhodnutí:
- upload videí k inzerátům **nepodporuju** (minimálně v rané a střední fázi)

Důvody:
- většina uživatelů to použije nekvalitně a rozbije feed
- infra náklady (upload, storage, CDN, transkódování, preview, mazání) jsou velký
- přínos je úzkej a kontextovej

Pokud někdy:
- jen vybraný kategorie
- jen velmi omezeně
- jen když to bude dávat fakt smysl

---

<a id="koncept-skaly"></a>
### Škály (A–F) jako obecný princip

Škála A–F je jednotnej způsob, jak v appce vyjádřit “jak dobrý / jak špatný” bez toho, aby lidi museli číst romány nebo řešit kontextový čísla, který stejně každý chápe jinak.

Používá se napříč appkou (stav, věk, score protistrany atd.), ale definice je vždycky stejná.

#### Význam
- **A = nejlepší**
- **F = nejhorší**

#### UI škála (A–F)

| UI hodnota | Význam |
|---|---|
| A | top / nejlepší |
| B | velmi dobrý |
| C | ok / průměr |
| D | slabší |
| E | špatný |
| F | nejhorší |

*(B–E jsou “lidský stupně”, ne matematika. Důležitý je konzistentní framing.)*

#### Interní reprezentace (1–6)

Aby se s tím dalo počítat bez debilního porovnávání stringů:

| UI | Interně | Poznámka |
|---|---:|---|
| F | 1 | nejhorší |
| E | 2 |  |
| D | 3 |  |
| C | 4 |  |
| B | 5 |  |
| A | 6 | nejlepší |

Tohle je interní “kratší forma” pro jednoduchý porovnání a řazení.

#### Interní škála pro výpočty (0–100)

Pro složitější výpočty (vážení více signálů, normalizace, score protistrany apod.) používám interní kontinuální škálu:

- **0–100** (0 = nejhorší, 100 = nejlepší)

Na konci se to vždycky mapuje zpět na A–F pro UI.

#### Mapování 0–100 → A–F (standard)

| Range (0–100) | UI |
|---:|---|
| 0–16 | F |
| 17–33 | E |
| 34–50 | D |
| 51–66 | C |
| 67–83 | B |
| 84–100 | A |

Pravidla:
- mapping je **konzistentní napříč appkou** (žádný “tady je A jinak”)
- UI vždycky ukazuje jen A–F, ne 0–100 (nechci z toho dělat dashboard)
- interní 0–100 je čistě nástroj pro výpočty, ne pro ego

---

<a id="koncept-activity"></a>
### Activity / timeline (živost trhu)

Lidi se nevracejí jen nakoupit. Vrací se “podívat se, jestli se něco objevilo”. To je rituál. A já chci, aby trh působil živě i v raný fázi.

Activity/timeline:
- je **živý proud dění v aplikaci**
- obsahuje hlavně **automatické systémové události**, milníky a mikro-odměny
- uživatelský vstupy jsou volitelný a nesmí to zničit

Pravidla:
- timeline nesmí být zahlcená ani zneužitelná
- nesmí z toho být chat, statusy ani sociální síť
- má to podporovat návraty a zvědavost („něco se děje“), ne stres

---

<a id="koncept-gamifikace"></a>
### Gamifikace a notifikace (jemně, ne cirkus)

Gamifikace není náhrada hodnoty produktu. Je to jemná zpětná vazba.

Co používám:
- **goldíky / XP / levely**
- odměny vycházejí z reálných interakcí (zhlédnutí, fair-mode views, dokončené obchody)

Jaký notifikace chci:
- informovat a odměňovat, ne tlačit
  - „někdo tě viděl“
  - „někdo tě viděl ve fair-mode“
  - „tady máš goldík“

Pravidla:
- žádný stres, žádný nátlak, žádný “musíš”
- gamifikace motivuje k přidání obsahu a návratům
- gamifikace nesmí zaplnit feed falešným obsahem

---

<a id="koncept-brand"></a>
### Brand (monetizační faktor)

Brand je volitelná identita prodejce. Je to **handle/slug**, kterej jde sdílet jako link nebo zadat do vyhledávání. Brand je monetizační páka, ale nesmí obcházet žádný systémový brány.

#### Jak to funguje
- uživatel si na profilu nastaví **Brand** (unikátní slug, systém ověří dostupnost)
- Brand se zobrazí u inzerátu/detailu **jen pokud má aktivní pass „Brand“**
- ostatní mohou ve feedech vyhledávat podle konkrétního brandu

#### Pravidla a ochrany
- Brand **nikdy neobchází**:
  - citlivost
  - ignor
  - zákonná omezení
  - žádný “schovám to přes brand”
- brand může být “cokoliv” (VapeCZ, Huleni-CZ…). Zneužití přes niche kategorie je akceptovaný tradeoff.

#### Expirace brandu
- po vypršení passu:
  - Brand se přestane zobrazovat
  - nelze ho najít přímým vyhledáváním
- pokud uživatel Brand neobnoví:
  - po **1 měsíci** se Brand odstraní z profilu a uvolní pro jinýho

Sdílení:
- link na Brand otevře feed už s filtrem na Brand

---

<a id="koncept-analytics"></a>
### Analytika a data (dvě vrstvy)

Sbírám data o chování uživatele, protože bez toho nejde postavit trh (like/dislike, ignor, transakce…).  
Zároveň **nad inzerátem nepočítám žádný “skóre”** a nedělám z toho blackbox penalizace. Nad inzerátem sbírám jen **základní metriky** (zhlédnutí apod.) jako signál trhu.

#### 1) Doménová vrstva (per-user, kvůli funkcím)
Tohle jsou data, která jsou nutná pro chování produktu a uživatelské stavy.

| Co | Příklad | Proč to existuje |
|---|---|---|
| preference / reakce | like, dislike | signál pro UX + (později) reputační výpočty protistran |
| osobní úklid | ignore / unignore | aby sis čistil trh pro sebe |
| bezpečnostní signál | flag | report porušení pravidel |
| obchodní události | založení/otevření transakce, změny stavu | bez toho transakce neexistuje |

Tyhle věci jsou **per-user**, protože to je součást reality účtu (jinak by to byla jenom “anonymní statistika bez dopadu”).

#### 2) Listing metriky (nad inzerátem, bez skóre)
Nad inzerátem sbírám “tržní signál”, ale **nepřeklápím to do veřejnýho skóre inzerátu**.

- žádný veřejný “rating karty”
- žádný tajný algoritmický penalizace jako náhrada pravidel
- jen surový metriky typu `visible` / `impression` / `view` / `anti-topper` (viz koncept Inzerát)

Prakticky:
- ukládám **eventy** (append-only)
- z eventů dělám **agregace** (počty / trendy) podle potřeby

#### Striktní oddělení (důležité)
- Doménová data (per-user) = aby produkt fungoval (stavy, interakce, transakce).
- Listing metriky (per-listing) = signál trhu, ne hodnocení lidí.

A pořád platí:
- žádný prodej dat třetím stranám
- žádný reklamní profilování
- žádný “skrytý algoritmy” místo pravidel

---

<a id="koncept-editor"></a>
### Tvorba inzerátu (Editor)

Tady nevzniká “inzerát”. Tady vzniká **Draft**.  
**Inzerát vzniká až publikací Draftu** (a nese si odkaz na zdrojovej draft).

#### Jak editor funguje (UX kontrakt)
Editor je souvislá činnost. Žádnej wizard, žádný “krok 3/9”. Uživatel scrolluje jedním směrem a řeší jen to, co chce řešit.

- **Sekce jsou klikací karty**: každá karta je stavovej řádek (*vyplněno / čeká / není nastaveno*) + edit.
- **Vyplněná věc se vizuálně uklidní**: nevyplněné položky mají “attention”; jakmile jsou hotový, odbarví se do neutrálu.
- **Položky jsou ve třech blocích**:
  1) **Nutné pro zveřejnění**
  2) **Podle kategorie** (dynamické položky dle kategorie)
  3) **Další volby** (dobrovolné)

#### Co vzniká v draftu
Draft nese všechny položky budoucího inzerátu jako pracovní verzi:
- galerie (fotky)
- titulek
- kategorie (+ category spec parametry)
- umístění (lokace)
- cena + typ ceny
- automatické ukončení
- volitelné věci (popis, pros/cons, delivery, warranty, škály…)

Draft je plnohodnotnej stav:
- **autosave** je povinnost (back je vždycky bezpečnej)
- editor je **otevřenej** (ne-lineární), žádná “povinná cesta”

#### Publikace = vznik inzerátu
Když kliknu **„Zveřejnit“**:
- systém z Draftu vytvoří **Inzerát**
- Inzerát si nese svoje položky **na sobě** (je to samostatná entita, ne “živý draft”)
- Inzerát si nese referenci na zdrojovej Draft (kvůli auditovatelnosti / původu)

#### Povinné pro zveřejnění
Bez tohohle nejde publikovat:
- galerie (fotky)
- titulek
- kategorie
- umístění *(s tvrdým upozorněním: poloha je veřejná a může vést k fyzický návštěvě)*
- cena + typ ceny
- automatické ukončení *(čas běží až po zveřejnění; v draftu nestresuje)*

#### Gate na limit aktivních inzerátů (důležité)
Když je uživatel na limitu aktivních inzerátů:
- systém **nedovolí vytvořit ani Draft**
- místo toho ukáže **status** s jasným důvodem
- status nabídne **aktivaci přes token** (odemknutí možnosti pokračovat)

Žádný “nech si to rozdělaný a pak uvidíme”. Limit je tvrdá brána hned na začátku.

#### Bezpečný únik a destruktivní akce
- „Odložit“ je normální volba (drafty jsou stav, ne chyba)
- „Smazat“ je destruktivní akce řešená dvoufázově inline (bez modalovýho divadla)

---

<a id="koncept-uploady"></a>
### Uploady (fotky, přílohy)

Upload je centrální správa souborů (hlavně fotek). Používá se:
- v galerii inzerátu,
- ve zprávách (přílohy),
- případně i jinde (cover/hero).

#### Životnost (důležitý kontrakt)
Uploady **nemají vlastní TTL**. Životnost vždycky řídí **rodič**, který upload používá:
- inzerát → fotky žijí s inzerátem,
- transakce/zpráva → přílohy žijí s transakcí (a po hard delete transakce mizí).

---

<a id="koncept-titulek-vyhledavani"></a>
### Titulek a hledání textem

Titulek je krátkej, jasnej popis toho, co prodáváš. Ne marketing, ne poezie.

Důležitá technická pravda (držím schválně):
- **Titulek je jediný text, podle kterého se dá hledat.**  
  Textové hledání stojí na titulku (vektorový vyhledávání v rámci feedu).
- Markdown popis je čistě informativní vrstva pro detail a do vyhledávání záměrně nespadá.

---

<a id="koncept-rozsirena-data"></a>
### Rozšířená data u inzerátu (privátní analytika pro vlastníka)

Rozšířená data jsou **privátní** čísla u **mých** inzerátů. Jsou řízený **passsem**:
- dokud mám aktivní pass, vidím rozšířená data,
- bez passu nevidím nic (žádný “free” pseudo-score).

Co typicky ukazuju jako dump čísel za život inzerátu (do expirace):
- `impression`
- `view`
- `feedback` (palce)
- `ignored`
- `transactions`

Anti-topper se v číslech ukazuje jako poměr:
- `anti-topper / (visible + anti-topper)`

---

<a id="koncept-payback"></a>
### Payback

Payback je kompenzace pro prodávajícího, když si koupil zvýraznění a část publika mu ho “odfoukla” přes **Anti-topper**.

Smysl:
- kupující si platí za **klid** (méně šumu v listingu),
- prodávající si platí za **viditelnost**,
- Payback je férovka mezi těmahle světy.

#### Co se kompenzuje
- řeší jen boosty, který Anti-topper umí potlačit: **Mark**, **Top**
- **Top Maxxi** je imunní → payback pro něj nikdy nevzniká

#### Kdy se to vyhodnocuje
- **po expiraci inzerátu** (po expiraci už se nic “nevrací do hry”, jen se vyrovnají účty)

#### Kdo na to má nárok
- Payback = **pass (exclusive)** (typicky Seller/Pro)
- nejde to “naklikat jednorázově”
- Payback vzniká **jen pokud má prodávající v době vyhodnocení aktivní Payback pass**

#### Jak to počítám
Eventy z listingu:
- `visible` = reálný zobrazení karty
- `anti-topper` = nahrazuje `visible` ve chvíli, kdy by se ukázal Mark/Top uživateli s Anti-topperem

Výpočet (na úrovni **unikátních uživatelů**):
- poměr `anti-topper` vs. `(visible + anti-topper)`
- vyplácí se krokově:

| Podíl potlačení (unikátní uživatelé) | Refund |
|---|---|
| nižší | 0 % |
| vyšší | 25 % |
| ještě vyšší | 50 % |
| extrém | 75 % |

Refund se počítá z **aktuální jednotkové ceny v ceníku** v době vyhodnocení.

---

<a id="koncept-preference-auto"></a>
### Preference uživatele (automatické zápisy)

Systém může některý věci ukládat do preferencí automaticky (protože je to UXově přirozený), třeba:
- naposledy použitá sekce / kontext,
- implicitní poloha,
- “poslední rozumný nastavení”, aby se uživatel nemusel pořád vracet na start.

Pořád jsou to jen **preference uživatele**, ne systémový data. Uživatel je může kdykoliv přepsat.

---

<a id="koncept-ban"></a>
### Ban

Ban je klasickej ban jako timestamp s trváním (life-time až někdy v budoucnu).

- přiděluje se ručně adminem (dokud nejsou pravidla napsaný jako pravidla, nejsou automatizovaný),
- typický důvod: opakovaný porušování pravidel (např. zjevně špatně označený citlivý/omezený obsah),
- žádný tajný auto-ban systém v pozadí.

<a id="koncept-cena"></a>
### Cena a typ ceny

Cena je povinná, protože „napiš mi do zpráv“ je přesně ten chaos, kterej chci zabít ještě dřív, než vznikne.

Má to dvě položky:

- **Cena** = konkrétní částka.
- **Typ ceny** = jestli je prostor pro domluvu.

| Hodnota | Význam | Co to říká kupujícímu |
| :--- | :--- | :--- |
| `closed` | Pevná cena | „Nesmlouvám.“ |
| `open` | Cena je výchozí, domluva je možná | „Tohle je moje představa, ale můžeme se domluvit.“ |

Důležitý: i u `open` je cena pořád povinná. Žádný „dohodou“ jako únik z reality.

---

<a id="koncept-automaticke-ukonceni"></a>
### Automatické ukončení

Automatické ukončení je povinná volba, protože drží pořádek v nabídce a brání tomu, aby se z feedu stal hřbitov mrtvol. Nechci ruční úklid a nechci, aby se obsah válel navěky jen proto, že někdo zapomněl.

Jak to funguje:
- prodejce při tvorbě nastaví, **kdy se má inzerát automaticky ukončit**,
- čas se začne počítat **až po zveřejnění**, ne v draftu,
- po uplynutí doby se inzerát přepne do stavu **`expired`** (read-only),
- UI u volby ukazuje i **konkrétní datum**, ať je to „za týden“ pro lidi, ne pro matematiku.

Předdefinované volby:

| Volba | Smysl | Poznámka |
| :--- | :--- | :--- |
| Za týden | „Chci to rychle pustit ven / otestovat zájem“ | default rychlovka |
| Za dva týdny | „Dám tomu čas, ale nechci mrtvoly“ | rozumný střed |
| Za měsíc | „Vím, že to bude trvat“ | **zpoplatněná volba** (jinak kanibalizuje Kontinuální nabídku) |

„Za měsíc“ je placený schválně: pokud by to bylo zdarma, lidi si tím vyrobí nekonečný inzeráty bez odpovědnosti. Odemčení řeším přes Kupón / předplatné (podle finálního ceníku).

---

<a id="koncept-pros-cons"></a>
### Co chci vyzdvihnout / Chci být upřímný

Tohle není „feature pro coverage“. Tohle je kulturní signál.

Na většině marketplace se lidi učí jedno: nalešti to, zamlč to, hlavně ať to projde. Já chci opak: aby bylo normální napsat i věc, která se ti úplně nehodí do krámu. Ne protože jsem svatej, ale protože to dlouhodobě zvedá důvěru celýho prostoru a snižuje množství toxických dohadů.

Proto existují dvě jednoduchý sekce:
- **Co chci vyzdvihnout** (pozitiva)
- **Chci být upřímný** (negativa / limity / vady)

Pravidla:
- obojí je **dobrovolný**,
- každá strana má limit **max 5 položek** (mantinel proti balastu + tlak na podstatný věci),
- krátký, konkrétní, lidský texty. Žádný „pros/cons“, žádnej korporát.

Nic se za to neměří, nikdo za to nedostává odměny ani tresty. Je důležitý, že ta možnost vůbec existuje.

---

<a id="koncept-moje-seznamy"></a>
### Moje seznamy (Feedy)

**Moje seznamy** = správa uložených feedů. Prakticky: „co chci vidět“ a „v jakým kontextu zrovna žiju“ (domov vs. chalupa, Vaping vs. auta).

Základní kontrakt:
- v seznamu ukazuju **jen feedy typu `user`** (vědomě uložený),
- `search` sem netahám (je to systémovej kontext stránky Hledat),
- každej účet má vždycky aspoň **1 výchozí feed** (bez filtrů), aby existovala bezpečná návratová volba „ukaž mi prostě všechno“.

Co si feed nese:
- filtry (kategorie, parametry, cenový rozsahy…),
- radius + lokaci (a tím pádem i řazení podle vzdálenosti),
- řazení (co v tom kontextu dává smysl).

Hlavní akce:
- **Nový seznam** = založí nový feed typu `user`,
- seznam jde **přejmenovat**, **upravit**, **smazat**.

A hlavně: feed je jen konfigurace. Všechny systémový brány platí pořád (citlivost, ignor, a spol.). Žádný zkratky okolo pravidel.

---

<a id="koncept-ui-ram"></a>
### UI rámec (co se nesmí rozbít)

UI je u Zbavíku půl produktu. Když působí nejistě, uživatel je nejistej. Když je klidný a stabilní, uživatel nic neřeší.

Držím pár pevných pravidel:

- **Mobile-first vždycky.** Desktop je v principu „nataženej mobil“. Žádnej dashboard cirkus.
- **Nevysvětlovat.** Když to potřebuje nápovědu, je to špatně navržený.
- **Minimum psaní.** Klikací kroky a jasný stavy. Text jen když má hodnotu.
- **Akce mají váhu.** Primární CTA je jasná, sekundární neruší, destruktivní je opatrná.
- **Klid > efekt.** Animace jen kritický minimum. Reakce systému má být okamžitá.
- **Bottom nav je kotva.** Uživatel má pořád pocit, že „nemůže nic posrat“.

---

<a id="koncept-landing"></a>
### Landing Page (struktura)

Landing je vizitka postoje. Není to manuál ani marketingovej román. Je to pět bloků a hotovo:

| Blok | Co je uvnitř | Proč |
|---|---|---|
| Hero | claim **„Nakupuješ nebo prodáváš?“** + 2 rovnocenný CTA: **„Už se známe“** (Login), **„Přidej se!“** (Register) | žádný trick CTA, žádnej nátlak |
| Autor | moje fotka, moje jméno, odkaz na GitHub, motto **„Bez keců. Bez ojebů.“** | důvěra přes tvář a odpovědnost |
| Aktivita vývoje | GitHub-like heatmap | důkaz práce, ne sliby |
| Live Pulse | poslední události (registrace, nový inzeráty, transakce) | ať je vidět, že to žije |
| Transparentní účet | link na bankovnictví | finance netajím; kdo hledá shady shit, tady by to bylo |

Tón: minimalistickej. Bez popupů, bez urgencí, bez vysvětlování.

---

<a id="koncept-navigace"></a>
### Navigace a Dashboard

Navigace je schválně nudná a stabilní. Uživatel se nemá proklikávat labyrintem, má mít jistotu, že **vždycky ví, kde je** a **vždycky má únik**.

#### Bottom nav (5 ikon, pořád stejně)

| Ikona | Sekce | Poznámka |
|---|---|---|
| Home | Centrální Dashboard | společnej entrypoint |
| Chci prodávat | Seller home | mindset „prodávám“ |
| Chci nakupovat | Buyer home | mindset „nakupuju“ |
| Bonusy | ekonomika / aktivace | rozšíření, passy, tokeny |
| Můj účet | profil / nastavení | preference, hranice, ticho |

Role nejsou identita ani přepínač „jsem seller/buyer“. Je to jen rychlej vstup do dvou nejčastějších mindsetů.

---

<a id="koncept-dashboard"></a>
### Centrální Dashboard (Home)

Dashboard je launcher. Není to feed. Má být krátkej, jasnej, bez potřeby scrollovat jak blázen.

Co sem patří:
- **Novinky / pulz**: co přibylo (nový inzeráty v okolí / v mých feedech, změny stavu, zajímavý dění).
- **Notifikace**: co čeká na reakci (unread Zprávy, změny v transakci, systémový události).
- **Rychlý skoky**: typicky „Inzeráty“ a „Nový inzerát“ (tj. vstupy do existujících konceptů, ne vlastní svět).

---

<a id="koncept-seller-home"></a>
### Chci prodávat (Seller home)

Domov pro „prodávám“. Velký karty, jasný volby, žádný menu v menu.

| Karta | Co dělá | Pravidlo |
|---|---|---|
| Nový inzerát / Pokračovat | primární vstup do tvorby | dynamicky: když existuje draft → **Pokračovat**, jinak **Nový inzerát**; při „Nový inzerát“ může nastat **draft gate** (limit) |
| Zprávy | moje rozjednané prodeje | transakce přeložený do řeči lidí |
| Šablony | seznam draftů | UI název „Šablony“, protože mentálně „mám to připravený“ |
| Moje inzeráty | přehled publikovaných | stavy `live/expired/closed/sold` |

---

<a id="koncept-buyer-home"></a>
### Chci nakupovat (Buyer home)

Domov pro „nakupuju“. Zase velký karty, žádný menu v menu.

| Karta | Co dělá | Poznámka |
|---|---|---|
| Inzeráty | vstup do listu | typicky návrat do posledního kontextu |
| Zprávy | moje nákupy / domluvy | pořád transakce, jen lidský název |
| Moje seznamy | uložený feedy | správa „co chci vidět“ |
| Oblíbené | moje uložený inzeráty | rychlá paměť, žádný algoritmy |

Všechny vstupy do listů a detailů vždycky respektují systémový gating (citlivost, ignor, atd.). Žádný zkratky okolo pravidel.

---

<a id="koncept-profil"></a>
### Profil / Nastavení

Profil není “sociální profil”. Je to místo pro preference: kdo jsem (minimálně) a co snesu / chci vidět.

Co tu řeším:
- **Citlivost obsahu**: maximum na profilu (strop) + reálný zapínání ve feedech (viz Citlivost).
- **Notifikace**: default je ticho, všechno jde do Inboxu. Tady jen volitelný email forward/digest.
- **Základ účtu**: email + preference. Žádný zbytečný profilový údaje „pro pocit“.

Profil má být klidnej a věcnej. Jedno místo, kde nastavím hranice a pak už mi to nepřekáží v používání appky.

<a id="koncept-tokeny"></a>
### Tokeny (měna)

Tokeny jsou interní měna. Slouží jako jednotný “palivo” pro zbytek systému. Nejsou to body na hraní.

Zásady:
- tokeny jsou **mentální model aktivace** (ne gambling),
- tokeny nejsou casino,
- tokeny nikdy neobcházej bezpečnost ani viditelnost (to řeší gating koncepty).

#### Ledger (historie pohybů)
Tokeny jsou měna, takže uživatel musí mít čitelnej ledger pohybů. Žádný “zmizely mi tokeny a nevím proč”.

Ledger obsahuje:
- připsání,
- úbytek,
- refund/kompenzace (jen když existuje explicitní mechanika, např. [Payback](#payback)).

Ledger je auditní stopa. Ne sociální feed.

<a id="koncept-tokeny-ziskavani"></a>
### Tokeny – získávání (odměny, příděly, nákup)

Tohle je standalone mechanika. Token jako pojem jen říká “co to je”.  
Tady je “jak se k nim dostaneš”.

Zdroje tokenů:
- **Předplatné**: měsíční příděl v balíčku (viz Ekonomika).
- **Nákup**: top-up balíčky (viz Ekonomika).
- **Odměny / bonusy**: drobný tokeny za používání (viz níž).

#### Bonusy za používání (tokeny zdarma)
Bonusy jsou malé, predikovatelné příděly. Ne core ekonomika.

| Mechanika | Kdy vzniká | Komu | Proč to existuje | Anti-abuse |
|---|---|---|---|---|
| Odměna za `resolved` | když prodávající přepne transakci do `resolved` | prodávajícímu | motivace k úklidu a pravdivým koncům (žádný zombie transakce) | bez `resolved` bonus nevzniká; systém může stopnout zjevný farmení |
| RNG dropy ve feedu | při scrollování, náhodně s nízkou pravděpodobností | uživateli | drobný překvapení, ne jádro ekonomiky | nízká pravděpodobnost + ochrany proti anomáliím |
| Denní drop | 1× denně vyzvednutí v sekci Bonusy | uživateli | jemná retence bez nátlaku (řádově ~10 T) | rate-limit + detekce zneužití |

Pozn.: žádný “refund za slabý výkon”. Pokud existuje kompenzace, je to explicitní mechanika (typicky [Payback](#payback)), ne tichý a nepředvídatelný vracení tokenů.

### Historie transakcí (Tokeny)

Definice Tokenů je v Konceptech: [Tokeny](#koncept-tokeny).  
Tady řeším jen UX pravidlo ekonomiky: uživatel musí mít **čitelnej ledger** pohybů, protože tokeny jsou měna.

Uživatel má k dispozici historii pohybů:
- připsání (předplatné, bonusy, nákupy),
- úbytek (aktivace, nákupy rozšíření),
- případné refundy (jen tam, kde existuje jasná mechanika typu [Payback](#payback)).

Žádný “zmizely mi tokeny a nevím proč”. To je toxická špína.

---

### Bonusy za používání (Tokeny zdarma)

Definici “tokeny jako měna” neřeším tady, viz [Tokeny](#koncept-tokeny).  
Tady jsou konkrétní **mechaniky přídělů**, protože to je součást ekonomického modelu.

| Mechanika | Kdy vzniká | Komu | Proč to existuje | Anti-abuse |
|---|---|---|---|---|
| Odměna za `resolved` | když prodávající přepne transakci do `resolved` | prodávajícímu | motivace k úklidu a pravdivým koncům (žádný zombie transakce) | bez `resolved` bonus nevzniká; systém může stopnout zjevný farmení |
| RNG dropy ve feedu | při scrollování, náhodně s nízkou pravděpodobností | uživateli | drobný překvapení, ne ekonomickej model | nízká pravděpodobnost + ochrany proti anomáliím |
| Denní drop | 1× denně vyzvednutí v sekci Bonusy (Obchod) | uživateli | jemná retence bez nátlaku (řádově ~10 T) | rate-limit + detekce zneužití |

Pozn.: žádný “refund za slabý výkon”. Pokud někdy kompenzace existuje, je to explicitní mechanika (typicky [Payback](#payback)), ne tichý a nepředvídatelný vracení tokenů.

---

<a id="koncept-kupony"></a>
### Kupóny (ticket)

Kupón není měna. Kupón je **konkrétní poukázka na konkrétní věc**. Držíš ho jako lístek. Buď ho použiješ na tu jednu definovanou akci, nebo ti zůstane v inventáři.

Zásady:
- kupón = **konkrétnost** (1× přesně tohle)
- kupón se **nesměňuje**, není “peněžní hodnota”
- kupón se po použití **spotřebuje**
- kupóny jsou defaultně **bez expirace**  
  (pokud někdy existuje časově omezený promo kupón, musí to být explicitně označený jako výjimka, ne překvapení)

Kupón může mít dvě podoby efektu:
- **Kupón (jednorázová akce)**: stane se jedna konkrétní věc (typicky per-inzerát/per-úkon).
- **Kupón → Pass**: kupón aktivuje nebo prodlouží **pass** na čas (viz [Pass](#koncept-pass)).

V UI platí ekonomický pravidlo: pokud existuje použitelný kupón, systém ho nabídne a preferuje před tokenama (detaily kontraktu viz [Aktivace](#koncept-aktivace)).

---

<a id="koncept-pass"></a>
### Pass (aktivní stav v čase)

Pass není měna ani poukázka. Pass je **časově omezený oprávnění / režim**: “od teď do tehdy máš něco aktivní”.

Zásady:
- pass je **stav**, ne spotřební item
- pass má vždycky **expiraci**
- pass se typicky **aktivuje** přes kupón nebo tokeny (viz [Aktivace](#koncept-aktivace))
- pass nikdy neobchází systémový gating (citlivost, ignor a další globální hranice)

Pass je pro věci, který dávají smysl jako “zapnuto po dobu”: režimy, limity, přístupy, dlouhodobější nástroje.

---

<a id="koncept-aktivace"></a>
### Aktivace (Kupón / Tokeny → Pass)

Aktivace je jednotný kontrakt pro “zapínání” věcí v systému. Uživatel musí vždycky chápat, co právě dělá: jestli něco **spotřebovává**, nebo **aktivuje na čas**.

Kontrakt:
- pokud mám použitelný **kupón** pro danou věc → **použije se kupón**
- jinak → strhnou se **tokeny** (viz [Tokeny](#koncept-tokeny))
- výsledek aktivace je buď:
  - jednorázová akce (kupón se spálí a hotovo), nebo
  - vznik/prodloužení **passu** (viz [Pass](#koncept-pass))

UX pravidla:
- CTA musí jasně říct, co se spotřebuje: `Aktivovat (1× Kupón)` vs. `Aktivovat (XX Tokenů)`
- po aktivaci musí být vidět stav: aktivní/neaktivní a **dokdy** (u passů)
- každá aktivace/spotřeba musí mít stopu v ledgeru tokenů (audit, žádný “zmizely mi tokeny”)

---

<a id="koncept-rozsireni-aktivace"></a>
### Rozšíření (panel aktivací)

Rozšíření jsou centrální ovládací pult pro věci, co se dají *zapnout* a nějakou dobu platí.  
Není to „nastavení“ a není to „shop“. Je to dashboard: *co mám aktivní, co mi končí, co můžu zapnout, a čím to zaplatím*.

Co uživatel vidí u každého rozšíření:
- stav **aktivní / neaktivní**
- **dokdy** (pokud je aktivní)
- cena aktivace (kupón / tokeny)

A celkově tu vidí i inventář:
- **Tokeny** (zůstatek)  
- **Kupóny** (kolik kusů a na co jsou)
- **Passy** (co běží a dokdy)

#### Aktivace (kontrakt)
Rozšíření používají jednotný kontrakt aktivace definovaný tady: [Aktivace](#koncept-aktivace).  
V praxi to znamená:
- pokud mám použitelný kupón → použije se kupón
- jinak → strhnou se tokeny
- výsledek je buď jednorázovka, nebo vznik/prodloužení passu (podle typu rozšíření)

#### Chytré CTA pravidlo (ať uživatel nepřepočítává život)
| Stav | Tlačítko | Co se stane |
|---|---|---|
| mám použitelný kupón | `Aktivovat (1× Kupón)` | kupón se spálí, vznikne/prodlouží pass (nebo proběhne jednorázovka) |
| kupón nemám | `Aktivovat (XX Tokenů)` | tokeny se strhnou, vznikne/prodlouží pass (nebo proběhne jednorázovka) |

Pravidlo: **nejdřív spotřebuj free věci, až potom měnu**.

#### Jednorázovky vs. “zapínací” věci
V UI je dobrý držet odděleně:
- rozšíření typu **„zapni/prodlouž pass“**
- kupóny typu **jednorázová akce** (aby se to nemíchalo do aktivací)

#### Tvrdá hranice
Rozšíření jsou nadstavby. Ne zadní vrátka.
- nic neobchází citlivost, ignor a další globální brány
- žádný „schování“ nebo obcházení systému přes placený věci

---

<a id="koncept-predplatne"></a>
### Předplatné (balíček)

Předplatné je pohodlná obálka nad zbytkem systému. Ne zavedení “role”, ale sjednocení věcí, který by si uživatel jinak furt dokola aktivoval.

Co předplatné typicky dělá:
- dává měsíční příděl tokenů (viz Ekonomika)
- drží některý věci aktivní (tj. řeší za tebe opakovanou aktivaci passů)
- nastavuje limity (např. počet aktivních inzerátů, počet feedů)

Zásady:
- obsah balíčků a ceny jsou v **Ekonomice** (model nabídky)
- definice tokenů/kupónů/passů je v **Koncepty** (tady)
- zrušení předplatného nesmí být past: žádný tichý obnovování, žádný schovaný rušení, žádný tresty

<a id="koncept-boost-mark"></a>
### Boost: Mark

Mark je čistě listing mechanika. Není to “výhoda v pravidlech”, je to výhoda v signálu.

Co Mark dělá:
- jen vizuální signál: badge **„Zvýrazněno“**
- **nezaručuje top pozici** (je to “hej, koukni sem”)

Kde se projeví:
- pouze v **listingu (seznamu)**

Co Mark nikdy neobchází:
- citlivost (hard gate),
- ignor,
- release window (pokud nemáš EA / ED),
- filtry a radius.

Trvání:
- Mark platí **do expirace inzerátu** (boost končí expirací).

Interakce:
- Anti-topper: Mark spadá do zvýraznění, který Anti-topper umí potlačit (proto se v listingu pro uživatele s Anti-topperem loguje `anti-topper` místo `visible` ve chvíli, kdy by se ukázal Mark/Top).
- Payback: Mark je jeden z boostů, který může generovat Payback (viz [Payback](#payback)).
- Kontinuální nabídka:
  - když prodloužíš život **dřív než expiroval**, Mark běží dál (expirace se posune),
  - když inzerát už expiroval a ty ho “oživíš”, starý Mark se **nevrací**.

---

<a id="koncept-boost-top"></a>
### Boost: Top

Top je listing mechanika: inzerát skočí do prioritní vrstvy listingu (pod Top Maxxi).

Co Top dělá:
- posune inzerát do priority vrstvy listingu:
  1) Top Maxxi
  2) Top
  3) běžné

Kde se projeví:
- pouze v **listingu (seznamu)**  
  (detail je normální svět, ne marketingová klec)

Co Top nikdy neobchází:
- citlivost (hard gate),
- ignor,
- release window (pokud nemáš EA / ED),
- filtry, radius a další globální hranice.

Anti-topper:
- pokud má uživatel Anti-topper:
  - Top **ztratí výhodu pozice**,
  - zůstane mu jen badge (tj. už není “prioritní vrstva”, ale “běžnej kus v řazení podle preference uživatele”).

Trvání:
- Top platí **do expirace inzerátu** (boost končí expirací).

Interakce s Kontinuální nabídkou:
- prodloužení před expirací = Top běží dál,
- reanimace po expiraci = starý Top se nevrací (nový cyklus, nový boost).

---

<a id="koncept-boost-top-maxxi"></a>
### Boost: Top Maxxi

Top Maxxi je absolutní přednost v listingu. Je to nejvyšší vrstva priority a je imunní vůči Anti-topperu.

Co Top Maxxi dělá:
- inzerát je **vždy nahoře** (priorita #1)

Kde se projeví:
- pouze v **listingu (seznamu)**

Co Top Maxxi nikdy neobchází:
- citlivost (hard gate),
- ignor,
- release window (pokud nemáš EA / ED),
- filtry, radius a další globální hranice.

Anti-topper:
- Top Maxxi je **imunní** (Anti-topper ho neovlivní).

Payback:
- Top Maxxi je imunní → **payback pro něj nikdy nevzniká**.

Trvání:
- Top Maxxi platí **do expirace inzerátu** (boost končí expirací).

Interakce s Kontinuální nabídkou:
- prodloužení před expirací = Top Maxxi běží dál,
- reanimace po expiraci = starý Top Maxxi se nevrací.

<a id="ekonomika"></a>
## Ekonomika

Ekonomika je jen **model nabídky**:
- [Tokeny](#koncept-tokeny)
- [Kupóny](#koncept-kupony)
- [Pass](#koncept-pass)

Kontrakt aktivace:
- pokud má uživatel použitelný **kupón** → použije se kupón,
- jinak se strhnou **tokeny**,
- aktivace typicky vytváří / prodlužuje **pass** (pokud je to typ „Kupón → Pass“).

---

<a id="predplatne"></a>
### Předplatné (balíčky)

Balíčky jsou měsíční “balík oprávnění + příděly”. Nejsou to role. Oprávnění jsou vždycky jen passy/limity na účtu.

<a id="srovnani-balicku"></a>
#### Srovnání balíčků

| Položka | Kupující<br>(119 Kč) | Prodejce<br>(229 Kč) | **Pro**<br>(499 Kč) |
| :--- | :---: | :---: | :---: |
| **Tokeny / měsíc** | 300 T | 300 T | **600 T** |
| **Limity** | | | |
| Uložené Feedy | 5 | - | **10** |
| Aktivní inzeráty | 5 | 10 | **20** |
| **Passy (Trvalé)** | | | |
| [Payback](#payback) | - | ✓ | **✓** |
| [Photo Count](#photo-count) (+foto) | - | ✓ | **✓** |
| [Rozšířená data](#koncept-rozsirena-data) | - | ✓ | **✓** |
| [Detail protistrany](#detail-protistrany) | - | - | **✓** |
| [Anti-topper](#anti-topper) | - | - | **✓** |
| [Early Access](#release-window) | - | - | **✓** |
| [Multi-Category](#multi-category) | - | - | **✓** |
| **Kupóny (Měsíčně)** | | | |
| [Early Access](#release-window) | 5× | - | **(Pass)** |
| [Anti-topper](#anti-topper) | 5× | - | **(Pass)** |
| [Early Delivery](#release-window) | - | 3× | **3×** |
| [Mark](#koncept-boost-mark) | - | 3× | **3×** |
| [Top](#koncept-boost-top) | - | 3× | **3×** |
| [Top Maxxi](#koncept-boost-top-maxxi) | - | 1× | **3×** |
| [Multi-Category](#multi-category) | - | 3× | **(Pass)** |
| [Kontinuální nabídka](#kontinualni-nabidka) | - | 3× | **5×** |

> Pozn.: řádky „(Pass)“ znamenají, že v tom balíčku to není jako měsíční kupón, ale jako aktivní pass/benefit.

---

<a id="tokeny-mena"></a>
### Tokeny (nabídka a ceny)

Tady je jen ekonomický model: **kurz + top-up balíčky**.

- **Baseline kurz:** cca **1 CZK ≈ 2 Tokeny**

#### Nákup Tokenů

| Balíček | Cena (CZK) | Získám Tokenů | Výhodnost |
| :--- | :---: | :---: | :--- |
| **Na zkoušku** | 149 Kč | **300 T** | Standard |
| **Balík** | 299 Kč | **650 T** | +50 T zdarma |
| **Do zásoby** | 599 Kč | **1400 T** | +200 T zdarma |

---

<a id="kupony-passy"></a>
### Ceník rozšíření (kupóny / passy)

Pozn.:
- **Kupón → Pass** znamená: jednorázově aktivuješ a vznikne/obnoví se pass na dobu trvání.
- **Exclusive** = dostupné jen v rámci předplatného (nejde koupit samostatně).

| Co | Typ | Efekt / Trvání | Cena (Token) |
| :--- | :--- | :--- | ---: |
| [Early Access](#release-window) | Kupón → Pass | 7 dnů | 80 |
| [Early Delivery](#release-window) | Kupón | Zruší release window pro jeden inzerát | 40 |
| [Anti-topper](#anti-topper) | Kupón → Pass | 7 dnů | 40 |
| [Mark](#koncept-boost-mark) | Kupón → Pass | 7 dnů | 20 |
| [Top](#koncept-boost-top) | Kupón → Pass | 7 dnů | 50 |
| [Top Maxxi](#koncept-boost-top-maxxi) | Kupón → Pass | 7 dnů | 50 |
| [Multi-Category](#multi-category) | Kupón | 1 použití (1 + 2 kategorie) | 75 |
| [Detail protistrany](#detail-protistrany) | Kupón → Pass | 7 dnů | 50 |
| [Photo Count](#photo-count) | Kupón → Pass | 1 měsíc (+2 fotky) | 75 |
| Aktivní inzeráty 10 | Kupón → Pass | 1 měsíc | TBD |
| [Payback](#payback) | Pass | Benefit předplatného | Exclusive |
| [Kontinuální nabídka](#kontinualni-nabidka) | Kupón → Pass | 1 měsíc (prodlouží život inzerátu) | Exclusive |

<a id="uvedeni-na-trh"></a>
## Uvedení na trh (Go-to-market)

Start dělím vědomě do dvou **sekvenčních** fází. Ne proto, že miluju komplikace, ale protože „prázdnej marketplace“ je nejrychlejší způsob, jak se sám zastřelit do nohy.

Cíl fázování:
- minimalizovat riziko prázdna,
- dostat první **reálný inzeráty + první transakce**,
- vytvořit **paměť trhu** dřív, než tam pošlu širší region.

### Fázování startu

Fáze 1 mi postaví základ (obsah, chování, test monetizace).  
Fáze 2 to teprve roztočí na region (billboardy, word-of-mouth), ale už do něčeho, co není mrtvý.

### Fáze 1: Online komunitní start (Discord)

> Proč? Protože je to kontrolovaný prostředí s vysokou důvěrou a tematickou shodou. Ideální na rozjezd.

Primární starting-ground.

- Start proběhne v uzavřených tematických komunitách (typicky **vapování**).
- Jasně definovaná kategorie produktů a jazyk.
- Vysoká tematická shoda → menší tření při startu.
- Vyšší šance na:
  - první inzeráty,
  - první transakce,
  - první reference.

Komunitní efekt:
- lidi jsou tolerantnější k nedokonalostem,
- mají chuť být „u zrodu“ a dávat feedback.

Účel fáze 1:
- ověřit chování uživatelů v prostředí s vysokou důvěrou,
- otestovat monetizaci bez regionálního šumu,
- vytvořit první reálnou **paměť trhu**.

### Fáze 2: Regionální expanze (Karlovy Vary + Ostrov + Sokolov)

> Proč? To je cílový trh. Tady se rozhoduje, jestli to bude reálnej business, nebo jen hezkej experiment.

- Navazuje na stabilní základ z fáze 1.
- Billboardy už nevedou do prázdna, ale do systému s historií.
- Komunikace může být přímější a sebevědomější.

Distribuce:
- Billboardy: bílé pozadí, žádné obrázky, krátký tvrdý text + URL.
- Word-of-mouth jako hlavní akcelerační kanál.

---

<a id="retence"></a>
## Retence a paměť trhu

Zbav-se.me nepracuje s krátkodobou pozorností. Pracuju s tím, že lidi se pravidelně vrací “jen se podívat, jestli se něco objevilo”.  
A to funguje jen tehdy, když trh má paměť.

**Paměť trhu:** inzeráty po expiraci nemažu. Jsou defaultně schované, ale existují jako historický kontext (ceny, trendy, co se prodává/nejde prodat).

Důsledky:
- hodnota platformy roste v čase i bez brutálního přísunu nového obsahu,
- lidi se vrací nejen kvůli „novinkám“, ale kvůli orientaci v trhu,
- MAU může růst rychleji než registrace (protože historie sama má hodnotu).

### Retence trasovaných dat a čistky

Retence není „náhodný rozhodnutí admina“. Je to produktová hranice.

- **Inzeráty a jejich obrázky** držím dlouhodobě (paměť trhu).
- **Kumulativní / trasovaná data** mají hard retenci **1 rok**:
  - typicky user event logy a logy pro výpočet metrik,
  - čistka běží v cron jobu a maže záznamy starší než 1 rok (typicky denně).
- **Transakce** mají vlastní retenci (protože obsahují nejvíc rizik):
  - strukturovaná PII data se mažou hned po ukončení transakce,
  - hard delete celé transakce po **3 měsících** (viz [Čistky dat](#koncept-cistky)).

> Retence tady není tlačená notifikacema ani návykovostí, ale užitkem z kontextu. Menší hype, stabilnější MAU.

### Očekávaný vývoj poměru registrace → MAU

- Měsíc 1–2: ~20–30 % (zvědavost, nízký kontext)
- Měsíc 3–4: ~35–45 % (vznikající historie)
- Měsíc 5–7: ~50–60 % (paměť trhu má hodnotu)
- Po saturaci regionu: **60–70 %** (platforma jako referenční bod)

---

<a id="odhady"></a>
## Odhady monetizace a růstu

Křišťálová koule. Ale aspoň s jasnýma předpokladama, ne „věřím ve vesmír“.

### Sekvenční náběh MAU a revenue

Odhad při startu ve 2 fázích (Discord → region).  
Revenue tady zhruba odpovídá kombinovanému ARPU (viz níž).

| Měsíc | Zdroj MAU | Odhad MAU | Odhad Revenue |
| :--- | :--- | :--- | :--- |
| 1 | Discord | 60 | ~1 700 Kč |
| 2 | Discord | 90 | ~2 600 Kč |
| 3 | Discord | 120 | ~3 400 Kč |
| 4 | Discord + region | 700 | ~20 100 Kč |
| 5 | Discord + region | 1 600 | ~45 900 Kč |
| 6 | Discord + region | 3 200 | ~91 800 Kč |
| 7 | Discord + region | 5 000 | ~143 400 Kč |
| 8 | Discord + region | 7 500 | ~215 100 Kč |
| 9 | Discord + region | 9 500 | ~272 500 Kč |
| 10 | Discord + region | 10 500 | ~301 100 Kč |
| 11+ | Discord + region | 11–12k | ~315k+ Kč |

### Odhad monetizace: baseline předplatného (konzervativní)

Předpoklad:
- konverzní cíl: ~**3 % MAU** platí předplatné,
- rozložení balíčků je vědomě konzervativní.

| Balíček | Podíl MAU | Cena (Kč / měsíc) | ARPU příspěvek |
| --- | ---: | ---: | ---: |
| Kupující | 0,5 % | 119 | 0,60 Kč |
| Prodejce | 2,0 % | 229 | 4,58 Kč |
| Pro | 0,5 % | 499 | 2,50 Kč |
| **Celkem** | **3,0 %** |  | **7,68 Kč ARPU** |

### Odhad monetizace: extras baseline (cash-in model)

Scénář modeluje jednorázové nákupy Tokenů.

Předpoklady:
- MAU: **10 000**
- podíl uživatelů, kteří si koupí tokeny: **10 % MAU**
- průměrná útrata: ~210 Kč

| Metrika | Hodnota |
| --- | ---: |
| Počet nakupujících | 1 000 |
| Průměrná útrata | ~210 Kč |
| **Měsíční revenue** | **~210 000 Kč** |
| **ARPU (cash-in)** | **~21,0 Kč** |

### Kombinovaný scénář (konzervativní)

| Zdroj | ARPU (Kč) | Měsíční revenue při MAU 10k |
| --- | ---: | ---: |
| Předplatné | 7,68 | ~76 800 Kč |
| Extras | 21,0 | ~210 000 Kč |
| **Celkem** | **28,68** | **~286 800 Kč** |

Poznámky:
- Model je konzervativní. První měsíce jsou hlavně o naplnění trhu, monetizace nabíhá až se saturací obsahu.
- Neřeším tady enterprise peníze, partnerství ani granty. Tohle je čistě “produkt stojí na vlastních nohách”.
