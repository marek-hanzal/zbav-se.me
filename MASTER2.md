# MASTER

> **Single source of truth.** Co tu není, neexistuje.  
> Pokud se realita produktu začne hádat s tímhle dokumentem, beru to jako bug. Opravím buď produkt, nebo rozhodnutí. **Ne** že to budu obcházet „výjimkou“, „poznámkou bokem“ nebo jiným alibismem.

Tenhle dokument je moje páteř. Ne moodboard, ne wish-list, ne backlog. Je to závazek, podle kterýho se ten produkt chová.

## Pravidla dokumentu

Tohle je moje ústava. Ne backlog, ne deníček, ne hromada poznámek z hospody. Píšu sem **jen** věci, podle kterých se produkt reálně chová, nebo chovat má.

Co sem patří:
- **Koncepty, definice, rozhodnutí** a jejich *důvod* (co platí a proč).
- Věci, které když poruším, tak se rozpadne důvěra nebo charakter produktu.

Co sem nepatří:
- Žádný kód. Žádný DB schémata. Žádný “jak to udělám”.
- Žádný technický výmluvy typu „tohle zatím nejde“.
- Žádný duplicitní přežvykování toho samýho na pěti místech.

Formát a tón:
- Píšu v **ich-formě**. Jsem autor, beru odpovědnost.  
- Když je něco vágní, je to k ničemu. Když je něco zbytečný, tak to smažu.  
- Každý nový kus textu musí projít otázkou: **„Pomůže mi to udělat správný rozhodnutí, až budu unavenej?“**

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
- [Terminologie](#terminologie)
  - [Kupón vs. Token](#kupon-token-term)
  - [Feed vs. Seznam](#feed-seznam-term)
  - [Typy Feedu](#typy-feedu)
  - [Typy obsahu (Citlivost)](#typy-obsahu)
  - [Stavy inzerátu](#stavy-inzeratu)
  - [Aktivita](#aktivita)
- [UI](#ui)
  - [Landing Page (Struktura)](#landing-ui)
  - [Navigace a Dashboard](#navigace)
  - [Tvorba inzerátu (Draft Gate)](#tvorba-inzeratu)
  - [Moje seznamy (Feedy)](#moje-seznamy)
  - [Rozšíření a Aktivace](#rozsireni-ui)
  - [Zprávy (Transakce)](#zpravy-ui)
  - [Profil / Nastavení](#profil)
- [Základní stavební kameny](#zakladni-kameny)
  - [Uživatel](#uzivatel)
  - [Kategorie](#kategorie)
  - [Inzerát](#inzerat)
  - [Draft](#draft)
  - [Feed (Entita)](#feed-entita)
  - [Transakce](#transakce)
  - [Zprávy](#zpravy-entita)
  - [Notifikace (Inbox)](#notifikace)
  - [Lokace](#lokace)
  - [Upload](#upload)
  - [Hodnocení (Ranking)](#hodnoceni)
- [Mechaniky](#mechaniky)
  - [Stavy Inzerátu (Lifecycle)](#stavy-lifecycle)
  - [Limity](#limity)
  - [Notifikace a Inbox](#notifikace-mech)
  - [Seznam inzerátů a Viditelnost](#seznam-viditelnost)
  - [Životní cyklus inzerátu](#zivotni-cyklus)
  - [Payback](#payback)
  - [Obchod (Transakce)](#obchod)
  - [Čistky dat](#cistky)
  - [Reputace a Metriky](#reputace)
- [Předplatné](#predplatne)
  - [Zkušební Pro zdarma](#zkusebni-pro)
  - [Srovnání balíčků](#srovnani-balicku)
- [Tokeny (Měna)](#tokeny-mena)
  - [Získávání zdarma](#ziskavani)
- [Kupóny & Passy](#kupony-passy)
- [Uvedení na trh](#uvedeni-na-trh)
- [Retence a paměť trhu](#retence)
- [Odhady monetizace a růstu](#odhady)

---

<a id="smer-produktu"></a>
## Směr produktu

Tady je moje páteř. Ne “seznam featur”, ne backlog, ne výmluvy. Jsou tu pravidla, která drží tenhle projekt pohromadě, i když budu unavenej, ve stresu a budu mít chuť udělat z toho další obyč bazar.

Platí pár jednoduchých věcí:

- **Klid a jistota jsou cíl.** Úspěch není wow-efekt, ale moment, kdy uživatel nic neřeší.
- **Když to nejde pochopit samo, je to špatně.** Ne „uživatel je blbej“, ale já jsem to dojebal.
- **Minimum keců, maximum signálu.** UI se chová fyzikálně přirozeně, žádný kejkle.
- **Důvěra není feature.** Je to výsledek: konzistence, transparentnost, férový pravidla.

Tohle je část, ke který se vracím pokaždý, když mě napadne “jenom malá výjimka”. Malý výjimky jsou nejrychlejší cesta, jak zabít charakter produktu.

<a id="identita"></a>
### Identita

Zbav-se.me není “platforma”. Je to moje práce a můj postoj. A ten postoj je napsanej natvrdo:

> **Prodávám, neojebávám.**

Co z toho plyne (a co si tady zakazuju porušit):

- **Klid místo chaosu.** Žádný bazarový peklo, kde se člověk prokliká k migréně.
- **Minimum psaní.** Domluva má být primárně klikací a strukturovaná. Chat je doplněk, ne střed vesmíru.
- **Lokálnost a setkání.** Podporuju osobní předání a sousedský prodej. Ne “všude posílej balíky”.
- **Transparentnost jako design.** Žádný skrytý penalizace, žádný “nevíš proč se ti to nezobrazuje”.
- **Férová monetizace.** Platí se za hodnotu (nástroje, čas, pohodlí), ne za to, že někoho ukecám nebo zmanipuluju.
- **Měřím hodně a vážu to na uživatele.** Ano, schválně.  
  - Důvod je jediný: **dát lidem metriky pro nabídku/poptávku** (co funguje, co ne, proč se to hejbe, kde je zájem).  
  - **Neprodávám** to třetím stranám. **Nekrmím** tím reklamy. **Nedělám** z uživatelů produkt pro inzerenty.  
  - Když něco měřím, má to mít **viditelný smysl** v produktu (signál, přehled, férový mechaniky), ne „protože to jde“.

Prakticky: uživatel má mít pocit, že systém je **předvídatelnej**. Když něčemu nerozumí, je to můj problém. Ne jeho.

<a id="tone-of-voice"></a>
### Tone of Voice

> „**Klikej. Zkoumej. Není tu co posrat.**“  
> Onboarding nastaví vztah. A pak už držím hubu a nechám UI dělat práci.

Mluvím přímo, krátce a lidsky. Ne protože jsem drsňák, ale protože *kecy zvyšujou nejistotu*.

- **Tykám.** Jsme lidi, ne úřad.
- **Mužský rod beru jako neutrální default** (kvůli konzistenci a kratším větám).  
  Příklad: „Odmítl jsi“, „Potvrdil jsi“, „Máš novou zprávu“.
- **Žádnej pasiv a úředničina.**  
  Ne „bylo odmítnuto“, ale „Odmítl jsi“ / „Prodejce tě odmítl“.
- **Žádný školení v UI.** Žádný tooltipy, žádný „(?)“, žádný „tady klikni“.  
  Když to potřebuje nápovědu, je to špatně navržený.
- **Tone v běžným workflow je klidnej a tichej.**  
  Ostrý, osobní tón si nechávám pro výjimečný místa (onboarding, landing, founder podpis, hranice bezpečnosti).
- **Mikrocopy je spíš uklidnění než show.**  
  Když něco načítám, klidně napíšu „…rozjímám…“, ale nebudu dělat cirkus.

Jedna zásada navíc: texty jsou tam, aby *pojmenovaly realitu*, ne aby vychovávaly uživatele. Žádný moralizování, žádný manipulace. Jen čistý signál.

<a id="produktove-cile"></a>
### Produktové cíle

Nechci stavět „appku“. Chci postavit **trh**, kterej se chová slušně a předvídatelně. Když to shrnu do pár vět, tak:

- **Ticho = úspěch.**  
  Když uživatel nic neřeší, nikde se nezasekne a nemá potřebu přemýšlet „co tím autor myslel“, vyhrál jsem.
- **Známý mentální model, ale bez bordelu.**  
  List → detail → zájem → domluva. Jen bez toho nekonečnýho chatu, nátlaku a zmatených stavů.
- **Minimum psaní, maximum faktů.**  
  Domluva má být klikací timeline událostí (zájem, přijetí, čas, místo, hotovo). Chat existuje, ale je to doplněk, ne hlavní kanál.
- **Lokální a sousedský default.**  
  Poloha je povinná, řazení a filtry jedou přes vzdálenost. Směr je setkání, ne balíková logistika.
- **Důvěra jako výsledek systému.**  
  Ne “ověření identity”, ne “AI detekce”, ne “tajný skóre”.  
  Místo toho: jasný pravidla, měkká frikce, uzavřený transakce (“zavřeno je zavřeno”), žádný obcházení.
- **Férová monetizace bez ojebů.**  
  Když něco stojí peníze, je to vidět, je to pochopitelný, a dává to smysl. Žádný skrytý paywall, žádný “nejdřív tě navnadím a pak ti to seberu”.
- **Retence jako rituál, ne závislost.**  
  Lidi se vrací “kouknout se”. Nechci z nich dělat trofeje v analytice, chci jim dát důvod přijít zpátky, protože se tu fakt něco děje.

Jestli nějaká feature rozbije klid, předvídatelnost nebo charakter trhu, tak jde pryč. I kdyby byla “cool”.

<a id="ux-principy"></a>
### UX principy

> **Když to potřebuje nápovědu, je to špatně navržený.**  
> Tooltipy, otazníčky a “tady klikni” jsou jenom náplast na můj design fail.

Moje pravidla UX (aka věci, co mi brání dělat píčoviny):

- **Nulová tolerance k “hintům”.**  
  Žádný tooltipy, žádný `(?)`, žádný bubliny. UI si musí poradit samo.  
  Když uživatel tápe, je to moje vina. Ne jeho.
- **Konzistence > chytrost.**  
  Radši nudně správně než “wow” a pak milion výjimek. Výjimky zabíjí důvěru.
- **Empty state není prázdno. Je to status.**  
  Každý empty state má stejný pattern:  
  **status → krátký proč → jedno jasný CTA**  
  (ne pět možností, ne román, ne moralizování)
- **Prázdno je záměr.**  
  Méně šumu = méně nejistoty. Když feed nic nemá, je to signál, ne chyba.
- **Emoce můžou být v textu. Akce musí být mechanická.**  
  Status může být lidskej („škoda“, „meh“, „hotovo“), ale CTA musí být vždycky jasný a jednoznačný.
- **UI se chová “fyzikálně”.**  
  Žádný kejkle a “magie”, co se nedá předvídat. Když něco zmizí, má to důvod. Když něco zůstane, má to důvod.
- **Animace: kritický minimum, rychlost maximum.**  
  Animace nejsou feature, jsou luxus. Preferuju **okamžitou reakci** i za cenu drobnýho zmatení, protože je lepší, když se někdo na chvíli zamyslí, než aby mu UI dělalo kinetózu a blil na mobil.  
  Prakticky to znamená:
  - animuju jen tam, kde bez toho uživatel fakt ztratí kontext (typicky přechod stavu nebo otevření/zavření),
  - žádný “pomalý krásno”, žádný cirkus, žádný bouncy overshoot,
  - respektuju **`prefers-reduced-motion`** (kdo nechce pohyb, dostane minimum nebo nic),
  - animace nikdy nesmí blokovat ovládání: UI je interaktivní hned, ne až „až to dojede“.

Cíl není udělat dojem. Cíl je odstranit frustraci tak, aby si toho uživatel skoro nevšiml.

<a id="komunikace-a-transparentnost"></a>
### Komunikace a transparentnost

Nejrychlejší způsob, jak zabít důvěru, je dělat tajnosti a pak se tvářit, že “to je pro tvoje dobro”. Já na to seru. Chci, aby bylo jasný **kdo** za tím stojí, **proč** to tak je, a **co přesně** se děje s datama a penězma.

Co je tady pro mě povinný standard:

- **Jsem vidět.**  

  Žádný anonymní “tým”. Jméno, ksicht, odpovědnost. Když je průser, je to můj průser.
- **Monetizace je přiznaná, čitelná a férová.**  
  Žádný “zdarma… a pak překvapení”. Ceny, limity i důvod existence rozšíření jsou jasně napsaný.  
  Platíš za hodnotu, ne za to, že tě ošmelím o pozornost.
- **Celý zdroják je veřejně na GitHubu (source-available, ne OSS).**  
  Zbav-se.me je kompletně veřejně k nahlédnutí. Důvěra nemá stát na tom, že mi “prostě věříš”, ale na tom, že si to jde ověřit.  
  Zároveň to není open-source ve smyslu „dělej si s tím co chceš“. **Kód je čitelnej, licence je moje a pravidla použití jsou jasný.**

- **Transparentní účet (fakt transparentní, ne “někde dohledatelný”).**  
  Mám **bankovní transparentní účet** založenej explicitně jako veřejnej. Všechny příjmy i výdaje jdou přes něj a je **viditelně vytaženej i na landingu**.  
  Ne proto, že bych potřeboval, aby mi lidi posílali prachy (i když jo, taky), ale hlavně proto, že chci, aby šlo kdykoliv vidět, **co se děje uvnitř**. Žádný “shady shit”, žádný skrytý toky, žádný přetvářky. Důvěra není slogan, důvěra je průhlednost.
- **Žádný prodej dat třetím stranám.**  
  Ne reklamy, ne datový brokery, ne “partneři”. Tečka.
- **Měřím hodně a vážu to na uživatele.**  
  Ne proto, abych tě šmíroval, ale abych ti dal **reálný signál trhu**: co se děje s nabídkou a poptávkou, co funguje, co ne, a proč.  
  Transparentnost znamená: když něco měřím, umím říct *co*, *proč* a *co z toho máš ty*.
- **Pravidla jsou veřejný a konzistentní.**  
  Když něco bloknu, omezím nebo zavřu, musí být jasný proč. Žádný skrytý penalizace, žádný “algoritmus rozhodl”.
- **Změny nesmí být tichý ojeb.**  
  Když něco zásadního změním, tak to přiznám. Nechci, aby uživatel musel hádat, jestli se produkt “nějak divně chová”.

Zjednodušeně: nechci si hrát na hodnýho. Chci být **předvídatelnej**. A to se bez transparentnosti nedá.

---

<a id="konkurenceschopnost"></a>
## Konkurenceschopnost

Konkurence (Sbazar, Bazoš, FB Marketplace a spol.) není “špatná”. Je to prostě *starej svět*: hodně šumu, hodně náhody, hodně domlouvání v mlze, málo jistoty. Lidi tam prodávají, protože tam “někdo je”, ne proto, že by to bylo příjemný.

Moje výhoda není „killer feature“. Moje výhoda je **charakter trhu** a **klidnej systém**, kterej snižuje mentální dluh. Většina marketplace dělá opak: zvyšuje stres, zvyšuje nejistotu, a pak to maskuje notifikacema, badgeama a “algoritmem”.

> Cíl není porazit všechny. Cíl je být tak příjemnej, že návrat do starýho chaosu bude bolet.

<a id="co-umim-lip"></a>
### Co umím líp

**1) Domluva: normální chat + strukturovaný fakta navíc**  
- U mě můžeš psát úplně normálně, žádnej zákaz, žádnej “musíš klikat”.  
- Rozdíl je v tom, že chat je **podpořenej strukturovanýma krokama a datama**: zájem, přijetí/odmítnutí, čas, místo, tracking link, potvrzení, ukončení.  
- Výsledek: když si lidi chtějí psát, píšou. Když nechcou, projdou to klikáním. A hlavně: i když píšou, **systém pořád drží kontext a fakta**.
**2) Klidný UX, co nevysvětluje a netlačí**  
- Žádný onboarding jako školení. Žádný tooltipy, žádný “tady klikni”.  
- UI má být tak čitelný, že nepotřebuje kecy.  
- Ticho a jistota jsou designovej cíl, ne vedlejší efekt.
**3) Lokace jako core, ne jako schovaná mapa pro trpělivý**  
- Poloha je **součást inzerátu**, ne něco, co musíš lovit v mapě jak ocas.  
- Vidíš vzdálenost a kontext rovnou v listu i detailu. Mapu řešíš jen když chceš, ne protože musíš.  
- To je praktický v reálným světě: když jsi venku, nechceš přepínat do mapy a pátrat, kde to vlastně je.
**4) “Zavřeno je zavřeno” + žádný obcházení**  
- Transakce je stav. Má začátek, má konec.  
- Když je to zavřený, je to zavřený. Žádný nekonečný doťukávání.  
- Systém není emocionální, ale je předvídatelnej. A to snižuje toxický chování.
**5) Ochrana prodejce je feature, ne vina**  
- Prodejce může zájem ignorovat bez postihu.  
- Odpovědnost začíná až přijetím.  
- Tohle zabíjí mentální dluh a pocit, že “musím reagovat”. A tím paradoxně zvyšuje šanci, že lidi budou reagovat.
**6) Transparentnost jako systémová vlastnost**  
- Pravidla jsou jasný, viditelný a konzistentní.  
- Když něco omezuju, zavírám nebo řadím, má to čitelný důvody, ne “black box”.  
- Důvěra tu nevzniká z marketingu, ale z toho, že se systém chová předvídatelně a dá se mu věřit i ve chvíli, kdy se ti něco nelíbí.
**7) Data dělám pro uživatele, ne pro inzerenty**  
- Měřím hodně a vážu to na uživatele, protože chci dát lidem **signál trhu**: co se děje s poptávkou a nabídkou, co funguje, co ne.  
- Ne proto, abych z toho vyráběl reklamní profil a prodával ho ven.  
- Když něco měřím, má to mít smysl v produktu: metriky, přehled, férový mechaniky.
**8) “Měkká frikce” místo manipulace**  
- Záměrně dávám do systému jemný brzdy a strukturu, aby se lidi chovali líp bez moralizování.  
- Nechci gamifikací zakrývat špatnej produkt. Chci, aby odměny jen jemně podporovaly zdravý chování.
**9) Minimalismus i v médiích (žádný video spam)**  
- Ne proto, že “to nejde”, ale protože video zvedá šum, náklady a bordel ve feedu.
**10) Osobní data jen dočasně, pak trvale pryč**  
- Osobní údaje (typicky věci, co si lidi napíšou v chatu: telefon, adresa, “jsem doma v 18:00”, cokoliv osobního) jsou v systému jen **dočasně v rámci kontextu transakce**.  
- Jakmile transakce skončí (nebo vyprší její smysl), tyhle věci jsou **trvale smazaný**. Ne “možná”, ne “někdy”, ne “podle situace”.  
- Držím **striktně minimum dat**, který je v daný okamžik nutný, a jakmile nutnost skončí, data jdou pryč.  
- Důvod je jednoduchý: čím míň toho držím, tím míň toho může utéct, zneužít se, nebo se z toho časem stát “no jo, ale ono by se to hodilo…”.

<a id="slabina"></a>
### V čem je má slabina

Nejsem naivní. Tohle jsou moje slabiny a vědomý trade-offy:
- **Network efekt:** Na začátku tam nebude “všechno”. Bude tam jen to, co se podaří postavit lokálně.  
  Řešení není “globální launch”, ale lokální start a budování komunity.
- **Míň impulsního prodeje přes chaos:** V bordelu se prodá ledacos jen proto, že to někdo uvidí náhodou.  
  Já radši míň šumu a víc relevantních interakcí. Krátkodobě to může vypadat pomaleji, dlouhodobě je to zdravější trh.
- **Transparentnost je závazek:** Když slíbím férovost a průhlednost, nemůžu pak dělat kličky.  
  To je dobře, ale je to práce. A občas to znamená říct “ne” i věcem, co by vydělaly.
- **Nejsem pro každýho:** Tohle je filtr. Někdo chce agresivní topování, manipulaci a “rychle prodat za každou cenu”.  
  Takový lidi chci spíš odradit, ne přitáhnout.
- **Průhlednost přitahuje i hejtry:** Čím víc jsi transparentní, tím víc se v tom někdo bude hrabat.  
  Já s tím počítám. Je to cena za důvěru.

<a id="co-nedelam"></a>
### Co vědomě nedělám

Tady jsou věci, který mě lákaj “na peníze” nebo “na růst”, ale zabily by charakter:

- **Žádný prodej dat.** Nikdy.  
- **Žádný dark patterns.** Žádný “nejde odejít”, žádný schovaný volby, žádný vynucený souhlasy.  
- **Žádný pay-to-win.** Platíš za nástroje a pohodlí, ne za to, že systém lže ostatním o kvalitě.  
- **Žádný spam-notifikace a onboarding-maily.** Informace ano, nátlak ne.  
- **Žádný “AI řeší všechno”.** Bezpečnost a důvěra stojí na prevenci, pravidlech a struktuře, ne na kouzelný krabičce.  
- **Žádný video feed cirkus.** Nechci z tržiště dělat TikTok.  
- **Žádný vysvětlování rozdílů proti konkurenci.** Když to potřebuje vysvětlit, je to špatně. Rozdíl se má projevit chováním UI.

Konkurence prodává dosah. Já prodávám **klid, předvídatelnost a důvěru**.

---

<a id="kodex"></a>
## Kodex

Kodex je moje “no bullshit” vrstva. Není to právní text, ale sada pravidel, který držím i ve chvíli, kdy by bylo strašně lákavý je ohnout kvůli růstu nebo penězům.

> Pokud nějaká feature nebo monetizační nápad poruší kodex, tak je to automaticky **špatně**.  
> Ne “možná”, ne “nějak to vysvětlíme”. Prostě špatně.

Co je tady svatý:

- **Důvěra je výchozí stav**, ne odměna za poslušnost.
- **Žádný skrytý motivy** (algoritmický kejkle, tajný penalizace, “doporučení” co je ve skutečnosti reklama).
- **Monetizace je férová a přiznaná**: platí se za hodnotu, ne za manipulaci.
- **Žádný pay-to-win**: peníze nesmí dělat z lidí “lepší občany”.
- **Data držím jen tak dlouho, jak je to nutný**. Jakmile důvod skončí, data jsou pryč.

Kodex není “image”. Kodex je brzda, co mi brání udělat z toho další tržnici, kde se všichni tvářej hodně cool, a pak tě potichu omrdaj.

<a id="duvera-default"></a>
### Důvěra jako výchozí stav

Důvěra u mě není “odměna” ani razítko po ověření identity. Je to **vlastnost prostředí**, kterou dělám tím, jak se systém chová. Nechci “AI policajta”, chci předvídatelný pravidla.

Co tím přesně myslím:

- **Neověřuju důvěru přes identitu.** Nepotřebuješ občanku, aby ses mohl chovat normálně.
- **Hranice jsou jasný a vymahatelný.** Co nejde, prostě nejde (a nedá se to obcházet).
- **Odpovědnost je na straně uživatelů.**  
  Systém nastaví rámec, ale nehraje si na chůvu. Typicky: **citlivý obsah** je primárně sebeoznačení prodejce. Když to někdo zneužívá (maskuje citlivý jako běžný), je to porušení pravidel a důvod k zásahu.
- **Odpovědnost začíná přijetím.** Nezájem není zločin. Přijetí je vědomý závazek.
- **Transakce má začátek a konec.** Zavřený věci zůstávají zavřený. Nový kontakt = nový začátek.
- **Systém je klidnej, lidi můžou být emotivní.** UI nezvyšuje stres, jen drží strukturu.

Detaily těchhle pravidel jsou rozepsaný v Mechanikách (citlivost obsahu, ochrana prodejce, “zavřeno je zavřeno”, struktura transakce).

<a id="ferova-monetizace"></a>
### Férová monetizace a neaktivita

Monetizace je u mě přiznaná a čitelná. Nechci vydělávat tím, že někoho zmatu, tlačím do rozhodnutí, nebo mu nechám projít půl workflow a teprve na konci mu oznámím „tak zaplať, jinak nic“. Paywall není past. Je to cedule u dveří: vidíš ji dřív, než do nich vejdeš.

Co platí:

- **Platí se za hodnotu, ne za nátlak.**  
  Rozšíření jsou nástroje a výhody, ne páky na manipulaci.
- **Žádný “gotcha” momenty.**  
  Když něco stojí peníze, je to vidět dřív, než do toho uživatel narve čas.
- **Férovost i v neaktivitě.**  
  Když uživatel dlouho nic nedělá, nechci mu potichu cucat peníze jen proto, že zapomněl.  
  Neaktivita je signál “už to teď nepoužívám” a systém se k tomu má postavit fér.
- **Jednoduchost před šikanou.**  
  Žádný komplikovaný cancel flow, žádný “najdi to v sedmý obrazovce”. Zrušení musí být snadný a jasný.

Konkrétní pravidla kolem předplatného, passů a balíčků jsou rozepsaný v sekcích Ekonomika / Předplatné.

<a id="no-p2w"></a>
### Žádné pay-to-win

Peníze u mě nesmí dělat z lidí “lepší občany”. Nechci trh, kde vyhrává ten, kdo nejvíc zaplatí, a ostatní jen čumí na zadek.

Co to znamená:

- **Platíš za nástroje, ne za lež.**  
  Rozšíření můžou dát pohodlí, rychlost, přehled, signalizaci. Nemůžou falšovat realitu.
- **Žádný skrytý boosty mimo pravidla.**  
  Když něco zvýrazním, je to vidět, je to pojmenovaný, a je jasný, co to dělá.
- **Žádný penalizace pro “neplatící”.**  
  Neexistuje tajný “handicap”, že neplatíš, tak se ti to bude potichu schovávat.
- **Rovný základ trhu.**  
  Každej má šanci uspět bez toho, aby musel platit jen za to, že existuje.

Jestli nějaká monetizační věc začne vypadat jako “kup si vítězství”, tak je to automaticky špatně.

<a id="respekt"></a>
### Respekt k uživateli

Uživatel není cíl pro optimalizaci metrik. Je to člověk, co si chce v klidu prodat nebo koupit věc. Můj úkol je nepřekážet a nevytvářet mu mentální dluh.

Respekt v praxi:

- **Neotravovat.** Notifikace jsou informace, ne bič. Žádný spam, žádný urgence, žádný FOMO.
- **Nemanipulovat.** Žádný dark patterns, žádný “confirm shaming”, žádný schovaný volby.
- **Dávat kontrolu.** Uživatel ví, co se děje, a může to ovlivnit (filtry, ignor, citlivost, ukončení).
- **Neznehodnocovat čas.** Minimum kroků, žádný zbytečný potvrzování, žádný “podívej se ještě sem”.
- **Nebýt creepy.** Data sbírám s jasným účelem pro produkt a metriky trhu, ne pro reklamní profilování a prodej ven.

Respekt je jednoduchý: neudělám nic, co bych nesnášel, kdyby to někdo dělal mně.

<a id="otevrenost"></a>
### Otevřenost a odpovědnost

Nejsem anonymní “tým” a nechci se za nic schovávat. Když něco poseru, je to moje. Když něco funguje, je to taky moje. Tohle je one-man projekt a přesně tak se k tomu chovám.

Zároveň to nestavím jako “ručně řízený cirkus”. Systém je navrženej tak, aby běžel **tak dlouho, jak o něj bude zájem**, i bez mýho denního zásahu. Je to co nejvíc **standalone ekosystém**, kterej řídí primárně uživatelé a jasný pravidla, ne skrytý admini uvnitř. Žádný “neviditelný ruce”, žádná zákulisní magie. Co jde vyřešit strukturou a mechanikama, má řešit struktura a mechaniky.

Co z toho plyne:

- **Jsem dohledatelnej a viditelnej.** Žádný bezejmenný logo, žádný “support@něco”.
- **Pravidla nejsou magie.** Když systém něco dělá (řazení, gating, omezení), je jasný proč.
- **Změny neprobíhají potichu.** Když změním něco zásadního, přiznám to.
- **Odpovědnost nejde outsourcovat na algoritmus.** “Algoritmus rozhodl” je výmluva. Já rozhoduju.

A jestli to někomu přijde moc osobní, tak jo. To je pointa. Důvěra je jednodušší, když víš, kdo za tím stojí.

---

<a id="terminologie"></a>
## Terminologie

Tady si zametám před prahem, aby se mi později nerozpadla hlava na detailech typu „token vs kupón vs pass“ a aby UI nemluvilo pokaždý jinak. Terminologie není slovíčkaření, je to prevence bordelu: když něco pojmenuju blbě, začne se blbě chovat i produkt.

> Jedno slovo = jeden význam.  
> Když začnu používat stejný slovo pro dvě věci, tak jsem si právě zadělal na bug.

V týhle sekci jsou jen definice. Implementace a chování patří do Mechanik.

<a id="kupon-token-term"></a>
### Kupón vs. Token vs. Pass

Tyhle tři věci vypadají podobně, ale jsou to tři různý nástroje. Když je smíchám, vznikne produktovej bordel a uživatel začne mít pocit ojebu. Takže: jedno slovo = jeden význam.

- **Token** = *měna (palivo)*  
  Tokeny jsou univerzální “peníze uvnitř systému”.  
  - získám je (koupím / dostanu / vydělám)  
  - pak je **utrácím** za věci a funkce  
  - token je po utracení pryč  
  Token je o **volnosti**: můžu se rozhodnout, za co ho použiju.

- **Kupón** = *poukázka na konkrétní akci (bez expirace)*  
  Kupón není měna. Kupón je “máš přesně tohle” a drží se jako **lístek/jízdenka bez data spotřeby**:  
  - **1× Mark**  
  - **1× Top**  
  - **1× Multi-Category**  
  - **1× Anti-topper**  
  Kupón je o **konkrétnosti**: buď ho použiju na tu danou věc, nebo mi prostě zůstane v inventáři. Žádný „vypršelo ti to, smůla“.

- **Pass** = *časově omezený stav / oprávnění*  
  Pass není měna ani poukázka. Pass je “od teď do tehdy máš zapnutý oprávnění / režim”.  
  - typicky navázanej na předplatný nebo balíček  
  - funguje jako **stav**, ne jako spotřební item  
  - během platnosti může dávat opakovanou výhodu (např. vyšší limity, aktivní režim, přístup k metrikám, imunita vůči anti-topperu apod.)

Zjednodušeně:
- **Tokeny** = *za co platím*  
- **Kupóny** = *co přesně můžu jednou použít*  
- **Passy** = *co mám aktivní v čase*

A v UI platí jedno pravidlo: uživatel musí vždycky jasně vidět, jestli něco **utrácí** (token), **spotřebovává** (kupón), nebo **aktivuje na čas** (pass).

<a id="feed-seznam-term"></a>
### Feed vs. Seznam
- **Feed (technicky):** Uložené nastavení filtru nad inzeráty (kategorie, lokace, cena...).
- **Seznam (UI):** Uživatelský název pro Feed. V aplikaci mluvím o „Mých seznamech“.
- **Inzeráty (UI tlačítko):** Chytrý odkaz, který uživatele hodí do posledního navštíveného seznamu (nebo defaultního).

<a id="typy-feedu"></a>
### Typy Feedu
- `user` – **Uživatelský seznam**. Vědomá volba uživatele (uloženo v „Moje seznamy“). **Tento typ se počítá do limitu počtu feedů.**
- `search` – **Hledací kontext**. Interní stav pro stránku Hledat (v seznamu „Moje seznamy“ ho nezobrazuji). **Tento typ se nepočítá do limitu počtu feedů.**

<a id="typy-obsahu"></a>
### Typy obsahu (Citlivost)
- **Běžný:** Standardní inzerát pro všechny (kočárek, telefon).
- **Pro dospělé:** Legální, ale vyžaduje plnoletost (alkohol, vaping).
- **Citlivé:** Vyžaduje opatrnost a rozum (airsoft, nože).
- **Omezené:** Regulováno zákonem (skutečné zbraně).

<a id="stavy-inzeratu"></a>
### Stavy inzerátu
- **Live (Aktivní):** Inzerát je publikovaný, neexpirovaný a dostupný k prodeji. Počítá se do limitů.
- **Expired (Expirovaný):** Inzerát vypršel (`expiresAt`). Už ho nelze najít v běžném seznamu, interakce jsou zakázané (kromě flagování).
- **Sold (Prodaný):** Inzerát byl prodán a systémově uzavřen.

<a id="aktivita"></a>
### Aktivita
- **Aktivita uživatele:** Jakýkoli záznam v **User Event Logu** (kliknutí, zobrazení, scroll).

---

<a id="ui"></a>
## UI

Tato sekce popisuje **hlavní části aplikace** a jejich smysl. Neřeším layout (od toho je Figma), ale logiku a pravidla chování.

<a id="landing-ui"></a>
### Landing Page (Struktura)
Landing page je vizitka mého postoje k projektu. Skládá se z 5 pevných bloků:
1.  **Hero:** Claim „Nakupuješ nebo prodáváš?“ a dvě rovnocenná CTA: „Už se známe“ (Login) a „Přidej se!“ (Register).
2.  **Autor:** Má fotka, mé jméno, odkaz na můj GitHub a motto „Bez keců. Bez ojebů“. Tvář dává důvěru.
3.  **Aktivita vývoje:** Živý GitHub-like kalendář (heatmap), který ukazuje, jak na projektu makám.
4.  **Live Pulse:** Seznam posledních událostí v appce (nové registrace, inzeráty, transakce), aby bylo vidět, že to žije.
5.  **Transparentní účet:** Odkaz na bankovnictví. Finance netajím.

<a id="navigace"></a>
### Navigace a Dashboard
- **Home Kupujícího (Chci nakupovat):**
  - **Inzeráty:** Kliknutí vede okamžitě na **poslední použitý Seznam** (nebo default). Uživatel neřeší "feed", prostě jde "na trh".
  - **Moje seznamy:** Tady spravuji své filtry (Feedy). Zde si definuji, co chci sledovat.
  - **Zprávy:** Přehled transakcí.
  - **Oblíbené:** Rychlý přístup k olajkovaným inzerátům.
- **Home Prodejce (Chci prodávat):**
  - Samostatný dashboard zaměřený na správu inzerátů a prodejů (metriky, stavy).
- **Bottom Nav:**
  - Domů | Moje seznamy | **Přidat (+)** | Bonusy/Obchod | Profil

<a id="tvorba-inzeratu"></a>
### Tvorba inzerátu (Draft Gate)
- Vstup do editoru je **podmíněn limitem aktivních inzerátů**.
- **Tvrdá závora:** Pokud uživatel dosáhl limitu, **nepustím ho do editoru**.
  - Místo formuláře zobrazím **Status Screen**.
  - Obsah statusu: "Máš plno. Chceš další? Použít kupón nebo si dokup místo." (konkrétní text řeší copy).
  - **Žádné syslení draftů:** Pokud nemůžeš publikovat, nemůžeš ani psát.
- **Editor:**
  - Pokud je uživatel pod limitem, pustím ho do Draftu.
  - Editor je jedna kontinuální činnost (scroll).
  - Data se ukládají průběžně (autosave).

<a id="moje-seznamy"></a>
### Moje seznamy (Feedy)
- Seznam zobrazuje pouze feedy typu `user`.
- `search` (poslední hledání) sem nepletu.
- Uživatel zde může přepínat mezi svými kontexty (např. "Vaping" vs "Bazar aut").
- "Nový seznam" zakládá nový sledovací filtr.

<a id="rozsireni-ui"></a>
### Rozšíření a Aktivace
- UI Rozšíření slouží jako **ovládací pult pro rozšíření a vylepšení**.
- **Sekce Aktivace Passů:**
  - Zobrazuji seznam dostupných vylepšení (Passů).
  - Tlačítko pro aktivaci je **chytré**:
    - Pokud má uživatel **Kupón**: Tlačítko říká "Aktivovat (1x Kupón)" → Aktivace spotřebuje kupón.
    - Pokud uživatel **nemá Kupón**: Tlačítko říká "Aktivovat (XX Tokenů)" → Aktivace strhne tokeny.
  - Aktivace je okamžitá konverze (Kupón/Token → Pass).
- **Sekce Ostatní kupóny:**
  - Odděleně pod passy zobrazuji kupóny, které nejsou přímo vázané na aktivaci passu (pokud takové existují).

<a id="zpravy-ui"></a>
### Zprávy (Transakce)
- UI pro komunikaci a obchod.
- Podpora **strukturovaných widgetů**: Kromě textu umím zobrazit balíčky (tracking), lokace a systémové stavy.

<a id="profil"></a>
### Profil / Nastavení
- Preference uživatele (citlivost obsahu, notifikace).
- Zde se řeší "kdo jsem" a "co snesu vidět".

---

<a id="zakladni-kameny"></a>
## Základní stavební kameny

> Definice entit a dat, na kterých stavím vše ostatní.

<a id="uzivatel"></a>
### Uživatel
- Core entita.
- Držím absolutně minimální data – mám jen **email**, nic jiného neukládám.
- Respektuji anonymitu. Bezpečnost řeším sledováním chování (reputace), ne lustrováním občanky.

<a id="kategorie"></a>
### Kategorie
- Organizační vrstva trhu. Kontext, ve kterém dává smysl jiný jazyk a filtry.
- Kategorie nese: **název**, **slug**, **locale**.
- **Category Spec (Parametry):**
  - Kategorie může definovat doplňující údaje (např. u aut „rok“, u vapingu „typ baterky“).
  - Tyto parametry řídí **UI tvorby inzerátu** (co vyplňuji) a **UI filtrování** (co hledám).
  - Parametr má typ (text, number, enum, bool) a režim filtru (equality nebo range).
  - **Range filtry jsou explicitní:** Parametr se nestane range filtrem sám od sebe, musí to být vědomé rozhodnutí v definici kategorie.
- **Sezónní kategorie:**
  - Kategorie jako „Vánoce“, „Velikonoce“, „Valentýn“ existují celoročně.
  - Obsah v nich se čistí přirozeně expirací, neřeším ruční úklid „mrtvol“.
  - Umožňuji tak uživatelům chytat vlny zájmu bez mého zásahu.

<a id="inzerat"></a>
### Inzerát
- Souhrn atributů a fotek reprezentující nabízenou věc.
- **Atributy:**
  - **Obsah:** Title, description, pros/cons.
  - **Galerie:** Kolekce uploadů.
  - **Cena:** Částka + měna + typ (pevná/otevřená).
  - **Globální parametry:** Condition (stav), age (stáří), delivery, warranty.
  - **Specifické parametry:** Data dle definice kategorie (JSONB).
  - **Lokalita:** Odkaz na entitu Lokace + souřadnice.
- **Metriky a eventy:**
  - Nad inzerátem měřím eventy pro vyhodnocení zájmu: **Impression** (scroll), **View** (detail), **Visible** (zobrazení).
  - Dále sleduji: **Flag** (nahlášení), **Ignor** (skrytí), **Favourite**.

### Měření (eventy a metriky)

Měření slouží k dvěma věcem:
1) dát prodávajícímu férový signál „děje se to / neděje se to“,  
2) umožnit pár mechanik (např. anti-topper/payback) bez toho, aby z aplikace byl šmírovací cirkus.

Měření je objektově orientované: sledujeme **inzerát**, ne člověka.

#### Principy

- Eventy jsou **append-only** a slouží pro agregace.
- Neukládáme IP adresy, device fingerprinty ani jiné “marketingové” identifikátory.
- Deduplikace je záměrně “měkká” (typicky na klientovi v rámci jedné relace). Cíl není laboratorní přesnost, ale konzistentní signál.

#### Základní eventy nad inzerátem

Event log nad inzerátem používá tyto typy událostí:

- `visible`
- `impression`
- `view`
- `anti-topper`

#### Definice metrik a časovačů

Časovače jsou produktové rozhodnutí, ne implementační detail.

- **Visible (`visible`)**
  - Odpálí se, když je karta inzerátu v listingu ve viewportu alespoň **0,5 s**.
  - Cíl: základní „uživatel to reálně viděl“, ne jen že to proletělo kolem v scrollu.

- **Impression (`impression`)**
  - Odpálí se, když uživatel u inzerátu v listingu „pozastaví“ a karta zůstane ve viewportu alespoň **1,6 s**.
  - Cíl: signál, že inzerát zaujal natolik, že u něj člověk zpomalil.

- **View (`view`)**
  - Odpálí se, když uživatel otevře detail inzerátu a zůstane na něm alespoň **2,5 s**.
  - Cíl: signál skutečného zájmu o obsah detailu, ne jen omylové otevření.

- **Anti-topper (`anti-topper`)**
  - Pokud má uživatel aktivní anti-topper a v listingu by se mu měl ukázat inzerát se zvýrazněním **Mark/Top**, systém místo `visible` vytvoří event `anti-topper`.
  - Smysl: vědět, kolikrát bylo zvýraznění potlačeno (kvůli metrikám a případnému paybacku).
  - Pro **Top Maxxi** se `anti-topper` negeneruje (je imunní vůči potlačení).

#### Deduplikace a frekvence

Aby se eventy nestaly spamem:

- `visible` / `impression` se v rámci jednoho zobrazení listu pro daný inzerát posílají maximálně jednou.
- `view` se posílá maximálně jednou na jedno otevření detailu.

#### Použití v produktu

- Prodávající může (typicky přes placené rozšíření) vidět agregace typu:
  - `visible`, `impression`, `view`
- Anti-topper poměr se počítá jako:
  - `anti-topper / (visible + anti-topper)`
  - (jde o agregaci z eventů; není to “unikátní uživatelé”, pokud to není výslovně definované jinde)

<a id="draft"></a>
### Draft
- Kopie atributů inzerátu ve stavu zrodu.
- Vstupní bod tvorby. Inzerát nenechám vzniknout kliknutím, vzniká z Draftu.
- Umožňuje postupnou tvorbu (autosave) bez rizika ztráty dat.
- Spravuji seznam Draftů (možnost šablon/kopírování).

<a id="feed-entita"></a>
### Feed (Entita)
- Uložené nastavení filtru nad inzeráty.
- Není to jen seznam, je to **předpis**: "Co chci vidět" (kategorie, filtry, lokalita).
- Feed si pamatuje svou vlastní lokalitu (např. "Feed pro chatu" vs. "Feed pro práci").
- Defaultně zakládám uživateli obecný Feed bez filtrů.
- **Vyhledávání === Feed:** Systémově beru hledání jen jako speciální instanci Feedu.

<a id="transakce"></a>
### Transakce
- Most mezi prodejcem a kupujícím.
- Zastupuje interakci, v systému se prezentuje jako „Zprávy“.
- Každá transakce má **vlastní vlákno zpráv** (izolovaný kontext).
- Transakce nese stav (pending, open, sold...).

<a id="zpravy-entita"></a>
### Zprávy
- Obsah transakce.
- **Typy obsahu:**
  - Text.
  - Obrázky.
  - **Strukturovaná data:** Lokace, tracking balíčku, kontaktní údaje.
  - **Systémové zprávy:** Oznámení generovaná systémem (např. "Prodáno").
- Strukturovaná data ukládám odděleně, aby šla snadno a cíleně mazat (GDPR/Clean-up).

<a id="notifikace"></a>
### Notifikace (Inbox)
- Jediný zdroj pravdy pro "co se stalo".
- Všechny události padají do **Inboxu**. Email je jen volitelný "forwarder".

<a id="lokace"></a>
### Lokace
- Autorita na polohu.
- Neukládám random stringy, odkazuji se na validní záznam ze služby vyhledávání adres.

<a id="upload"></a>
### Upload
- Centrální správa souborů (fotek).
- Metadata k souborům na CDN.

<a id="hodnoceni"></a>
### Hodnocení (Ranking)
- Pokud není řečeno jinak, používám školní stupnici **A-F** (A = nejlepší).
- Interně to mapuji na čísla 6 (A) až 1 (F).

---

<a id="mechaniky"></a>
## Mechaniky

> Mozek celé aplikace. Pravidla hry.

### Citlivost obsahu

Citlivost je moje vědomá brzda proti tomu, aby se z veřejného feedu stal bordel, a zároveň nástroj pro lidi, kteří *některý* typ obsahu chtějí vidět. Nehraju si na policajta, ale **dávám jasné brány a jasný signál**.

#### Úrovně citlivosti

Inzerát má vždy jednu úroveň citlivosti:

- **Běžný (common)** (default)  
  Normální věci, které nikoho rozumného nepřekvapí.
- **Pro dospělé (adult)**  
  Věci vyžadující plnoletost nebo typicky „adult“ kontext (např. alkohol, e-cigarety, erotika v legálním rámci).
- **Citlivé (sensitive)**  
  Věci, které můžou znervóznit nebo vyžadují víc rozumu (např. repliky/airsoft apod.).
- **Omezené (restricted)**  
  Obsah, kde už existují zákonná omezení (typicky zbraně apod.). Systém **neprovádí ověřování oprávnění**, ale **očekávám, že uživatel jedná podle zákona**.

Pozn.: Úrovně jsou **stupňované** (common < adult < sensitive < restricted). Kdo si povolí vyšší, implicitně povoluje i nižší.

#### Gating (opt-in)

- Defaultně každý uživatel vidí jen **Běžný** obsah.
- Uživatel si musí **vědomě** nastavit, jakou maximální úroveň chce vidět:
  - primárně v **profilu** (jednorázové nastavení; drží se, dokud ho uživatel nezmění),
  - teprve potom se mu v **nastavení feedu / hledání** zpřístupní filtr citlivosti (podle jeho maxima).
- Po opt-inu už žádné divadlo: žádný blur, žádné „are you sure?“ pop-upy.  
  Citlivost jen zůstává viditelná jako **badge** (v listingu i detailu).

#### Pravidla viditelnosti

Citlivost je **hard gate** napříč celou aplikací:

- **Feed / Hledat / jakýkoliv listing**:  
  Inzeráty nad maximem citlivosti uživatele se **vůbec nedostanou do seznamu**.
- **Detail přes přímý odkaz**:  
  Pokud citlivost nesedí na maximum uživatele, server vrací **404**.  
  Důvod: nechci, aby šlo citlivost obcházet sdílením linků, ani aby šlo „čichat“ existenci inzerátu přes rozdíl 403/404.

Důležité: Ostatní brány (ignor, expirace, release window) **nesmí blokovat otevření detailu**. Můžou ovlivnit seznam, ale detail je dostupný.  
**Citlivost je jediná výjimka**, která může detail tvrdě schovat (404).

#### Odpovědnost a enforcement

- Citlivost je primárně **sebeoznačení** (odpovědnost prodávajícího).
- Pokud je inzerát zjevně a opakovaně špatně označený (např. „omezené“ maskované jako „běžný“), je to důvod k **ručnímu banu**.
- Cíl není hon na čarodějnice. Cíl je, aby veřejný prostor zůstal klidný a předvídatelný.

### Ignorování

Ignorování je osobní “úklid”. Není to report, není to trest, není to drama. Je to moje páka, jak si uživatel vyčistí feed a přestane ho otravovat věc, která ho nezajímá.

#### Co ignor znamená

- Ignorovaný inzerát je pro uživatele **skrytý ze všech seznamů**:
  - feedy
  - hledání
- Ignor **nemění nic globálně**: nepenalizuje prodejce, neovlivňuje ranking pro ostatní a nikomu se o tom nic nehlásí.
- Ignor se propíše do **metrik inzerátu** pro prodejce, aby měl přehled, jak moc je jeho inzerát nezajímavý.

Ignor je čistě: “mě už tohle nezobrazuj”.

#### Detail přes přímý odkaz

- Ignorování **nesmí blokovat otevření detailu** přes přímý odkaz.
- V detailu je viditelný stav **„Ignoruješ“** + akce **„Zrušit ignor“**.

Výjimka je jen **Citlivost obsahu** (ta jako jediná může vracet 404).

#### Ovládání a UX kontrakt

- Akce **Ignorovat** je dostupná:
  - v detailu inzerátu
- Po ignoru se inzerát **ztratí ze seznamu** (bez potvrzovacího modalu).

Ignor má být rychlej reflex, ne “formulář”.

#### Zobrazení ignorovaných (withIgnored)

Defaultně jsou ignorované inzeráty skryté. Přesto musí existovat možnost je zobrazit:

- Feed i hledání podporují přepínač/parametr **`withIgnored`**:
  - `false` (default) = ignorované se nezobrazují
  - `true` = ignorované se zobrazují (např. pro kontrolu)
- Volitelně může existovat režim **“Jen ignorované”** (např. v profilu jako seznam pro správu), ale není to core.

#### Scope a persistence

- Ignor je **globální pro uživatele** (napříč zařízeními).
- Ignor je **per-user stav** (doménová data uživatele), ne anonymní analytika.
- Anonymně se může do `listing_event` logovat událost typu `ignored` / `unignored` kvůli agregacím (bez userId), ale:
  - ignorování se nesmí stát “tajná penalizace” pro inzerát
  - je to jen signál pro hrubé pochopení obsahu (např. kvalita / relevance)

#### Ignor není flag

- **Ignorovat** = “nezajímá mě to”
- **Nahlásit (flag)** = “tohle porušuje pravidla / je to ojeb / je to nebezpečný”

UI to nesmí míchat dohromady. Ignor je tichý. Flag je výrazný.

<a id="stavy-lifecycle"></a>
### Stavy Inzerátu (Lifecycle)
Inzerát má v databázi **tvrdý status** (enum), který je autoritou pro systém. O přechody se starají uživatelské akce nebo cron joby.
- **Live (Aktivní):** Inzerát existuje, čas `expiresAt` je v budoucnosti a nebyl označen jako prodaný.
  - Pouze `Live` inzeráty se počítají do limitu aktivních inzerátů a jsou viditelné v běžných feedech.
- **Expired (Expirovaný):** Čas `expiresAt` vypršel.
  - Přepnutí stavu zajišťuje cron.
  - Inzerát zmizí z feedů (pokud si ho uživatel explicitně nezapne).
  - Je read-only, nelze zahájit novou transakci.
- **Sold (Prodaný):** Inzerát byl systémově označen jako prodaný (na základě úspěšné transakce).
  - `Sold` je konečný stav. Inzerát je veřejně viditelný (pokud neexpiroval), ale nelze ho koupit.
  - Nezapočítává se do limitu aktivních inzerátů.
- **Poznámka:** Stav `deleted` neexistuje. Inzeráty nemažu, pouze expirují nebo se prodají (paměť trhu).

<a id="limity"></a>
### Limity
- **Limit feedů:**
  - Počítám pouze feedy typu `user`.
  - `search` (poslední hledání) je mimo limity (nezabírá slot).
  - Při překročení limitu feedy nemažu. Jen ty nadlimitní v UI skryji (disable).
- **Limit aktivních inzerátů:**
  - Limituji pouze inzeráty ve stavu **Live**.
  - Při překročení limitu (vypršení passu): Existující inzeráty nechám doběhnout. Aktivuje se **Draft Gate** (nepustím uživatele tvořit nové).

<a id="notifikace-mech"></a>
### Notifikace a Inbox
- **Filosofie ticha:** Defaultní stav je neotravovat.
- **Inbox First:** Všechny události padají do in-app Inboxu.
- **Email jako zrcadlo:** Email je pouze volitelný "digest". Uživatel si nastavuje, co chce přeposílat (frekvence/typ).
- **Výjimka:** Reset hesla a bezpečnostní alerty chodí na email vždy.

<a id="seznam-viditelnost"></a>
### Seznam inzerátů a Viditelnost
- **Seznam:** Neexistuje statická stránka. Seznam je vždy výsledek Feed dotazu.
- **Limit:** Tvrdý strop **200 inzerátů** na dotaz (výkon + použitelnost).
- **Hierarchie řazení (Priority Sort):**
  1.  **Top Maxxi** (imunní vůči všemu, vždy nahoře).
  2.  **Top** (pod Maxxi).
  3.  **Běžné inzeráty**.
- Uvnitř skupin řadím dle preference uživatele (cena, vzdálenost...).
- **Anti-topper (Mechanika):**
  - Pokud má kupující aktivní Anti-topper, měním hierarchii listingu, který vidí:
  - 1. **Top Maxxi**.
  - 2. **Top + Běžné** (smíchám dohromady a seřadím čistě podle preferencí uživatele). Top ztrácí výhodu pozice, zůstává mu jen badge.
- **Expirované inzeráty:** Ve feedu je defaultně neukazuji (nutný explicitní filtr). Přímý odkaz funguje (read-only).

<a id="zivotni-cyklus"></a>
### Životní cyklus inzerátu
- **Release Window (Early Access):**
  - Nový inzerát má **+8h** zpoždění pro běžné uživatele.
  - Kupující s **Early Access** vidí inzerát hned.
  - Prodávající s **Early Delivery** ruší okno pro svůj inzerát (vidí ho všichni hned).
- **Boosty (Zvýraznění):**
  - **Mark:** Badge "Zvýrazněno".
  - **Top:** Skok na začátek seznamu (pod Maxxi). Potlačitelné Anti-topperem.
  - **Top Maxxi:** Absolutní přednost. Nepotlačitelné.
  - Všechna zvýraznění platí do **expirace inzerátu**.
- **Kontinuální nabídka:**
  - Pass, který prodlužuje život inzerátu (posouvá `expiresAt`).
  - Umožňuje inzerátu "přežít" expiraci a zůstat v aktivním cyklu.

<a id="payback"></a>
### Payback
- Kompenzace pro prodávajícího, pokud byl jeho **Top** potlačen Anti-topperem.
- Týká se pouze **Top** (Mark nekompenzuji).
- Payback je **Pass (Exclusive)** = nárok na refund mají pouze předplatitelé.
- Vyhodnocuji po expiraci inzerátu.
- Sleduji poměr zobrazení (Visible vs. Anti-topper eventy). Pokud poměr překročí definované prahy, vracím poměrnou část ceny boostu v **tokenech**.

<a id="obchod"></a>
### Obchod (Transakce)
- **Vznik:** Kupující klikne na „Mám zájem“ → vzniká transakce ve stavu `pending`.
- **Anti-spam:**
  - Ve stavu `pending` kupující **nemůže psát zprávy**.
  - Prodávající může `pending` přijmout (`open`) nebo odmítnout (`rejected`) bez vysvětlování.
- **Průběh (`open`):**
  - Otevírá se chat a možnost posílat strukturovaná data.
  - Prodávající označuje `resolved` (vyřešeno/odesláno).
  - Kupující dává finální `success` (úspěch) nebo `closed` (zavřeno/neutrál).
- **Sold (Prodáno):**
  - Jakmile je jedna transakce `resolved`, systém přepne inzerát do stavu `sold` a ostatní transakce ukončí (`sold`).
- **Expirace transakce:**
  - 3 dny bez aktivity = `expired`. Jakákoliv akce posouvá timer.
- **Dispute:**
  - Hint "něco nesedí".
  - **Nemá vliv na Karmu.**
  - **Metrika:** Propisuji do metrik obou stran ("Dispute Rate").

<a id="cistky"></a>
### Čistky dat
- Po ukončení transakce (`closed`, `sold`, `expired`) běží dvoufázový úklid:
  1.  **Ihned:** Mažu strukturovaná data (adresy, telefony). Text a obrázky zůstávají pro kontext.
  2.  **Po 3 měsících:** Hard delete celé transakce.

<a id="reputace"></a>
### Reputace a Metriky
- **Flagy (Nahlášení):**
  - **Inzerát:** Toggle v detailu inzerátu.
  - **Uživatel:** Jednosměrná akce dostupná **pouze v rámci transakce** (po `open`).
  - Flagy nemají automatický efekt (nebanují), ale propisují se do metrik.
- **Palce (Inzerát):**
  - Signál atraktivity nabídky (Like/Dislike).
- **Karma (Uživatel):**
  - Hodnocení **v rámci transakce**: **Like** (Dobrý) / **Dislike** (Špatný).
  - Lze udělit kdykoliv po otevření obchodu (`open`).
  - Pokud uživatel nehlasuje, bere se to jako neutrál.
- **Detail protistrany (Metriky):**
  - Placený nástroj (Pass). Umožňuje vidět tvrdá data o druhém uživateli.
  - **Score (A-F):** Agregovaná známka.
  - **Co měřím u Prodejce:** Reakční doba, Rate odmítnutí bez interakce, Resolved rate, Expirace, Vytížení, Aktivita, Flag rate.
  - **Co měřím u Kupujícího:** Reakční doba, Closer rate (instantní uzavření), Decision rate, Expirace, Vytížení, Aktivita.
  - Bez passu neukazuji nic (ani Score).
- **Ban:**
  - Ruční nástroj admina (já).
  - Banuji za podvody, spam nebo křížově špatně označený citlivý obsah.

### Hledat

Hledat je samostatná primární sekce. UXově to není „feed“, ale **vyhledávací kontext**, který se chová jako feed v backendu (protože používá stejný engine, stejné filtrování a stejný list UI).

#### `search` jako systémový kontext

- V systému existuje feed typu **`search`**.
- `search` je **singleton**: maximálně 1 instance na účet.
- `search` se **nezobrazuje v seznamu feedů**. Uživatel ho nespravuje jako položku mezi feedy.
- `search` je mimo limity: **nezabírá slot** a nejde ho „vyčerpat“. Limity feedů se týkají jen feedů typu `user`.

`search` si pamatuje poslední stav stránky Hledat (dotaz, filtry, radius, lokaci apod.), aby se uživatel vracel do stejného kontextu a nemusel všechno nastavovat znovu.

#### UI kontrakt

- Stránka Hledat je rychlá zkratka: input + filtry + výsledky v listu.
- Výsledky používají **stejný UI list** jako feedy (stejné karty, stejné interakce).
- Hledat nepřidává žádnou „magii“: jen skládá filtry a ukazuje výsledky.

#### Limity a uložení hledání

- Používat Hledat může každý vždy.
- Pokud chce uživatel uložit aktuální hledání jako feed, použije akci **„Uložit jako feed“**:
  - tím vznikne nový feed typu `user`,
  - ten už se zobrazuje v seznamu feedů a **počítá se do limitu**,
  - pokud je uživatel na limitu feedů, ukládání je blokované (Hledat dál funguje normálně).

#### Pravidla viditelnosti

Výsledky Hledat respektují stejné brány jako ostatní seznamy:

- **Ignorování**: ignorované se defaultně nezobrazují (lze zobrazit přes `withIgnored`).
- **Citlivost obsahu**: výsledky nad maximem citlivosti uživatele se do seznamu nedostanou.
- **Životní cyklus inzerátu**: expirované se do standardních výsledků nedostanou (pokud mechanika výslovně neříká jinak).

#### Reset

Hledat má vždy rychlou akci **„Reset“**, která vrátí vyhledávání do neutrálu (bez dotazu a bez filtrů). Bez modalů, bez keců.

### Multi-Category

Multi-Category je **distribuce**, ne duplikace. Nevznikají žádné kopie inzerátu, jen se rozšíří množina kategorií, přes které se inzerát může zobrazit.

#### Co to dělá

- Každý inzerát má jednu **primární kategorii** (ta je „pravda“ pro popis, atributy a UI).
- Multi-Category přidá k primární kategorii až **2 další kategorie** (sekundární).
- Inzerát se pak může zobrazit uživatelům, kteří sledují **kteroukoliv** z těchto kategorií.

Primární kategorie je pořád ta, podle které inzerát „vypadá“ a podle které se vyplňují atributy. Sekundární kategorie jsou čistě distribuční.

#### Pravidla viditelnosti a deduplikace

- V rámci jednoho seznamu se inzerát uživateli zobrazí **právě jednou**, i když matchuje víc kategorií zároveň.
- Pokud uživatel přepne na jiný feed nebo jiný kontext, může inzerát vidět znovu (to je v pořádku). „Právě jednou“ platí **pro jeden renderovaný seznam**, ne pro život.

#### Jak to funguje ve feedech a hledání

- Feed/hledání, které filtruje konkrétní kategorii, považuje inzerát za match, když:
  - filtr = primární kategorie **nebo**
  - filtr = jedna ze sekundárních kategorií
- Ostatní brány platí normálně:
  - ignorování (defaultně skryté),
  - citlivost obsahu (hard gate),
  - expirace a životní cyklus.

#### Výběr kategorií

- Sekundární kategorie musí být různé (bez duplicit).
- Primární kategorie se do sekundárních nepočítá (nedává smysl ukládat to samé dvakrát).
- Změna primární kategorie:
  - nemění automaticky sekundární (uživatel si to musí srovnat sám).

#### Entitlement (token vs pass)

Multi-Category je placené oprávnění. Uživatel ho získá buď:

- **tokenem** (jednorázové použití na konkrétní inzerát), nebo
- **passem** (globální oprávnění po dobu platnosti předplatného)

Konkrétní ceny a balíčky jsou definované v sekcích **Ceník** a **Balíčky a limity**.

#### UI signály

- Na kartě inzerátu se primárně ukazuje primární kategorie.
- Pokud má inzerát Multi-Category, UI může přidat malý, tichý signál typu:
  - „+2 kategorie“ (bez vypisování, ať to nezahltí)
- V editoru inzerátu je Multi-Category jasně pojmenované jako distribuce (ne „přidat další kategorii kvůli atributům“).

Multi-Category není hack na relevance. Je to legitimní nástroj, jak dostat inzerát k lidem, kteří ho fakt hledají v jiném šuplíku.

---

<a id="predplatne"></a>
## Předplatné

> Oprávnění se vážou na účet (neexistuje trvalá role "prodejce/kupující").

<a id="zkusebni-pro"></a>
### Zkušební Pro zdarma
- Každému novému uživateli dávám **1 měsíc Pro balíčku zdarma**.
- Trial aktivuji automaticky při registraci. Po vypršení se sám vypne.
- Cíl: Ať si uživatel vyzkouší aplikaci v plné síle.

<a id="srovnani-balicku"></a>
### Srovnání balíčků

| Položka | Kupující<br>(119 Kč) | Prodejce<br>(229 Kč) | **Pro**<br>(499 Kč) |
| :--- | :---: | :---: | :---: |
| **Tokeny / měsíc** | 300 T | 300 T | **600 T** |
| **Limity** | | | |
| Uložené Feedy | 5 | - | **10** |
| Aktivní inzeráty | 5 | 10 | **20** |
| **Passy (Trvalé)** | | | |
| Payback (Refund) | - | ✓ | **✓** |
| Photo Count (+foto) | - | ✓ | **✓** |
| Rozšířená data | - | ✓ | **✓** |
| Detail protistrany | - | - | **✓** |
| Anti-topper | - | - | **✓** |
| Early Access | - | - | **✓** |
| Multi-Category | - | - | **✓** |
| **Kupóny (Měsíčně)** | | | |
| Early Access | 5× | - | **(Pass)** |
| Anti-topper | 5× | - | **(Pass)** |
| Early Delivery | - | 3× | **3×** |
| Mark | - | 3× | **3×** |
| Top | - | 3× | **3×** |
| Top Maxxi | - | 1× | **3×** |
| Multi-Category | - | 3× | **(Pass)** |
| Kontinuální nabídka | - | 3× | **5×** |

<a id="tokeny-mena"></a>
## Tokeny (Měna)

> Palivo pro systém. Interní měna pro nákup jednorázových vylepšení (kamínky).

- **Interní kurz:** Baseline cca **1 CZK ≈ 2 Tokeny**.
- **Atomicitita:** Všechny transakce jsou atomické. Buď proběhne celý nákup/efekt, nebo se nic nestrhne.

### Nákup Tokenů

| Balíček | Cena (CZK) | Získám Tokenů | Výhodnost |
| :--- | :--- | :--- | :--- |
| **Na zkoušku** | 149 Kč | **300 T** | Standard |
| **Balík** | 299 Kč | **650 T** | +50 T zdarma |
| **Do zásoby** | 599 Kč | **1400 T** | +200 T zdarma |

### Bonusy za používání

Chci uživatele odměnit za drobnou práci, kterou mají s interakcí. Data, která generují (např. že je zboží prodané), jsou pro mě cenná.

- **Odměna za `resolved`:**
  - Bonus připisuji **prodávajícímu** ve chvíli, kdy přepne transakci do stavu `resolved`.
  - **Cíl:** Motivovat k úklidu inzerátů (aby nevisely jako "živé", když už jsou pryč).
  - Dokud prodávající neklikne, bonus nevzniká.
- **RNG Dropy ve feedu:**
  - Náhodně (s nízkou pravděpodobností) generuji Tokeny „mezi inzeráty“ při scrollování.
  - **Cíl:** Gamifikace a příjemné překvapení při prohlížení trhu.
- **Denní drop:**
  - V sekci Bonusy (Obchod) je k vyzvednutí malý denní příděl (cca 10 T).
- **Předplatné:**
  - Každý balíček obsahuje pravidelný měsíční příděl tokenů.
- **Anti-abuse:**
  - Bonusy se nemusí vyplatit, pokud systém vyhodnotí zjevné zneužití (např. cyklické zakládání a zavírání obchodů jen pro farmení).

<a id="kupony-passy"></a>
## Kupóny & Passy

> Centrální ceník systému.

- **Kupón:** Jednorázová položka (ticket), která slouží k aktivaci Passu.
- **Token:** Platidlo. Pokud nemám Kupón, platím Tokeny.
- **Pass:** Stav oprávnění (běží po dobu platnosti).
- **Exclusive:** Položky dostupné pouze v rámci předplatného (nelze koupit samostatně).

| Co                  | Typ                | Efekt / Trvání                                   | Cena (Token) |
| ------------------- | ------------------ | ------------------------------------------------ | ----------- |
| Early Access        | Kupón → Pass       | 7 dnů                                            | 80          |
| Early Delivery      | Kupón              | Zruší okno pro jeden inzerát                     | 40          |
| Anti-topper         | Kupón → Pass       | 7 dnů                                            | 40          |
| Mark                | Kupón → Pass       | 7 dnů                                            | 20          |
| Top                 | Kupón → Pass       | 7 dnů                                            | 50          |
| Top Maxxi           | Kupón → Pass       | 7 dnů                                            | 50          |
| Multi-Category      | Kupón              | 1 použití (1+2 kategorie)                        | 75          |
| Detail protistrany  | Kupón → Pass       | 7 dnů                                            | 50          |
| Photo Count         | Kupón → Pass       | 1 měsíc (+2 fotky)                               | 75          |
| Aktivní inzeráty 10 | Kupón → Pass       | 1 měsíc                                          | TBD         |
| Payback             | Pass               | Benefit předplatného                             | Exclusive   |
| Kontinuální nabídka | Kupón → Pass       | 1 měsíc (prodlouží život inzerátu)               | Exclusive   |

<a id="uvedeni-na-trh"></a>
## Uvedení na trh

Start dělím vědomě do dvou fází.

1.  **Fáze 1: Online komunity (Discord):**
    - Cílený start v uzavřených skupinách (např. vaping).
    - Vysoká důvěra, testování v zátěži, sběr prvního obsahu.
2.  **Fáze 2: Regionální expanze:**
    - Karlovy Vary + Ostrov + Sokolov.
    - Billboardy a marketing už nevedou do prázdna, ale do systému s historií.

---

<a id="retence"></a>
## Retence a paměť trhu

- Nepracuji s krátkodobou pozorností.
- **Paměť trhu:** Inzeráty po expiraci nemažu, tvoří historický kontext (ceny, trendy).
- **Čistky (Data Retention):**
  - **User Event Log:** Držím 1 rok (pro výpočet reputace).
  - **Inzeráty/Obrázky:** Držím dlouhodobě (paměť).
  - **Transakce:** Mažu po 3 měsících (GDPR/úklid).

---

<a id="odhady"></a>
## Odhady monetizace a růstu

**Křišťálová koule:** Odhad náběhu MAU a revenue (sekvenční start).

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
| 11+ | Discord + region | 11-12k | ~315k+ Kč |

- **Konverzní cíl:** ~3 % MAU platí.
- **Odhad ARPU (Subscription):** ~7,68 Kč.
- **Odhad ARPU (Extras - Tokeny):** ~21,0 Kč (při 10% penetraci nákupů).
- **Model:** Konzervativní náběh. Prvních 6 měsíců je o plnění trhu, monetizace nabíhá až se saturací obsahu.
