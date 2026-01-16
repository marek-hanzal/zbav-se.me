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

<a id="feed-vs-seznam"></a>
### Feed vs. Seznam

Tady je to jednoduchý a držím to tak schválně, aby se mi nerozjel produkt do chaosu.

- **Feed** = *konfigurační dotaz*  
  Feed je uložený nastavení, **jaký inzeráty konkrétně chci vidět**. Zjednodušeně: uložený hledání / hlídací pes.  
  Feed sám o sobě nic nezobrazuje, je to jen konfigurace: filtry, radius, lokace, citlivost, řazení, případně další parametry.

- **Seznam (inzerátů)** = *výsledek feedu*  
  Seznam inzerátů je vždycky **výstup**, který vznikne tím, že vezmu feed a “jebnu ho na vstup” engine, co vrací inzeráty.  
  Je úplně jedno, odkud feed vznikl:
  - vytvořil ho uživatel (uložený feed),
  - vytvořil ho systém (nějaký default),
  - vznikl z hledání (search feed).
  Pořád platí: **feed = konfigurace**, **seznam = výsledky**.

> Feed je otázka. Seznam je odpověď.

A jedna důležitá věc: **každej feed i každej seznam vždycky respektuje systémový pravidla**.  
To znamená, že i kdyby si někdo naklikal cokoliv, pořád platí:
- **citlivost obsahu** (hard gate),
- **ignorování** (defaultně skryté, pokud výslovně nezapnu `withIgnored`),
- a další globální pravidla viditelnosti, která definuju jinde.

Feed je jen konfigurace. Systémový pravidla jsou nad tím.

<a id="typy-feedu"></a>
### Typy feedu

Feed je uložený konfigurační dotaz a vždycky patří uživateli. Typ feedu jen určuje, jak se s ním pracuje v UI.

Máme dva typy:

- **`user`**  
  Uživatel si ho nakliká jako “uložený hledání / hlídací pes”.  
  - je vidět v seznamu feedů  
  - počítá se do limitu feedů  
  - uživatel ho spravuje (úpravy filtrů, řazení, přejmenování)

- **`search`**  
  To samý nastavení, jen v UI flow stránky **Hledat**.  
  - `search` je **singleton** (max 1 na účet)  
  - není v seznamu feedů a nepočítá se do limitu  
  - pamatuje si poslední kontext hledání (dotaz + filtry)  
  - když si ho uživatel uloží, vznikne nový feed typu `user`

V obou případech seznam inzerátů vždycky respektuje systémový gating (citlivost, ignor, atd.).

<a id="typy-obsahu"></a>
### Typy obsahu (Citlivost)

Obsah není jen “co prodávám”. Obsah je i to, *jestli to můžeš vůbec vidět*. Citlivost je hard gate: chrání veřejnej prostor před **citlivým obsahem**, který určitá skupina lidí buď **nechce**, nebo ho **ani nesmí** vidět.

Tohle je kritická část appky, protože tady se důvěra vědomě svěřuje uživateli. Zbavík není puritán ani cenzor. Platí jednoduchý rámec:

> **Na Zbavíku se dá prodávat všechno, co dovoluje zákon.**  
> A uživatel má povinnost ten zákon respektovat. Tečka.

Úrovně citlivosti (stupňovaně):

- **Běžný (`common`)** *(default)*  
  Všechno normální, co nikoho rozumnýho nepřekvapí.  
  Příklady: elektronika, nábytek, oblečení, knihy, dětský věci, sport, nářadí, domácnost.
- **Pro dospělé (`adult`)**  
  Věci, který typicky patří jen pro 18+ nebo mají adult kontext.  
  Příklady: alkohol, vaping / e-cigarety a příslušenství, erotický věci v legálním rámci, “adult” doplňky, cokoliv, co nechceš míchat do veřejnýho feedu pro děti.
- **Citlivé (`sensitive`)**  
  Věci, který nejsou nutně nelegální, ale můžou být kontroverzní, nepříjemný nebo vyžadují víc rozumu.  
  Příklady: airsoft výbava, repliky, taktický gear, některý sběratelský věci, obsah na hraně “nechci to potkat ve veřejným feedu”.
- **Omezené (`restricted`)**  
  Věci, kde už zákon vyžaduje **konkrétní oprávnění** (typicky třeba zbrojní průkaz nebo jiný režim). Tohle už není “meh, tak to nějak dopadne”.  
  Appka to sice **neověřuje**, ale odpovědnost je čistě na prodejci. Jestli si někdo chce zahrávat s tím, že se potká s PČR, tak je to jeho volba, ne moje.

Gating (dvoufázově, schválně):
- Na profilu si nastavíš **maximum**, kam jsi ochotnej jít (např. „Všechno včetně omezeného“). To je jen “strop”, nic víc.
- Aby se ti takovej obsah reálně zobrazoval, musíš si ho ještě **vědomě zapnout ve feedu** (filtr *Citlivost*).  
  Jinak řečeno: profil = co **smíš**, feed = co **chceš**.

Pravidla viditelnosti:
- Defaultně každý vidí jen **Běžný**.
- Feed/seznam vždycky respektuje maximum z profilu **a zároveň** konkrétní filtr citlivosti ve feedu.
- **Detail přes přímý odkaz**: pokud citlivost přesahuje maximum uživatele, vracím **404** (žádný obcházení přes link, žádný “aspoň víš že to existuje”).

Citlivost je zároveň odpovědnost prodejce. Systém nastaví brány, ale označení je primárně sebeoznačení. Kdo to opakovaně zneužívá (maskuje citlivý jako běžný), porušuje pravidla a je to důvod k zásahu.

<a id="stavy-inzeratu"></a>
### Stavy inzerátu

U nás je “stav” hlavně o tom, jestli je inzerát **živý**, nebo jestli už je **mimo hru** (expirovaný / zavřený / prodaný). Žádnej cirkus.

Enum stavů:
- **`live`**
- **`expired`**
- **`closed`**
- **`sold`**

Co znamenají v praxi:

- **Draft** *(není stav inzerátu, je to separátní entita)*  
  Nejdřív existuje Draft (autosave, bezpečný návrat). Teprve publikací vznikne inzerát se stavem `live`.
- **`live`**  
  Publikovaný inzerát, který je aktivní a může se zobrazovat ve feedech (samozřejmě přes všechny gating pravidla). `live` znamená: *dá se koupit*.
- **`expired`**  
  Inzerát po expiraci (automatické ukončení).  
  - Přes **přímý odkaz** je vždycky dostupný (read-only).  
  - Ve feedu se objeví jen když si to uživatel **vědomě zapne** (explicitní filtr).  
  - Interakce jsou zakázané, výjimka je **flagování**.
- **`closed`**  
  Inzerát byl ukončen **ručně** prodejcem.  
  Chová se stejně jako `expired`:  
  - defaultně **neleze do feedu** (objeví se jen když si to uživatel **vědomě zapne** přes filtr),  
  - přes **přímý odkaz** je dostupný (read-only),  
  - interakce jsou zakázané, výjimka je **flagování**.
- **`sold`**  
  Inzerát už není k dispozici pro nový obchod (prodáno).  
  - Detail se otevře normálně, ale místo “Mám zájem” je tam jasný status typu **„Inzerát už není dostupný“**.  
  - `sold` inzerát se nepočítá jako aktivní (neleze do limitu aktivních inzerátů).

Poznámky:
- **`deleted` neexistuje.** Inzeráty se nemažou, jen mění stav mezi `live` / `expired` / `closed` / `sold`.
- **Kontinuální nabídka** je mechanika, která umí `expired` vrátit zpět do `live` bez potřeby dalších stavů.

<a id="aktivita"></a>
### Aktivita uživatele

“Aktivita” u mě není vibe ani pocit. Je to **konkrétní záznam v User Event Logu**. Cokoliv, co v appce uděláš (nebo co se ti stane), *může být* event.

Co to znamená:
- **Event = jeden atom reality**: “otevřel detail”, “přidal zájem”, “poslal zprávu”, “zapnul filtr”, “dokončil obchod”.
- Systém tyhle eventy **může sbírat** podle toho, co zrovna potřebuju pro produkt a metriky trhu. Ne všechno musí existovat hned a ne všechno má smysl logovat navždy.

K čemu to slouží:
- **Metriky trhu** (nabídka/poptávka, co funguje, co ne, proč se věci hejbou).
- **Férový mechaniky** (odměny, návraty, jemná motivace, ale bez cirkusu).
- **Debug reality** (když něco nefunguje, nechci hádat. Chci vidět fakt).

Co to není:
- Není to “sledování pro reklamu”. Neřeším ad profily, neprodávám to ven.
- Není to omluva pro sběr všeho navždy. Eventy mají smysl jen pokud z nich má uživatel **viditelnou hodnotu** a systém z nich nedělá creepy šmírování.

---

<a id="ui"></a>
## UI

Tady řeším *jak to působí a jak se to používá*. Ne “jak to nakóduju”. UI je u Zbavíku half produktu: když to vypadá nejistě, uživatel je nejistej. Když to působí klidně, uživatel je v klidu. A přesně o to mi jde.

Základní pravidla UI (držím je i když mě to svádí “přidat ještě jednu věc”):

- **Mobile-first vždycky.** Desktop je v principu “nataženej mobil”, žádnej dashboard cirkus.
- **Nevysvětlovat.** Když to potřebuje nápovědu, je to špatně navržený.
- **Minimum psaní.** Klikací kroky a jasný stavy. Text jen když má fakt hodnotu.
- **Akce mají váhu.** Primární CTA je jasná, sekundární neruší, destruktivní je opatrná.
- **Klid > efekt.** Animace jen kritický minimum, reakce systému má být okamžitá.
- **Bottom nav je kotva.** Uživatel má mít pořád pocit, že “nemůže nic posrat”.

V dalších podsekcích je UI rozsekaný podle hlavních oblastí (landing, navigace, tvorba inzerátu, feedy, transakce, profil…). Tady je jen rámec, aby se mi to nerozjelo do nekompatibilních obrazovek, který si každá hraje na svůj vlastní produkt.

<a id="landing-ui"></a>
### Landing Page (Struktura)

Landing je vizitka mýho postoje k projektu. Není to manuál, není to marketingovej román. Je to pět pevných bloků a hotovo:

1. **Hero**  
   Claim: **„Nakupuješ nebo prodáváš?“**  
   Dvě rovnocenná CTA: **„Už se známe“** (Login) a **„Přidej se!“** (Register).  
   Žádný trick CTA, žádný “tady klikni protože já chci”. Dvě čistý volby.
2. **Autor**  
   Moje fotka, moje jméno, odkaz na můj GitHub a motto: **„Bez keců. Bez ojebů.“**  
   Tvář dává důvěru. Je jasný, kdo za tím stojí a kdo nese odpovědnost.
3. **Aktivita vývoje**  
   Živej GitHub-like kalendář (heatmap), který ukazuje, že na projektu fakt makám.  
   Ne sliby. Důkaz práce.
4. **Live Pulse**  
   Seznam posledních událostí v appce (registrace, nový inzeráty, transakce).  
   Ať je vidět, že to žije. Žádná nafouknutá čísla, jen jednoduchá realita.
5. **Transparentní účet**  
   Odkaz na bankovnictví. Finance netajím.  
   Když někdo hledá “shady shit”, tak přesně tady by to bylo vidět.

Landing drží minimalistickej tón. Bez popupů, bez urgencí, bez vysvětlování. Kdo se chytí, jde dál. Kdo ne, tak cajk.


<a id="navigace"></a>
### Navigace a Dashboard

Navigace je schválně “nudná” a stabilní. Uživatel se nemá proklikávat labyrintem, má mít jistotu, že **vždycky ví, kde je** a **vždycky má únik**.

#### Bottom nav (5 ikon, pořád stejné)

Bottom nav je hlavní kotva UI. Je to těch 5 věcí, co dávají smysl pořád a všude:

1. **Home** → **Centrální Dashboard** (pro oba módy)
2. **Chci prodávat** → seller home / prodejní sekce
3. **Chci nakupovat** → buyer home / nákupní sekce
4. **Bonusy** → obchod / ekonomika / “přikoupit věci navíc”
5. **Můj účet** → profil, nastavení, bezpečnostní a systémový volby

Role nejsou “role” ve smyslu přepínače identity. Je to jen rychlej vstup do dvou nejčastějších mindsetů: *teď prodávám* vs *teď nakupuju*.

<a id="centralni-dashboard"></a>
#### Centrální Dashboard (Home)

Dashboard je společnej entrypoint pro oba mindsety. Není to feed. Je to **rychlá nástěnka**, co ti ukáže “co je novýho” a nabídne přímý skoky na základní akce.

Co sem patří (v jednoduchý podobě, bez cirkusu):
- **Novinky / pulz**: co přibylo (nový inzeráty v okolí / v mých feedech, změny stavu, zajímavý dění).
- **Notifikace**: co čeká na reakci (unread “Zprávy”, změny v transakci, systémové události).
- **Rychlý skoky**: nejčastější akce typu:
  - *Inzeráty* (do seznamu inzerátů)
  - *Nový inzerát* (rovnou do editoru / draftu)

Dashboard má být krátkej, jasnej, bez potřeby scrollovat jak blázen. Je to launcher, ne další sekce, co soupeří se zbytkem.

<a id="seller-home"></a>
#### Chci prodávat (Seller home)

Tohle je domov pro “prodávám”. Velký karty, jasný volby, žádný menu v menu.

- **Nový inzerát / Pokračovat** *(dynamická primární karta)*  
  Defaultně je to **„Nový inzerát“**.  
  Jakmile ale existuje rozpracovaný draft (tj. v editoru jsem ještě neodpálil **„Publikovat inzerát“**), karta se přepne na **„Pokračovat“**.  
  Draft je kontrakt: *můžeš kdykoliv odejít a nic neztratíš*.
- **Zprávy**  
  Lidský název pro transakce. V praxi: moje rozjednané prodeje, stavy, timeline, domluva.
- **Šablony**  
  Seznam draftů (rozpracovaných / připravených). Název je “Šablony”, protože pro uživatele je to mentálně “mám to připravený, jen to vytáhnu”.
- **Moje inzeráty**  
  Přehled publikovaných inzerátů (a jejich stavů `live` / `expired` / `sold`).

<a id="buyer-home"></a>
#### Chci nakupovat (Buyer home)

Domov pro “nakupuju”. Zase velký karty, žádný menu v menu:

- **Inzeráty**  
  Vstup do seznamu inzerátů (výsledku feedu). Typicky návrat do toho, kde jsem naposledy byl.
- **Zprávy**  
  Transakce, ale přeložený do řeči lidí. (Nechci učit uživatele nový slovník, když to není nutný.)
- **Moje seznamy**  
  Moje uložený feedy (uložený hledání / hlídací psi). Tady spravuju “co chci vidět”.
- **Oblíbené**  
  Seznam inzerátů, který jsem si cestou sám naklikal.

Poznámka: všechny vstupy do inzerátů (ať už přes dashboard, “Inzeráty”, nebo “Moje seznamy”) vždycky respektují systémový gating (citlivost, ignor, atd.). Žádný zkratky okolo pravidel.

<a id="tvorba-inzeratu"></a>
### Tvorba inzerátu (Editor)

Editor inzerátu je **jedna souvislá činnost**. Žádnej wizard, žádný kroky 3/9 a žádný ztrácení kontextu. Uživatel scrolluje jedním směrem a řeší jen to, co chce řešit. Všechno ostatní je šum.

#### Jak editor funguje

- **Sekce jsou klikací karty**  
  Každá karta je stavovej řádek: *vyplněno / čeká / není nastaveno* + ikona editace. Kliknu a upravím jen konkrétní položku. Neprocházím formulář “od začátku do konce”.
- **Vyplněná věc se vizuálně uklidní**  
  Nevyplněné položky mají “attention” styl. Jakmile je vyplníš, odbarví se do neutrálu.  
  Díky tomu jde okamžitě poznat, co chybí a co je hotový, bez cedulek typu “POVINNÉ!!!”.
- **Položky jsou rozdělené do tří bloků**  
  1) **Nutné pro zveřejnění**  
  2) **Podle kategorie** (dynamické položky dle zvolený kategorie)  
  3) **Další volby** (dobrovolné)  
  Mezi bloky je mentální střih: *„OK, povinný mám hotový.“* a pak už jen zpřesňuju.

#### 1) Nutné pro zveřejnění (Povinné)

Tohle je pevně daný seznam. Bez toho nejde kliknout **„Zveřejnit inzerát“**:

- **Galerie inzerátu**
- **Titulek inzerátu**
- **Kategorie**
- **Umístění**
- **Cena**
- **Typ ceny**
- **Automatické ukončení**  
  (čas začne běžet až po zveřejnění; není to stres, je to kontrola)

U “Umístění” je záměrně tvrdý upozornění. Poloha je veřejná informace a může vést k fyzický návštěvě. Varování patří přesně sem: v momentě, kdy to člověk zadává.

#### 2) Podle kategorie (Parametry inzerátu)

Po výběru kategorie se zobrazí další položky, který dávají smysl jen pro konkrétní typ věci. Nejsou to “popisky”, jsou to strukturovaný parametry, který se ukládají do parametrů inzerátu (např. JSONB).

- V UI se chovají stejně jako ostatní karty (klik & edit).
- Kategorie může mít vlastní sadu položek, které jsou pro daný typ relevantní.
- Některé kategorie můžou mít i položky, které jsou “povinné v rámci kategorie” (ale pořád je to samostatnej blok, ať je jasný, proč se to najednou objevilo).

#### 3) Další volby (Dobrovolné)

Tady už uživatel inzerát nezachraňuje, tady ho vylepšuje. Nic z toho nesmí brzdit publikaci.

Typicky sem patří:
- **Popis** (Markdown, čistě informativní vrstva)
- **Co chci vyzdvihnout** / **Chci být upřímný** (kulturní signál; limity 5/5)
- **Možnosti předání** (preference, ne závazek)
- **Záruka** (enum: bez / vlastní / zákonná)
- **Stav** a **Stáří** (škály A–F jako abstraktní signál)

#### Publikace a bezpečný únik

Dole je blok **„Co dál?“**:

- **Zveřejnit inzerát**  
  Je disabled, dokud nejsou hotový povinný položky. Žádný překvapení na konci.
- **Odložit na později**  
  Normální volba. Draft je plnohodnotnej stav a návrat do něj je vždycky bezpečnej.
- **Smazat**  
  Destruktivní akce je opatrná (žádnej modalovej teatr, ale jasnej “jsem si jistej” moment).

#### Limit aktivních inzerátů (a co se stane na stropu)

Když narazíš na limit aktivních inzerátů, editor tě nenechá dělat zbytečnou práci:

- Inzerát můžeš pořád **normálně připravit jako draft**.
- Systém jasně řekne, že **další zveřejnění teď nejde**.
- Nabídne možnost použít **Kupón**, aby sis zveřejnění odemknul a nemusel čekat.

Pointa: žádná práce nazmar, žádný “zaplať až na konci”.

<a id="galerie-inzeratu"></a>
### Galerie inzerátu (Fotky)

Fotky jsou primární obsah. Všechno ostatní je jen doprovodnej text. Galerie je proto povinná a v editoru je vždycky první, protože bez fotek je inzerát jen spekulace.

Principy galerie:

- **Kvalita přes kvantitu**  
  Nechci z toho udělat instagram. Pár dobrých fotek je víc než dvacet rozmazanejch.
- **Pořadí je význam**  
  První fotka je “cover” a určuje, jak se inzerát chytí v seznamu. Uživatel musí mít jednoduchou kontrolu nad tím, co je první.
- **Bez videa**  
  Video do inzerátů cíleně nepouštím. Je to drahý, často zneužitelný, a většině lidí by to jen zhoršilo feed. Fotky stačí.
- **Galerie je součást důvěry**  
  Fotky nastavují očekávání. Čím líp a upřímněji věc ukážeš, tím míň je potom potřeba “domlouvat” a hádat se.

Galerie není dekorace. Je to základní nosič pravdy o věci.

<a id="titulek"></a>
### Titulek inzerátu

Titulek je krátkej a jasnej popis toho, co prodáváš. Ne popis příběhu, ne marketing, ne poezie. Cíl titulku je, aby člověk ve feedu okamžitě pochopil, jestli ho to zajímá.

Pravidla:
- **Jedna věc = jeden titulek.** Ne “balík všeho možnýho”, pokud to není záměr.
- **Žádný keyword spam.** Nepotřebuju SEO cirkus, tohle není e-shop.
- **Upřímnost > hype.** “iPhone 13, prasklý sklo” je lepší než “TOP STAV!!!”.
- Když to jde, **dej do titulku nejdůležitější specifikum** (model, velikost, varianta), ne až do popisu.

A ještě technická pravda, kterou držím schválně:
- **Titulek je jediný text, podle kterého se dá hledat.**  
  Používá se pro **vektorové vyhledávání** v rámci feedu.  
  Markdown popis je čistě informativní vrstva pro detail a do vyhledávání záměrně nespadá.

Titulek je první filtr. Když je dobrej, šetří čas všem.

<a id="kategorie"></a>
### Kategorie

Kategorie je struktura. Bez ní je to jen chaos s fotkama. Kategorie zároveň určuje, jaký další parametry má smysl po uživateli chtít a jak se inzerát bude dát filtrovat.

Co platí:

- **Kategorie je povinná.**  
  Bez kategorie nejde inzerát publikovat.
- **Kategorie řídí “podle kategorie” sekci v editoru.**  
  Jakmile ji vybereš, editor může doplnit relevantní položky a parametry, který dávají smysl právě pro tenhle typ věci.
- **Kategorie není hra na perfektní taxonomii.**  
  Nechci stovky mikro-kategorií, kde se nikdo netrefí. Radši míň kategorií a snadný použití.
- **Kategorie je filtr, ne stigma.**  
  Kategorie slouží k tomu, aby lidi rychle našli to, co chtějí. Ne k tomu, aby se tu někdo cítil jako na úřadě.

Když si nejseš jistej, vyber tu nejbližší. Zbytek doladí titulek a parametry.

<a id="umisteni"></a>
### Umístění

Umístění je core. Ne “nice-to-have”. Každej inzerát má polohu, protože poloha dává kontext, umožní řazení podle vzdálenosti a hlavně šetří čas (víš hned, jestli to má smysl řešit).

Co z toho plyne:

- **Umístění je povinné.**  
  Každej inzerát má polohu. Díky tomu jde řadit i filtrovat podle vzdálenosti.
- **Poloha je veřejná informace.**  
  V editoru je u umístění záměrně tvrdý upozornění, protože zadáním lokace dáváš ven informaci, která může vést k fyzický návštěvě.  
  Varování patří přesně sem: v momentě zadávání, ne někde později v FAQ.
- **Míň přesnosti může být víc bezpečnosti.**  
  Když nechceš ukazovat přesnej bod, nedávej přesnej bod. Je to tvoje odpovědnost a tvoje hranice.
- **Umístění neurčuje způsob předání.**  
  Zbavík počítá jak s osobním předáním, tak s posláním. Umístění je kontext “kde to je”, ne logistickej závazek.

Umístění není detail. Je to základní signál, který drží celý vyhledávání a rozhodování pohromadě.

<a id="cena"></a>
### Cena a typ ceny

Cena je povinná, protože bez ceny je to jen “piš mi do zpráv” a to je přesně ten chaos, který nechci podporovat. Cena má být jasná ještě dřív, než si někdo otevře chat.

Položky:

- **Cena**  
  Konkrétní částka.
- **Typ ceny**  
  Říká, jestli je cena “konečná”, nebo jestli je prostor pro domluvu.
  - **`closed`**  
    Pevná cena. Prodejce říká: *nesmlouvám*.
  - **`open`**  
    Cena je daná jako výchozí, ale **vyjednávání je možný**.  
    *„Tohle je moje představa, ale můžeme se domluvit.“*

Důležitý: i u `open` je cena pořád povinná. Nechci “dohodou” jako únik z reality, chci číslo a k tomu jasnej postoj.

<a id="automaticke-ukonceni"></a>
### Automatické ukončení

Automatické ukončení je povinná volba, protože drží pořádek v nabídce a brání tomu, aby se z feedu stal hřbitov mrtvol. Nechci ruční úklid a nechci, aby se obsah válel navěky jen proto, že někdo zapomněl.

Jak to funguje:
- Prodejce při tvorbě nastaví, **kdy se má inzerát automaticky ukončit**.
- Čas se začne počítat **až po zveřejnění**, ne v draftu.
- Po uplynutí doby se inzerát přepne do stavu **`expired`**.

Předdefinované volby (rychlý a blbuvzdorný):
- **Za týden**
- **Za dva týdny**
- **Za měsíc**

UI u každé volby zároveň ukazuje i konkrétní datum, ať je to “za týden” pro lidi, ne pro matematiku.

Důsledek:
- `expired` inzerát zůstává dostupný přes přímý odkaz (read-only),
- ve feedech se ukáže jen když si to uživatel vědomě zapne (explicitní filtr),
- interakce jsou defaultně vypnuté, výjimka je **flagování**.

Automatické ukončení se doplňuje s mechanikou **Kontinuální prodej**, která slouží jako nástroj pro řízené prodlužování života inzerátu (místo toho, aby tu věci hnily navěky).

<a id="automaticke-ukonceni"></a>
### Automatické ukončení

Automatické ukončení je povinná volba, protože drží pořádek v nabídce a brání tomu, aby se z feedu stal hřbitov mrtvol. Nechci ruční úklid a nechci, aby se obsah válel navěky jen proto, že někdo zapomněl.

Jak to funguje:
- Prodejce při tvorbě nastaví, **kdy se má inzerát automaticky ukončit**.
- Čas se začne počítat **až po zveřejnění**, ne v draftu.
- Po uplynutí doby se inzerát přepne do stavu **`expired`**.

Předdefinované volby (rychlý a blbuvzdorný):
- **Za týden**  
  Vím, že se to prodá snadno, nebo chci jen na chvíli něco vyplivnout ven a otestovat zájem.

- **Za dva týdny**  
  Chci tomu dát trochu času, protože tuším, že to nepůjde hned.

- **Za měsíc** *(zpoplatněná volba)*  
  Vím, že to bude trvat. Tahle volba je záměrně placená, protože jinak kanibalizuje **Kontinuální prodej**.  
  Zpřístupní se přes Kupón (např. **„Prodloužený inzerát“**) nebo v rámci předplatného.

UI u každé volby zároveň ukazuje i konkrétní datum, ať je to “za týden” pro lidi, ne pro matematiku.

Důsledek:
- `expired` inzerát zůstává dostupný přes přímý odkaz (read-only),
- ve feedech se ukáže jen když si to uživatel vědomě zapne (explicitní filtr),
- interakce jsou defaultně vypnuté, výjimka je **flagování**.

Automatické ukončení se doplňuje s mechanikou **Kontinuální prodej**, která slouží jako nástroj pro řízené prodlužování života inzerátu (místo toho, aby tu věci hnily navěky).

<a id="popis"></a>
### Popis (Markdown)

Popis je dobrovolnej. A je to záměr. Nechci, aby lidi psali slohovky jen proto, že “se to sluší”. Většinu práce má odvést galerie, titulek, cena a pár strukturovanejch signálů.

Co je důležitý:

- **Markdown je povolenej**, protože je to nejjednodušší způsob, jak napsat něco čitelně (odrážky, nadpisy, linky).
- **Popis se nepoužívá pro vyhledávání.**  
  Je to čistě informativní vrstva pro detail. Hledání stojí na titulku a strukturovanejch filtrech.
- **Méně je často víc.**  
  Krátký a konkrétní body jsou lepší než dlouhej příběh.

Popis je prostor pro “co se nevešlo do struktury”. Ne povinnost.

<a id="co-chci-vyzdvihnout"></a>
### Co chci vyzdvihnout / Chci být upřímný

Tohle není “feature pro coverage”. Tohle je kulturní signál.

Na většině marketplace se lidi učí jedno: nalešti to, zamlč to, hlavně ať to projde. Já chci opak: aby bylo normální napsat i věc, která se ti úplně nehodí do krámu. Ne protože jsem nějakej svatej, ale protože to dlouhodobě zvedá důvěru celýho prostoru a snižuje množství toxických dohadů.

Proto existují dvě jednoduchý sekce:
- **Co chci vyzdvihnout** (pozitiva)
- **Chci být upřímný** (negativa / limity / vady)

Pravidla:
- Obojí je **dobrovolný**. Neexistuje povinnost “se kát”.
- Každá strana má limit **max 5 položek**.  
  Je to mentální mantinel proti balastu a zároveň tlak na podstatný věci.
- Texty jsou krátký, konkrétní, lidský. Žádný “pros/cons”, žádnej korporátní slovník.

Důležitý je, *že ta možnost vůbec existuje*.  
Platforma tím nastavuje normu: “upřímnost je v pořádku”. Nic se za to neměří, nikdo za to nedostává odměny ani tresty. Je to jen prostor, kde se dá jednou větou přiznat realita. A kdo toho není schopnej ani v nejmenším, ten si to o sobě řeší sám.

<a id="ux-stavy-vyplneni"></a>
### Stav vyplnění jako vizuální signál (a mentální střih)

V appce neukazuju “povinný” jako cedulku, kterou ti cpu do ksichtu pořád. Povinnost se pozná **chováním a stavem**.

Princip:

- **Nevyplněná povinná položka je zvýrazněná** (má “attention” styl).  
  Ne proto, abych tě peskoval, ale aby na první pohled bylo jasný: *tady ještě něco chybí*.

- Jakmile položku vyplníš, **odbarví se do neutrálu**.  
  Tím pádem není potřeba donekonečna opakovat “povinné”. Vyplněné věci přestanou řvát a UI se uklidní.

- Položky jsou rozdělené do dvou bloků:  
  1) **Nutné pro X** (typicky zveřejnění)  
  2) **Další volby** (dobrovolné)  
  Mezi nimi je vědomý mentální střih: **„OK, povinný mám hotový.“**  
  Zbytek už je vylepšování, ne překážková dráha.

Tohle je obecnej UX pattern napříč appkou, nejen u tvorby inzerátu:
- stav se pozná okamžitě “z dálky”
- UI se s postupem práce uklidňuje
- uživatel má průběžně pocit kontroly a dokončování, ne tlak a formulářovej stres

<a id="zpusob-predani"></a>
### Způsob předání (Delivery)

Způsob předání je dobrovolnej signál. Ne závazek a ne “logistika modul”. Smysl je jednoduchý: kupující hned ví, jak si to prodejce zhruba představuje, a podle toho se může rozhodnout bez zbytečnýho dopisování.

Co platí:
- Prodejce uvede preferovaný možnosti (např. **osobně**, **kurýr**, **poštou**).
- Není to smlouva. Je to preference, kterou si lidi případně doladí v domluvě.
- Ve feedu to **slouží jako filtr**. Přesně tahle položka umožňuje mít vedle sebe:
  - “sousedský” prodej (dojedu si pro to / osobně),
  - i klasickej balíčkovej prodej.

Způsob předání je další kus kontextu, kterej šetří čas a snižuje počet debilních dotazů typu “a poslal bys to?”.

<a id="zaruka"></a>
### Záruka

Záruka je dobrovolnej signál, kterej řeší jednu klasickou otázku: **„Je to v záruce?“**  
Platforma do toho **nijak nevstupuje**. Neověřuju to, negarantuju to, nesoudím to. Je to čistě mezi lidma. Já jen dávám možnost to říct jednoduše a strukturovaně.

Enum hodnot:
- **`no-warranty`**  
  Bez záruky.

- **`custom`**  
  Vlastní záruka mimo zákon. Prodejce něco slíbí nad rámec běžný reality a je to čistě jeho odpovědnost.

- **`warranty`**  
  Zákonná záruka / prokazatelnej nákup (typicky účtenka).

Cíl je jednoduchý: méně dopisování, méně dohadů, rychlejší rozhodování.

<a id="stav-a-stari"></a>
### Stav a stáří (škály A–F)

Konkrétní roky a detailní popisy jsou často k ničemu. Lidi stejně můžou kecat a ještě k tomu to vytváří zbytečnou mentální zátěž: vyhodnocovat “2024” u telefonu není pro mozek rychlej signál, je to mikrovýpočet. A tenhle mikrovýpočet děláš ve feedu pořád dokola.

Proto používám škály A–F. Je to jednoduchý, rychlý, a hlavně konzistentní napříč kategoriema.

- **Stav (A–F)**  
  Jak na tom věc reálně je: od “skoro nový” po “na díly”.

- **Stáří (A–F)**  
  Jak dlouho to existuje / jak dlouho se to používá, bez potřeby řešit přesný datumy.

Business důvody:
- **Míň lhaní nečekám, ale míň stresu jo.** Škála je čitelnější než “rok výroby” nebo “koupeno 2024”.
- **Filtrace je brutálně jednodušší.** Nemusím řešit range, hranice, “od–do” a interpretace. Prostě filtr na stupně.
- **Přesný hledání patří jinam.** Když někdo chce ultra přesnost, dá se to řešit jinýma nástrojema a signálama (titulek, kategorie parametry, specifický filtry), ne jedním polem “rok”.

Bonus: tyhle škály nejsou jen pro elektroniku. Počítají i s “živějšíma” kategoriema, kde roky nedávají moc smysl:

- **Zvířata:** stáří `A` může být klidně *kotě / štěně / mladej papoušek*.
- **Stav u zvířete:** `A` může znamenat *zcela zdravý*, zatímco `F` je prostě signál *„problém / je na veterinu“*.

Škály jsou dobrovolný, ale když je vyplníš, zvedneš čitelnost trhu bez slohovek a bez matematickýho utrpení.

<a id="moje-seznamy"></a>
### Moje seznamy (Feedy)

**Moje seznamy** jsou místo, kde si uživatel spravuje svoje **uložený feedy**.  
V praxi: *„co chci vidět“* a *„v jakým kontextu se zrovna pohybuju“* (např. **Vaping** vs. **Bazar aut**, **domov** vs. **chalupa**).

> Feed je konfigurace. Seznam inzerátů je výsledek.  
> (Viz. *Feed vs. Seznam*.)

#### Co se tady zobrazuje
- V seznamu ukazuju **jen feedy typu `user`** (vědomě uložený feedy).
- **`search`** sem netahám: je to systémovej kontext stránky **Hledat**, ne „můj seznam“.
- Každej účet má vždycky aspoň **1 výchozí feed** (bez filtrů), aby existovala bezpečná návratová volba typu *„ukaž mi prostě všechno“*.

#### Proč to existuje
Uživatel nemá jeden univerzální feed na celý život. Má víc realit.  
Proto si může držet víc seznamů, a každej má vlastní nastavení:

- filtry (kategorie, parametry, cenový rozsahy…)
- radius + lokaci (a tím pádem i řazení podle vzdálenosti)
- řazení (podle toho, co v tom kontextu dává smysl)

#### Hlavní akce
- **Nový seznam** = založí nový feed typu `user` (tj. nový „hlídací filtr“).
- Každej seznam jde:
  - **přejmenovat** (protože „Seznam 3“ je mentální špína)
  - **upravit** (filtry / lokaci / radius / řazení)
  - **smazat** (když už je mrtvej)

#### Pravidla, co se nepřeskočí
Ať je seznam jakkoliv chytrej, pořád platí systémový brány:

- citlivost obsahu (hard gate),
- ignor (defaultně skrytý, pokud výslovně nezapnu výjimku),
- a další globální pravidla viditelnosti.

Žádný zkratky okolo pravidel. Seznam jen říká *„co chci“*, systém pořád drží *„co smíš / nechceš vidět“*.

<a id="rozsireni-ui"></a>
### Rozšíření a Aktivace

Rozšíření jsou **centrální ovládací pult** pro věci, co se dají *zapnout* (a pak nějakou dobu platí).  
Ne „nastavení“. Ne „shop“. Spíš panel typu: *„co mám aktivní, co můžu zapnout, co mi končí, a čím to zaplatím“*.

Tahle sekce existuje kvůli jedný věci:  
uživatel má mít **jedno místo**, kde se vyzná v tom, co má odemčený, a **nemusí to lovit po celým UI**.

#### Co tu uživatel vidí
- Přehled dostupných rozšíření (typu „věc navíc“).
- U každého rozšíření:
  - jestli je **aktivní** (a dokdy),
  - jestli je **neaktivní**,
  - a co stojí jeho aktivace.

Součástí je i “inventář” kontextu:
- kolik mám **Tokenů**,
- kolik mám **Kupónů** (pokud existují),
- jaké mám **Passy** a kdy končí.

#### Aktivace Passů
Rozšíření se v praxi zapínají tak, že vznikne **Pass**.  
Aktivace je vždycky okamžitá konverze:

**Kupón / Tokeny → Pass (aktivní stav)**

Bez čekání, bez „schvalování“, bez hovadin. Klikneš a hotovo.

#### Chytré tlačítko pro aktivaci
CTA se chová tak, aby uživatel nemusel přepočítávat život:

- Pokud má uživatel použitelný **Kupón** pro daný rozšíření:  
  `Aktivovat (1× Kupón)`  
  a aktivace **spálí kupón**.

- Pokud kupón nemá:  
  `Aktivovat (XX Tokenů)`  
  a aktivace **strhne tokeny**.

Tohle pravidlo je jednoduchý a stabilní: **nejdřív spotřebuj free věci, až potom měnu**.

#### Prodloužení
Když má Pass expiraci, „prodloužení“ je prostě další aktivace:
- buď kupón,
- nebo tokeny,
- a Pass se obnoví / prodlouží.

Žádná zvláštní magie. Stejný kontrakt, stejný mentální model.

#### Ostatní kupóny
Pod rozšířeníma (passama) je samostatná sekce pro kupóny, který **nejsou přímo „zapni pass“**.  
Tzn. pokud existují kupóny typu „něco jednorázově“ nebo „nějaký bonus“, ukazuju je zvlášť, ať se to nemíchá do aktivací.

#### Důležitý pravidlo: rozšíření nic neobchází
Rozšíření jsou jen *nadstavby*. Nezadní vrátka.

Cokoliv systémově platí pro viditelnost / gating / bezpečnost, platí pořád:
- citlivost obsahu,
- ignor,
- a další globální pravidla.

Rozšíření může dát pohodlí nebo schopnost. **Nikdy nesmí obejít hranice systému.**

<a id="zpravy-ui"></a>
### Zprávy (Transakce)

Zprávy nejsou “chat”. Zprávy jsou **UI pro obchod**.  
Každý vlákno = jedna konkrétní transakce, navázaná na jeden konkrétní inzerát. Žádný volný DM “jen tak”. Kontext je vždycky jasnej.

Co je tady cílem:
- **držet fakta pohromadě** (kdo má zájem, kdo přijal, co bylo domluveno),
- **minimalizovat psaní** (klikací kroky mají přednost),
- **zastavit spam a nekonečný doťukávání** (“zavřeno je zavřeno”).

#### Jak to UI chápu
V detailu transakce je to **časová osa událostí**:
- systémové stavy (zájem, přijetí/odmítnutí, ukončení, prodáno),
- textový zprávy (pokud si chtějí lidi psát),
- a **strukturovaný widgety** (protože některý věci jsou zbytečný řešit textem).

To znamená: i když si lidi píšou normálně, systém pořád drží “pravdu” vedle toho.

#### Anti-spam (pending)
Když kupující klikne „Mám zájem“, vzniká transakce a jde do stavu `pending`.

- Kupující v `pending` **nemůže psát zprávy**.
- Prodávající v `pending` vidí jednoduchou volbu:
  - **Přijmout** → `open`
  - **Odmítnout** → `rejected`  
  Bez vysvětlování, bez povinnýho důvodu, bez mentálního dluhu.

Tady se láme chleba: odpovědnost prodávajícího začíná až přijetím.

#### Otevřená transakce (open)
Ve stavu `open` se odemkne:
- posílání zpráv,
- a posílání strukturovaných věcí (widgety).

Widgety jsou záměrně “faktický balíčky”, ne dekorace:
- Lokace (místo předání),
- informace k předání (čas / domluva),
- tracking / balíček (pokud to vůbec dává smysl),
- systémové kroky a potvrzení.

#### Uzavření a finální stavy
Transakce má konec. A ten konec je definitivní.

- `closed`, `sold`, `expired` = **read-only**.
- V uzavřený transakci už nejde pokračovat, nejde “re-open”, nejde “ještě jen poslední zpráva”.

Když se lidi chtějí bavit znova, dělají to **novou transakcí**. Čistej start, čistej kontext.  
Tohle je přesně ten bod “zavřeno je zavřeno”, kterej snižuje toxicitu a nekonečný otravování.

---

<a id="profil"></a>
### Profil / Nastavení

Profil není “sociální profil”. Je to **místo pro preference**: kdo jsem (minimálně) a co snesu / chci vidět.

#### Co tu řeším
- **Citlivost obsahu**  
  Uživatel si nastaví, jakou maximální úroveň obsahu chce vidět. Default je “běžný”.  
  Je to vědomý opt-in, žádný “blur a klikni sem”. Když si to nepovolí, citlivější věci se mu prostě neukážou.

- **Notifikace**  
  Defaultní stav aplikace je ticho. Všechno jde do Inboxu.  
  Tady si uživatel nastaví, jestli chce (a jak často) emailový přeposílání / digest.

- **Základní účetní věci**  
  Jádro účtu je email + preference. Žádný zbytečný “profilový údaje”, který nikomu k ničemu nejsou.

Profil má být klidnej a věcnej. Jedno místo, kde nastavím hranice a pak už mi to nepřekáží v používání appky.

---

<a id="zakladni-kameny"></a>
## Základní stavební kameny

> Definice entit a dat, na kterých stojí všechno ostatní. Žádná magie, jen jasný kontrakty.

Tahle sekce popisuje, **co v systému existuje**, jak to spolu souvisí a jaký jsou základní pravidla.  
Cíl není „databázová dokumentace“, ale produktová definice, která drží smysl i když se mění implementace.

---

<a id="uzivatel"></a>
### Uživatel

Core entita. Na uživatele je navázané prakticky všechno, ale **data o něm držím na minimu**.

- Ukládám jen **email**.
- Neřeším identity, občanky, jména ani “profilovky pro pocit”.
- Bezpečnost a důvěru řeším **chováním v systému**, ne lustrováním.

---

<a id="kategorie"></a>
### Kategorie

Kategorie je organizační vrstva trhu. „Kontext“, ve kterém dává smysl jiný jazyk a jiné filtry.

Kategorie nese jen:
- **název**
- **slug**
- **locale**

#### Category Spec (parametry)
Kategorie může dobrovolně definovat parametry, které dávají smysl právě v ní (auta: „rok“, byty: „plocha“, vaping: „typ baterky“…).

Specifikace je autorita pro:
- **UI tvorby inzerátu** (jaká pole zobrazím a jak),
- **UI filtrování feedu** (jaký filtry jsou relevantní).

Parametr má:
- identifikátor,
- typ (text / enum / number / bool / date …),
- režim filtru:
  - **nefilterovatelný** (jen informativní),
  - **equality** (shoda),
  - **range** (od–do).

**Range filtry jsou vždy explicitní rozhodnutí.** Nikdy se nestanou „samy od sebe“.

---

<a id="inzerat"></a>
### Inzerát

Inzerát je souhrn atributů a galerie fotek reprezentující nabízenou věc.  
Veškerá interakce mezi lidmi se nakonec váže právě na něj, i když technicky vzniká přes Draft.

#### Atributy
- **Obsah:** title, description, pros/cons
- **Galerie:** uploady + pořadí
- **Cena:** částka + měna + typ (pevná / otevřená)
- **Globální parametry:** condition (A–F), age (A–F), delivery, warranty
- **Kategorie-specifické parametry:** data dle Category Spec (typicky JSON objekt / JSONB)
- **Lokalita:** locationId + lat/lon (kvůli řazení podle vzdálenosti a radius filtrům)
- **Čas:** createdAt / updatedAt / expiresAt

#### Parametry: defaultně “JSON”, vytknutí je vědomý krok
Nové a specifické atributy přichází defaultně jako **kategorie-specifický parametry** (JSON).  
Pokud je něco dlouhodobě zásadní (výkon, filtr, UX), můžu to **vytknout** jako samostatný atribut (a udělat migraci).  
Není to automatika. Je to vědomý rozhodnutí autora.

---

### Měření (eventy a metriky)

Měření slouží k dvěma věcem:
1) dát prodávajícímu férový signál „děje se to / neděje se to“,  
2) umožnit pár mechanik (např. anti-topper/payback) bez šmírovacího cirkusu.

Měření je **objektově orientované**: sleduju **inzerát**, ne člověka.

#### Principy
- Eventy jsou **append-only** a používají se pro agregace.
- Neukládám IP, device fingerprinty ani marketingový identifikátory.
- Deduplikace je záměrně „měkká“ (typicky na klientovi v rámci jedné relace). Nehoním laboratorní přesnost, chci konzistentní signál.

#### Základní eventy
- `visible`
- `impression`
- `view`
- `anti-topper`

Další eventy (dle potřeby produktu) typicky existují jako doménový události nad inzerátem:
- favourite/unfavourite, ignore/unignore, flag/unflag, transaction, feedback …
Ne všechno musí být veřejná metrika. Důležitý je, že je to **surový log**, ne “skóre”.

#### Definice metrik a časovačů
Časovače jsou produktové rozhodnutí, ne implementační detail.

- **Visible (`visible`)**
  - karta v listingu ve viewportu alespoň **0,5 s**
  - cíl: „uživatel to reálně viděl“

- **Impression (`impression`)**
  - karta ve viewportu alespoň **1,6 s**
  - cíl: „zaujal, zpomalil“

- **View (`view`)**
  - detail otevřený alespoň **2,5 s**
  - cíl: „reálný zájem o detail“

- **Anti-topper (`anti-topper`)**
  - pokud má uživatel aktivní anti-topper a v listingu by se měl ukázat inzerát se zvýrazněním Mark/Top, systém místo `visible` vytvoří `anti-topper`
  - smysl: vědět, kolikrát bylo zvýraznění potlačeno (kvůli metrikám a případnému paybacku)
  - pro **Top Maxxi** se `anti-topper` negeneruje (imunní vůči potlačení)

#### Deduplikace a frekvence
Aby se z eventů nestal spam:
- `visible` / `impression` maximálně jednou na jedno zobrazení listu pro daný inzerát
- `view` maximálně jednou na jedno otevření detailu

---

<a id="draft"></a>
### Draft

Draft je vstupní bod tvorby. Inzerát nenechám vzniknout “kliknutím”, vzniká z Draftu.

- Je to kopie atributů inzerátu ve stavu zrodu.
- Podporuje postupnou tvorbu (autosave) bez rizika ztráty dat.
- Spravuju seznam Draftů (umožňuje i budoucí šablony/kopírování).

Draft není stav inzerátu. Je to separátní entita.

---

<a id="feed-entita"></a>
### Feed (Entita)

Feed je uložené nastavení filtru nad inzeráty. Není to “seznam”, je to **předpis**: „co chci vidět a odkud“.

- Filtry (kategorie, parametry, cena…)
- Radius a lokalita (včetně řazení podle vzdálenosti)
- Řazení (v rámci pravidel systému)

Feed si pamatuje vlastní lokalitu (např. „práce“ vs „chalupa“).  
Defaultně zakládám uživateli jeden obecný feed bez filtrů.

Vyhledávání systémově beru jako speciální instanci Feedu (UI zkratka), ne jako jiný datový svět.

---

<a id="transakce"></a>
### Transakce

Transakce je most mezi prodávajícím a kupujícím.  
V UI se prezentuje jako „Zprávy“, ale je to řízená interakce, ne volný DM.

- Každá transakce má vlastní vlákno (izolovaný kontext).
- Transakce nese stav (pending, open, sold…).
- Lifecycle (konec, uzavření, expirace) je definovaný v sekci **Mechaniky**.

---

<a id="zpravy-entita"></a>
### Zprávy

Zprávy jsou obsah transakce. Vedle textu podporuju i strukturovaný data, protože spoustu věcí je blbost řešit slohovkou.

Typy obsahu:
- text
- obrázky
- strukturovaná data (lokace, tracking, kontaktní údaje…)
- systémové zprávy (události generované systémem, např. „Prodáno“)

Strukturovaná data ukládám odděleně, aby šla snadno a cíleně mazat (GDPR / clean-up).

---

<a id="notifikace"></a>
### Notifikace (Inbox)

Inbox je jediný zdroj pravdy pro “co se stalo”.

- Všechny události padají do **Inboxu**.
- Email je jen volitelný „forwarder“ / digest podle nastavení uživatele.
- Defaultní filozofie: ticho a klid. Žádný bezdůvodný otravování.

---

<a id="lokace"></a>
### Lokace

Lokace je autorita na polohu.

- Neukládám random stringy.
- Odkazuju se na validní záznam ze služby vyhledávání adres (jako autority).
- Všechno, co využívá polohu (feed, inzerát, předání), se váže na lokaci.

---

<a id="upload"></a>
### Upload

Centrální správa souborů (hlavně fotek).

- Metadata k souborům uloženým na CDN/UGC
- Používá se v galerii inzerátu, ve zprávách, a případně i jinde (hero, cover, atd.)

---

<a id="hodnoceni"></a>
### Hodnocení (Ranking)

Pokud není řečeno jinak, používám školní stupnici **A–F** (A = nejlepší).  
Interně se mapuje na čísla **6 (A) až 1 (F)**.

---

<a id="mechaniky"></a>
## Mechaniky

> Mozek celé aplikace. Pravidla hry.  
> Tohle je ta část, která drží systém klidnej a předvídatelnej, i když lidi občas jednají jak… no, lidi.

### Citlivost obsahu

Citlivost je vědomá brzda proti tomu, aby se z feedu stal bordel, a zároveň nástroj pro lidi, kteří *některý* typ obsahu chtějí vidět. Nehraju si na policajta. Jen dělám **jasný brány a jasný signál**.

#### Úrovně citlivosti

Inzerát má vždy právě jednu úroveň:

- **Běžný (`common`)** (default)  
  Normální věci, které nikoho rozumného nepřekvapí.
- **Pro dospělé (`adult`)**  
  Kontext plnoletosti / adult (typicky alkohol, e-cigarety, legální erotika).
- **Citlivé (`sensitive`)**  
  Věci, co můžou někoho znervóznit nebo vyžadují víc rozumu (např. repliky/airsoft apod.).
- **Omezené (`restricted`)**  
  Obsah se zákonnými omezeními (typicky zbraně apod.). Systém **neověřuje oprávnění**, ale **očekávám jednání podle zákona**.

Pozn.: Úrovně jsou stupňované (common < adult < sensitive < restricted).  
Kdo si povolí vyšší, implicitně povoluje i všechny nižší.

#### Gating (opt-in)

- Defaultně každý uživatel vidí jen **Běžný** obsah.
- Uživatel si musí **vědomě** nastavit maximální úroveň:
  - primárně v **profilu** (jednorázová volba, drží se, dokud ji nezmění),
  - teprve potom se v **nastavení feedu / hledání** zpřístupní filtr citlivosti (v rozsahu jeho maxima).
- Po opt-inu už žádný divadlo: žádný blur, žádný “jsi si jistý?”.  
  Citlivost se jen zobrazuje jako **badge** (v listingu i detailu).

#### Pravidla viditelnosti (hard gate)

Citlivost je **tvrdá brána** napříč celou aplikací:

- **Feed / Hledat / jakýkoliv listing**:  
  Inzeráty nad maximem citlivosti uživatele se **vůbec nedostanou do seznamu**.
- **Detail přes přímý odkaz**:  
  Pokud citlivost nesedí na maximum uživatele, server vrací **404**.  
  Důvod: nechci, aby šlo citlivost obcházet sdílením linků, ani aby šlo “čichat” existenci inzerátu přes rozdíl 403/404.

Důležité: Ostatní brány (ignor, expirace, release window…) **nesmí blokovat otevření detailu**.  
Můžou ovlivnit seznam, ale detail musí zůstat dostupný.  
**Citlivost je jediná výjimka**, která může detail tvrdě schovat (404).

#### Odpovědnost a enforcement

- Citlivost je primárně **sebeoznačení** (odpovědnost prodávajícího).
- Zjevně a opakovaně špatné označování (např. “omezené” maskované jako “běžný”) je důvod k **ručnímu banu**.
- Cíl není hon na čarodějnice. Cíl je, aby veřejný prostor zůstal klidný a předvídatelný.

---

### Ignorování

Ignorování je osobní “úklid”. Není to report, není to trest, není to drama. Je to páka, jak si uživatel vyčistí feed a přestane ho otravovat věc, která ho nezajímá.

#### Co ignor znamená

- Ignorovaný inzerát je pro uživatele **skrytý ze všech seznamů**:
  - feedy
  - hledání
- Ignor **nemění nic globálně**: nepenalizuje prodejce, neovlivňuje ranking pro ostatní a nikomu se o tom nic nehlásí.
- Ignor se propíše do metrik inzerátu pro prodejce jako signál „tohle lidi nechtějí vidět“.

Ignor je čistě: **“mě už tohle nezobrazuj.”**

#### Detail přes přímý odkaz

- Ignorování **nesmí blokovat otevření detailu** přes přímý odkaz.
- V detailu je viditelný stav **„Ignoruješ“** + akce **„Zrušit ignor“**.

Výjimka je jen **Citlivost obsahu** (ta jako jediná může vracet 404).

#### Zobrazení ignorovaných (`withIgnored`)

Defaultně jsou ignorované inzeráty skryté. Přesto musí existovat možnost je zobrazit:

- Feed i hledání podporují parametr **`withIgnored`**:
  - `false` (default) = ignorované se nezobrazují
  - `true` = ignorované se zobrazují (např. pro kontrolu)

#### Scope a persistence

- Ignor je **globální pro uživatele** (napříč zařízeními).
- Ignor je **per-user stav** (doménová data uživatele), ne anonymní analytika.

#### Ignor není flag

- **Ignorovat** = “nezajímá mě to”
- **Nahlásit (flag)** = “tohle porušuje pravidla / je to ojeb / je to nebezpečný”

UI to nesmí míchat dohromady. Ignor je tichý. Flag je výrazný.

---

<a id="stavy-lifecycle"></a>
### Stavy Inzerátu (Lifecycle)

Inzerát má v databázi **tvrdý status** (enum), který je autoritou pro systém.  
O přechody se starají uživatelské akce nebo cron joby.

- **`live` (Aktivní)**  
  Inzerát je živý, `expiresAt` je v budoucnosti a inzerát je k dispozici pro nový obchod.  
  Pouze `live` se:
  - zobrazuje ve standardních feedech,
  - počítá do limitu aktivních inzerátů,
  - umožňuje zahájit novou transakci.

- **`expired` (Expirovaný)**  
  `expiresAt` vypršel (přepnutí zajišťuje cron).  
  Inzerát:
  - je **read-only**,
  - nelze zahájit novou transakci,
  - standardně neleze do feedů (jen přes explicitní filtr / historický režim),
  - přímý odkaz funguje.

- **`closed` (Zavřený prodejcem)**  
  Explicitní ruční volba prodejce: „tímhle končím“.  
  Chová se **stejně jako `expired`**:
  - je **read-only**,
  - nelze zahájit novou transakci,
  - standardně neleze do feedů,
  - přímý odkaz funguje,
  - (kromě flagu už tam není žádná interakce).

- **`sold` (Prodaný)**  
  Inzerát byl označen jako prodaný na základě úspěšné transakce.  
  `sold` je konečný stav:
  - je **read-only**,
  - nelze ho “koupit” ani na něj navázat nový obchod,
  - standardně neleze do feedů (není k dispozici),
  - přímý odkaz funguje (paměť trhu).

Poznámka: Stav `deleted` neexistuje. Inzeráty nemažu, pouze expirují, zavírají se nebo se prodají (paměť trhu).  
Draft není stav inzerátu, je to separátní entita.

---

<a id="limity"></a>
### Limity

Limity nejsou trest. Jsou to mantinely, aby se systém nezměnil v hromadu mrtvol a nekonečných rozpracovaných pokusů.

#### Limit feedů
- Počítám pouze feedy typu `user`.
- `search` (systémový kontext hledání) je mimo limity (nezabírá slot).
- Při překročení limitu feedy nemažu. Jen ty nadlimitní v UI **skryju/disable** (existují, ale uživatel ví, že je má navíc).

#### Limit aktivních inzerátů
- Limituju pouze inzeráty ve stavu **`live`**.
- Při překročení limitu (typicky vypršení passu):
  - existující `live` nechám doběhnout,
  - aktivuje se **Draft Gate** (uživatele nepustím tvořit nové).

<a id="notifikace-mech"></a>
### Notifikace a Inbox

Notifikace nejsou nástroj na otravování. Jsou to **zrcadlo reality**, aby člověk věděl, co se stalo, a nemusel paranoidně refreshovat appku.

#### Filosofie ticha
Defaultní stav je **ticho**.
- žádný pushky (v MVP vůbec neřeším),
- žádný “marketingový připomínky”,
- žádný umělý FOMO.

Když se něco stane, je to dostupný v Inboxu. Tečka.

#### Inbox First
Inbox je **single source of truth** pro události v systému:
- nový zájemce / změna stavu transakce
- nová zpráva
- expirace inzerátu / konec passu
- systémové změny, které se týkají uživatele (např. pravidla / podmínky / incidenty)

Email je jen volitelný „přenos“ toho, co už je v Inboxu.

#### Email jako zrcadlo (digest / forwarder)
Email není primární kanál. Je to nastavitelný výstup:
- **nikdy** (default)
- **okamžitě** (forward)
- **denní souhrn** (digest)

Uživatel si může vybrat i **typy**, které chce posílat:
- transakční (obchodní věci)
- systémové (důležitý stavy a expirace)
- marketing (default off, ať si každej šetří nervy)

#### Kritické výjimky
Některý věci se neptají:
- reset hesla
- bezpečnostní alerty (přihlášení, podezřelá aktivita)

Ty jdou na email vždy, i kdyby uživatel “email nikdy” nastavil.

---

<a id="seznam-viditelnost"></a>
### Seznam inzerátů a Viditelnost

„Seznam“ není stránka. Seznam je **vždycky výsledek dotazu** (feed/hledání).  
Tohle je důležitý, protože tím pádem jsou pravidla viditelnosti stabilní: jeden engine, jeden kontrakt.

#### Seznam = feed dotaz
- seznam je výslednice filtrů (kategorie, parametry, radius, citlivost…)
- UI se chová jako **pseudo infinite scroll** (ne paginace jak z roku 2009)
- existuje tvrdý strop **200 inzerátů na dotaz** (výkon + použitelnost)

Když chce někdo víc, má zúžit filtr. Hotovo.

#### Listing vs. detail
Viditelnost řeším ve dvou rovinách:

1) **Listing (seznam)**  
Inzerát buď projde filtrem a je v seznamu, nebo vypadne.

2) **Detail (přímý odkaz)**  
Detail se má dát otevřít i mimo seznam, protože to je normální chování světa (sdílení linku, návrat z historie, uložený odkaz).

Tvrdé pravidlo:
- **jen citlivost** může blokovat detail a vracet **404** (aby nešlo citlivost obcházet).

Všechny ostatní brány (ignor, expirace, release window, anti-topper…) jsou primárně **pravidla listingu**, ne “zákaz otevření”.

#### Co se v listingu defaultně neukazuje
- **`expired`** a **`closed`**: defaultně mimo seznamy (nutný explicitní filtr / historický režim).
- **`sold`**: mimo standardní listing (protože už není k dispozici).  
  Detail ale zůstává dostupný jako paměť trhu.

Přímý odkaz funguje vždy (krom citlivosti) a detail je read-only, pokud inzerát není aktivní.

#### Když inzerát není k dispozici pro nový obchod
Pokud je inzerát `sold` / `expired` / `closed`, detail se otevře normálně, ale:
- místo tlačítka „Mám zájem“ ukazuju jasný status typu **„Už není dostupný“**,
- a nechávám tam jen bezpečný akce (typicky flag, případně zrušení ignoru).

Žádný “tady klikni a ono se nic nestane”. UI musí být fér.

---

### Řazení a boosty (Priority Sort)

Listing má priority, protože boosty nejsou kosmetika, ale produktová mechanika:

1) **Top Maxxi** (vždy nahoře, imunní)
2) **Top**
3) **Běžné inzeráty**

Uvnitř každé skupiny řadím podle preference uživatele (cena, vzdálenost…).

#### Anti-topper
Pokud má uživatel aktivní Anti-topper, mění se chování listingu:

- **Top Maxxi** zůstává nahoře (imunní)
- **Top + běžné** se smíchají do jedné hromady a řadí se čistě podle preference uživatele  
  (Top ztratí výhodu pozice, zůstane mu jen badge)

Anti-topper nikdy neblokuje přímý odkaz. Je to mechanika listingu, ne zákaz existence.

<a id="zivotni-cyklus"></a>
### Životní cyklus inzerátu

Životní cyklus inzerátu je kombinace tří věcí, který drží trh čistej a zároveň z toho dělají monetizovatelný nástroje (bez ojebů a bez skrytý magie):

1) **Release window** (kdo to uvidí kdy)  
2) **Boosty** (kdo to uvidí kde v listingu)  
3) **Kontinuální nabídka** (jak dlouho to bude žít)

A pořád platí: tohle jsou pravidla pro **listing (seznam)**. Přímý odkaz je normální chování světa a nechci uživatele šikanovat tím, že “to nejde otevřít”.  
Výjimka zůstává jen **citlivost** (ta může vrátit 404).

---

#### Release Window (Early Access / Early Delivery)

Nově publikovaný inzerát má release window: **běžným uživatelům se v listingu ukáže až za +8 hodin** od publikace.

- **Bez Early Access:**  
  inzerát se do listingu vůbec nedostane, dokud neuplyne +8h.
- **S Early Access (kupující):**  
  inzerát vidí **hned** (release window ignoruje pro něj).
- **S Early Delivery (prodávající / per-inzerát):**  
  release window se pro tenhle inzerát zruší úplně, takže ho **vidí hned i lidi bez Early Access**.

Pravidlo “žádný stackování”:
- maximum posunu je vždycky **8 hodin**.  
  Early Access tě neposune víc než +8h dopředu, Early Delivery jen ruší okno, nevytváří “super-early”.

Důležitý UX kontrakt:
- Release window **neblokuje detail přes přímý odkaz**.  
  Pokud se ke mně někdo dostane linkem (sdílení, historie, uložený odkaz), tak se to otevře.  
  (Zase: krom citlivosti.)

---

#### Boosty (Zvýraznění)

Boosty jsou čistě listing mechanika. Nejsou to “výhody v pravidlech”, jsou to **výhody v pozici / signálu**.

Typy:

- **Mark**  
  Jen vizuální signál: badge **„Zvýrazněno“**.  
  Nezaručuje top pozici. Je to “hej, tady je to důležitý / stojí to za pozornost”.

- **Top**  
  Inzerát skočí do prioritní vrstvy listingu (pod **Top Maxxi**).  
  Pořád respektuje filtry, radius, citlivost, ignor, release window atd.  
  Anti-topper mu může sebrat výhodu pozice (zůstane badge).

- **Top Maxxi**  
  Absolutní přednost v listingu.  
  Imunní vůči Anti-topperu (a tudíž i vůči “potlačení pozice”).  
  Pořád ale neobchází systémový brány: citlivost / ignor / release window atd.

Trvání:
- Všechna zvýraznění platí **do expirace inzerátu**.  
  Po expiraci boost končí. Žádný “dál ti to běží někde v historii”.

Interakce s Kontinuální nabídkou:
- Pokud prodloužíš život inzerátu **dřív, než expiroval**, boost běží dál (protože expirace se posune).  
- Pokud už inzerát **expiroval** a ty ho pak “oživíš” Kontinuální nabídkou, starý boost se **nevrací**.  
  (Boost byl koupený pro předchozí cyklus. Reanimace není time-machine.)

---

#### Kontinuální nabídka

Kontinuální nabídka (v textu občas nazývaná i „Kontinuální prodej“) je nástroj pro věci, který nejsou “jednorázovej kus”, ale opakovaná nabídka.

Smysl:
- automatická expirace drží pořádek a zabíjí hřbitovy,
- Kontinuální nabídka dává legální způsob, jak **řízeně prodloužit život** bez toho, aby tu věci hnily navěky zadarmo.

Jak to funguje:
- Kontinuální nabídka je **Pass**, který prodlužuje aktivní cyklus inzerátu (prakticky posouvá jeho “efektivní expiraci”).
- Aktivuje ji **vlastník inzerátu**.
- Lze ji zapnout kdykoliv:
  - když je inzerát ještě `live`, prodloužení se **naváže na jeho expiraci** (nekrade čas),
  - když je už `expired`, začne to **okamžitě** a inzerát se vrátí mezi `live`.

Chování během aktivního passu:
- Inzerát se chová jako normální `live`:
  - leze do feedů (přes filtry),
  - jde na něj založit transakce,
  - metriky se počítají normálně.
- Po vypršení passu se vrací do režimu `expired` (read-only, mimo standardní feedy).

---

#### Co tyhle mechaniky nikdy neobchází

Ať si člověk koupí cokoliv, pořád platí:
- citlivost (hard gate),
- ignor (defaultně skryté v listingu),
- release window (pokud nemáš EA / ED),
- a obecně všechny globální hranice systému.

Placený věci dávají výhodu v pozici / čase / pohodlí. Ne zadní vrátka.

<a id="payback"></a>
### Payback

Payback je **kompenzace pro prodávajícího**, když si koupil zvýraznění a část publika mu ho “odfoukla” přes **Anti-topper**.

Smysl je jednoduchý:  
kupující si platí za **klid** (méně šumu v listingu), ale prodávající si platí za **viditelnost**.  
Payback je férovka mezi těmahle dvěma světy.

#### Co se kompenzuje
- Payback řeší jen zvýraznění, který Anti-topper umí potlačit:
  - **Mark**
  - **Top**
- **Top Maxxi** je imunní → **payback pro něj nikdy nevzniká**.

#### Kdy se to vyhodnocuje
- Vyhodnocuju to **až po expiraci inzerátu**.  
  Po expiraci už se nic “nevrací do hry”, jen vyrovnám účty.

#### Kdo na to má nárok
Payback je samostatné oprávnění:

- **Payback = pass (exclusive)**
- dostupný jen v relevantních balíčcích (typicky **Seller / Pro**)
- nejde to “naklikat jednorázově”, ať z toho není další mikrotransakční cirkus

Payback vzniká **jen pokud má prodávající v době vyhodnocení aktivní Payback pass**.  
Žádný “jo a ještě mi to dopočítej za minulý měsíc”.

#### Jak to počítám
Používám eventy z listingu:

- `visible` = reálný zobrazení karty
- `anti-topper` = nahrazuje `visible` ve chvíli, kdy by se ukázal Mark/Top uživateli s Anti-topperem

Počítám poměr potlačení na úrovni **unikátních uživatelů** (ne “kolikrát někdo scrolloval sem a tam”):

<a id="cistky"></a>
### Čistky dat

Transakce je dočasná věc. Slouží k domluvě a uzavření obchodu. Pak už nemá důvod existovat věčně, protože z toho leze jenom riziko a bordel.

Cíl čistek:
- snížit riziko úniku citlivých údajů,
- nechat lidem krátkou dobu “paměť kontextu”, kdyby se něco řešilo,
- pak to bez milosti smazat.

#### Dvoufázový úklid po ukončení transakce

Jakmile transakce spadne do finálního stavu (`closed`, `sold`, `expired`), spustí se úklid:

1) **Ihned (okamžitě po uzavření):**  
   Mažu **strukturovaná data**, protože to jsou typicky věci, které nechci držet ani omylem:
   - adresy / přesná místa předání (strukturovaný lokace),
   - telefonní čísla,
   - kontaktní údaje,
   - případné “poznámky k předání”, pokud jsou uložené jako struktura,
   - cokoliv, co je v systému explicitně označené jako PII.

   Textový zprávy a obrázky zatím nechávám, protože dávají kontext (a lidi se k tomu někdy potřebujou vrátit).

2) **Po 3 měsících:**  
   Dělám **hard delete celé transakce**.
   - mizí všechny zprávy (text i obrázky),
   - mizí systémové události v rámci vlákna,
   - mizí vazby na uploady (transakční přílohy).

   Zůstávají jen agregované metriky a anonymní eventy, který nejsou navázaný na obsah konverzace.

#### Co úklid nepřepisuje
- Čistky se týkají **transakcí**, ne inzerátů.  
  Inzerát jako “paměť trhu” zůstává (read-only), ale chat jako dočasná domluva po čase mizí.

#### Posun a blokace čistek
- Pokud je transakce ve stavu `open` / `resolved` / aktivně se řeší (včetně dispute), čistky neběží.
- Timer “3 měsíce” se počítá od okamžiku, kdy je transakce definitivně ukončená.

---

<a id="reputace"></a>
### Reputace a Metriky

Reputace není show pro veřejnost. Je to nástroj, který pomáhá lidem dělat rozhodnutí bez nekonečnýho čuchání a paranoie.

Dvě zásady:
- nesnažím se “hodnotit lidi místo lidí”,
- a nebuduju tajný skóre, co někoho tiše pohřbí.

Systém jen sbírá signály a dává je k dispozici férově a čitelně.

#### 1) Flagy (Nahlášení)

Flag je “tady je problém”, ne “nelíbí se mi to”.

**A) Flag inzerátu**
- Toggle akce dostupná v detailu inzerátu.
- Má být jednoduchá: nahlásit / vzít zpět.
- Flag inzerátu nemá automatický okamžitý efekt typu “smazáno” nebo “shadowban”.
- Flag je signál pro metriky a ruční rozhodnutí.

**B) Flag uživatele**
- Jednosměrná akce dostupná **pouze v rámci transakce** a až po `open`.
- Důvod je jednoduchý: nahlásit člověka bez kontextu je toxická zbraň. Kontekst obchodu je minimální důkaz, že k interakci fakt došlo.
- Flag uživatele se propisuje do metrik (flag rate), ale automaticky nikoho nebanuje.

#### 2) Palce (Inzerát)

Palce jsou signál “tahle nabídka je/není atraktivní”. Nejde o morální soud nad prodejcem.

- Palce jsou per-inzerát (Like/Dislike).
- Používám je jako měkký signál relevance a kvality nabídky.
- Nejsou to veřejný “lajky” pro ego. Je to data pro produkt a prodávajícího.

#### 3) Karma (Uživatel)

Karma je hodnocení člověka v kontextu konkrétní transakce. Žádný hvězdičky, žádnej román.

- Hodnocení existuje **v rámci transakce** a až po `open`.
- Dvě volby:
  - **Like (Dobrý)**
  - **Dislike (Špatný)**
- Pokud uživatel nehlasuje, beru to jako neutrál (žádná penalizace za “nechci to řešit”).
- Karma je odlišná od flagu:
  - Karma = “jak se mi s tebou obchodovalo”
  - Flag = “porušuješ pravidla / ojeb / nebezpečný”

Karma sama o sobě nikdy nesmí být automatický ban spouštěč. Je to signál, ne soudní rozsudek.

#### 4) Detail protistrany (Metriky)

Detail protistrany je placený nástroj (Pass), který umožní vidět tvrdý data o chování druhý strany.
Bez passu neukazuju nic. Ani “Score”. Buď máš nástroj, nebo nemáš.

Co přesně ukazuju s passem:

- **Score (A–F)**: agregovaná známka.
- Vedle toho konkrétní metriky (ať to není magie a ať je jasný, z čeho to leze).

**Co měřím u Prodejce:**
- reakční doba,
- rate odmítnutí bez interakce,
- resolved rate,
- expirace (kolik obchodů nechává chcípnout),
- vytížení (kolik rozjetejch obchodů paralelně),
- aktivita (jestli je to mrtvola nebo živý člověk),
- flag rate.

**Co měřím u Kupujícího:**
- reakční doba,
- closer rate (instantní uzavření bez interakce),
- decision rate (jak často dotahuje do konce),
- expirace (kolik obchodů nechává chcípnout),
- vytížení,
- aktivita.

UX pravidlo:
- metriky musí být čitelný a lidský. Žádný grafový porno.  
  Každá metrika má krátký popisek “co to znamená”, aby člověk nemusel hádat.

#### 5) Ban

Ban je ruční nástroj admina (já). Ne automat.

Banuju za:
- podvody,
- spam,
- opakovaný ojeby,
- a hlavně vědomě špatně označenej citlivej obsah (cross-level hiding).

Automatický banování je lákavý, ale ve výsledku je to jenom stroj na křivdy a falešný pozitivy. Nechci.

<a id="hledat"></a>
### Hledat

Hledat je samostatná primární sekce. UXově to není „feed“, ale **vyhledávací kontext**, který se v backendu chová jako feed, protože používá **stejnej engine, stejný filtry a stejnej list UI**. Žádná speciální magie.

#### `search` jako systémový kontext

- V systému existuje feed typu **`search`**.
- `search` je **singleton**: maximálně 1 instance na účet.
- `search` se **nezobrazuje v seznamu feedů**. Uživatel ho nespravuje jako položku mezi feedy.
- `search` je mimo limity: **nezabírá slot** a nejde ho „vyčerpat“. Limity feedů se týkají jen feedů typu `user`.

`search` si pamatuje poslední stav stránky Hledat (dotaz, filtry, radius, lokaci, řazení…), aby se uživatel vracel do stejného kontextu a nemusel všechno nastavovat znovu.  
Je to pohodlí, ne feature.

#### UI kontrakt

- Stránka Hledat je rychlá zkratka: input + filtry + výsledky v listu.
- Výsledky používají **stejný list** jako feedy (stejné karty, stejné interakce, stejné eventy).
- Hledat nepřidává žádný “speciální pravidla”. Jen skládá filtry a ukazuje výsledky.

#### Uložení hledání jako feed

Hledat může používat každý vždy. Pokud si chce uživatel tenhle kontext uložit, udělá to vědomě:

- Akce **„Uložit jako feed“**:
  - vytvoří nový feed typu `user`,
  - ten se už zobrazí v „Moje seznamy“,
  - a **počítá se do limitu**.

Pokud je uživatel na limitu feedů:
- ukládání je blokované (jasný důvod a žádný kecy),
- Hledat dál funguje normálně.

#### Pravidla viditelnosti

Výsledky Hledat respektují stejné brány jako ostatní seznamy:

- **Ignorování**: ignorované se defaultně nezobrazují (lze zobrazit přes `withIgnored`).
- **Citlivost obsahu**: hard gate (nad maximum se to do seznamu nedostane, a detail vrací 404).
- **Životní cyklus inzerátu**: expirované/closed/sold se do standardních výsledků nedostanou (pokud si to uživatel výslovně nezapne).

#### Reset

Hledat má vždy rychlou akci **„Reset“**, která vrátí vyhledávání do neutrálu (bez dotazu a bez filtrů).  
Bez modalů, bez výčitek, bez “jsi si jistý?”. Prostě reset.

---

<a id="multi-category"></a>
### Multi-Category

Multi-Category je **distribuce**, ne duplikace. Nevznikají žádné kopie inzerátu, jen se rozšíří množina kategorií, přes které se inzerát může zobrazit.

#### Co to dělá

- Každý inzerát má jednu **primární kategorii**.  
  To je „pravda“ pro:
  - vzhled a texty v UI,
  - Category Spec (atributy a filtry),
  - a celkovou identitu inzerátu.

- Multi-Category přidá k primární kategorii až **2 další kategorie** (sekundární).
- Inzerát se pak může zobrazit uživatelům, kteří sledují **kteroukoliv** z těchto kategorií.

Primární kategorie je pořád autorita. Sekundární jsou čistě distribuční.  
Neexistuje scénář „dám si to do jiný kategorie, protože tam jsou výhodnější atributy“. Ne. A hotovo.

#### Pravidla viditelnosti a deduplikace

- V rámci jednoho seznamu se inzerát uživateli zobrazí **právě jednou**, i když matchuje víc kategorií zároveň.
- Pokud uživatel přepne na jiný feed nebo jiný kontext, může inzerát vidět znovu. To je v pořádku.  
  „Právě jednou“ platí **pro jeden renderovaný seznam**, ne pro život.

#### Jak to funguje ve feedech a hledání

Feed/hledání, které filtruje konkrétní kategorii, považuje inzerát za match, když:
- filtr = primární kategorie **nebo**
- filtr = jedna ze sekundárních kategorií

Ostatní brány platí pořád stejně:
- ignorování (defaultně skryté),
- citlivost obsahu (hard gate),
- release window / životní cyklus,
- a jakýkoliv další globální gating.

Multi-Category nic neobchází. Jen rozšiřuje dosah.

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
  - „+2 kategorie“ (bez vypisování konkrétních názvů, ať to nezahltí)
- V editoru inzerátu je Multi-Category jasně pojmenované jako distribuce (ne „přidat další kategorii kvůli atributům“).

Multi-Category není hack na relevance. Je to legitimní nástroj, jak dostat inzerát k lidem, kteří ho fakt hledají v jiným šuplíku.

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
