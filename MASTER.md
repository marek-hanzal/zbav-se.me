---
key: MASTER
title: Zdroj pravdy pro aplikaci, produkt a pravidla
summary: Primární dokument, kde jsou popsané všechny části aplikace, co umí, pravidla a další; slouží jako hlavní zdroj pravdy.
---

# MASTER

Tohle je finální „single source of truth“ pro Zbav-se.me. Je to moje produktová ústava: popisuje **co je pravda** (koncepty, pravidla, hranice) a **proč**. Neřeší, jak to technicky nakóduju.

Co tu najdeš:
- **Směr produktu**: postoj a zásady, který mi nedovolí udělat z toho další bazar.
- **Kodex**: tvrdý hranice férovosti (monetizace, pay-to-win, data, manipulace).
- **Koncepty**: „jak funguje X?“ na jednom místě (inzerát, draft, feed, transakce, citlivost, limity…).
- **Ekonomika**: model nabídky ([tokeny](#koncept-tokeny)/[kupóny](#koncept-kupon)/[passy](#koncept-pass)/[předplatné](#koncept-predplatne)) a pravidla aktivace.

Jak to číst:
- Kontrakt „co tu není, neexistuje“ držím natvrdo v kapitole [Pravidla dokumentu](#pravidla-dokumentu) a nikde jinde ho už nerozmělňuju.

---

<a id="obsah-nahore"></a>
## Obsah

Pozn.: **Obsah je autorita pořadí.** Pořadí kapitol a konceptů v dokumentu musí odpovídat tomu, co je vypsané tady (a dole v Obsahu).

- [Pravidla dokumentu](#pravidla-dokumentu)
- [Kodex](#kodex)
  - [Důvěra jako výchozí stav](#duvera-default)
  - [Férová monetizace a neaktivita](#ferova-monetizace)
  - [Žádné pay-to-win](#no-p2w)
  - [Respekt k uživateli](#respekt)
  - [Otevřenost a odpovědnost](#otevrenost)
- [Směr produktu](#smer-produktu)
  - [Identita](#identita)
  - [Tone of Voice](#tov)
  - [Produktové cíle](#produktove-cile)
  - [UX principy](#ux-principy)
  - [Komunikace a transparentnost](#komunikace)
- [Konkurenceschopnost](#konkurenceschopnost)
  - [Co umím líp](#co-umim-lip)
  - [V čem je má slabina (a proč s tím počítám)](#slabina)
  - [Co vědomě nedělám](#co-nedelam)
- [Koncepty](#koncepty)
  - [Uživatel](#koncept-uzivatel)
  - [Kategorie](#koncept-kategorie)
  - [Seasons](#koncept-seasons)
  - [Lokace](#koncept-lokace)
  - [Uploady](#koncept-uploady)
  - [Galerie](#koncept-galerie)
  - [Inzerát](#koncept-inzerat)
  - [Inzerát: Titulek](#koncept-inzerat-titulek)
  - [Inzerát: Cena](#koncept-inzerat-cena)
  - [Inzerát: Předání](#koncept-inzerat-delivery)
  - [Inzerát: Záruka](#koncept-inzerat-warranty)
  - [Inzerát: Stav (A–F)](#koncept-inzerat-stav)
  - [Inzerát: Stáří (A–F)](#koncept-inzerat-stari)
  - [Inzerát: Popis](#koncept-inzerat-popis)
  - [Inzerát: Co chci vyzdvihnout / Chci být upřímný](#koncept-inzerat-pros-cons)
  - [Inzerát: Video (ne)](#koncept-inzerat-video)
  - [Inzerát: Brand](#koncept-inzerat-brand)
  - [Draft](#koncept-draft)
  - [Feed](#koncept-feed)
  - [Hledat](#koncept-hledat)
  - [Seznam inzerátů](#koncept-seznam-inzeratu)
  - [Release window](#koncept-release-window)
  - [Multi-Category](#koncept-multi-category)
  - [Oblíbené](#koncept-oblibene)
  - [Citlivost](#koncept-citlivost-inzeratu)
  - [Ignor](#koncept-ignorace-inzeratu)
  - [Flag inzerátu](#koncept-flag-inzeratu)
  - [Flag uživatele](#koncept-flag-uzivatele)
  - [Transakce](#koncept-transakce)
  - [Zprávy](#koncept-zpravy)
  - [Notifikace (Activity)](#koncept-notifikace)
  - [Dispute](#koncept-dispute)
  - [Automatické ukončení: Inzerát](#koncept-automaticke-ukonceni-inzeratu)
  - [Pass: Delší expirace inzerátu (Za měsíc)](#koncept-pass-delsi-expirace-inzeratu)
  - [Pass: Aktivní inzeráty +20](#koncept-pass-aktivni-inzeraty-20)
  - [Automatické ukončení: Transakce](#koncept-automaticke-ukonceni-transakce)
  - [Limit počtu feedů](#koncept-limit-poctu-feedu)
  - [Limit počtu fotek nad inzerátem](#koncept-limit-poctu-fotek)
  - [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu)
  - [Palce (Like/Dislike)](#koncept-palce)
  - [Karma (Like/Dislike)](#koncept-karma)
  - [XP](#koncept-xp)
  - [Metrika: Karma](#koncept-metrika-karma)
  - [User Eventy](#koncept-user-eventy)
  - [Metriky prodávajícího](#koncept-metriky-prodavaciho)
  - [Detail protistrany](#koncept-detail-protistrany)
  - [Metriky kupujícího](#koncept-metriky-kupujiciho)
  - [Metrika: Reakční doba](#koncept-metrika-reakcni-doba)
  - [Metrika: Odmítnutí bez interakce](#koncept-metrika-odmitnuti-bez-interakce)
  - [Metrika: Resolved rate](#koncept-metrika-resolved-rate)
  - [Metrika: Expirace (transakcí)](#koncept-metrika-expirace)
  - [Metrika: Vytížení (paralelní obchody)](#koncept-metrika-vytizeni)
  - [Metrika: Aktivita](#koncept-metrika-aktivita)
  - [Metrika: Flag rate](#koncept-metrika-flag-rate)
  - [Metrika: Closer rate](#koncept-metrika-closer-rate)
  - [Metrika: Decision rate](#koncept-metrika-decision-rate)
  - [Metrika: Score (A–F)](#koncept-metrika-score)
  - [Metrika: Visible](#koncept-metrika-inzeratu-visible)
  - [Metrika: Impression](#koncept-metrika-inzeratu-impression)
  - [Metrika: View](#koncept-metrika-inzeratu-view)
  - [Metrika: Anti-topper](#koncept-metrika-inzeratu-anti-topper)
  - [Metrika: Thumbs](#koncept-metrika-inzeratu-thumbs)
  - [Metrika: Ignored](#koncept-metrika-inzeratu-ignored)
  - [Metrika: Transactions](#koncept-metrika-inzeratu-transactions)
  - [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
  - [Pass](#koncept-pass)
  - [Kupón](#koncept-kupon)
  - [Tokeny](#koncept-tokeny)
  - [Aktivace](#koncept-aktivace)
  - [Ceník](#koncept-cenik)
  - [Exclusive](#koncept-exclusive)
  - [Předplatné](#koncept-predplatne)
  - [Automatické ukončení: Předplatné (neaktivita)](#koncept-automaticke-ukonceni-predplatneho)
  - [Tokeny: Získávání](#koncept-tokeny-ziskavani)
  - [Early Discovery](#koncept-early-discovery)
  - [Early Delivery](#koncept-early-delivery)
  - [Mark](#koncept-mark)
  - [Top](#koncept-top)
  - [Top Maxxi](#koncept-top-maxxi)
  - [Anti-topper](#koncept-anti-topper)
  - [Payback](#koncept-payback)
  - [Kontinuální nabídka](#koncept-kontinualni-nabidka)
  - [Landing](#koncept-landing)
  - [Navigace](#koncept-navigace)
  - [Můj účet](#koncept-muj-ucet)
  - [UI: Rámec](#koncept-ui-ramec)
  - [UI: Dashboard](#koncept-ui-dashboard)
  - [UI: Chci prodávat](#koncept-ui-seller)
  - [UI: Chci nakupovat](#koncept-ui-buyer)
  - [UI: Rozšíření](#koncept-ui-rozsireni)
  - [UI: Bonusy](#koncept-ui-bonusy)
  - [Ban](#koncept-ban)
- [Ekonomika](#ekonomika)
  - [Předplatné (balíčky)](#ekonomika-balicky)
  - [Tokeny (nabídka a ceny)](#ekonomika-tokeny-ceny)
  - [Ceník rozšíření (kupóny / passy)](#ekonomika-cenik-rozsireni)
- [Uvedení na trh](#uvedeni-na-trh)
- [Veřejné vystupování](#verejne-vystupovani)
- [Retence](#retence)
- [Odhady](#odhady)

---

<a id="pravidla-dokumentu"></a>
## Pravidla dokumentu
[další](#kodex) →

> **Single source of truth.** Co tu není, neexistuje.
> Pokud se realita produktu začne hádat s tímhle dokumentem, beru to jako bug. Opravím buď produkt, nebo rozhodnutí. **Ne** že to budu obcházet „výjimkou“, „poznámkou bokem“ nebo jiným alibismem.

Tenhle dokument mi drží směr i ve chvíli, kdy mi teče do bot. Je to závazek, podle kterýho se ten produkt chová — ne sbírka nápadů.

Tenhle dokument má jednoduchý pravidla: není to deníček ani hromada poznámek z hospody. Píšu sem **jen** věci, podle kterých se produkt reálně chová, nebo chovat má.

Co sem patří:
- **Koncepty, definice, rozhodnutí** a jejich *důvod* (co platí a proč).
- Věci, které když poruším, tak se rozpadne **důvěra** nebo **charakter** produktu.

Co sem nepatří:
- Žádný kód. Žádný DB schémata. Žádný „jak to udělám“.
- Žádný technický výmluvy typu „tohle zatím nejde“.
- Žádný duplicitní přežvykování toho samýho na pěti místech.

Formát a tón:
- Píšu v **ich-formě**. Jsem autor, beru odpovědnost.
- Když je něco vágní, je to k ničemu. Když je něco zbytečný, tak to smažu.
- Každý nový kus textu musí projít otázkou: **„Pomůže mi to udělat správný rozhodnutí, až budu unavenej?“**

Struktura dokumentu (základ):
- **Směr produktu** je základ (postoj + pravidla, co mi brání udělat z toho další bazar): [`#smer-produktu`](#smer-produktu)
- **Konkurenceschopnost** je argumentace proč to existuje (bez marketingových keců): [`#konkurenceschopnost`](#konkurenceschopnost)
- **Kodex** je „no bullshit“ vrstva hranic: [`#kodex`](#kodex)
- **Koncepty** jsou hlavní katalog reality: každá otázka „jak funguje X?“ má odpověď v jednom konceptu: [`#koncepty`](#koncepty)
- **Ekonomika** je model nabídky ([tokeny](#koncept-tokeny)/[kupóny](#koncept-kupon)/[passy](#koncept-pass)/[předplatné](#koncept-predplatne)/[ceník](#koncept-cenik)): [`#ekonomika`](#ekonomika)
- **Uvedení na trh**, **Retence**, **Odhady** jsou strategická vrstva (bez implementačních detailů):
  - [`#uvedeni-na-trh`](#uvedeni-na-trh)
  - [`#retence`](#retence)
  - [`#odhady`](#odhady)

---

<a id="kodex"></a>
## Kodex
← [předchozí](#pravidla-dokumentu) | [další](#smer-produktu) →

Kodex je moje „no bullshit“ vrstva. Není to právní text. Je to sada pravidel, který držím i ve chvíli, kdy by bylo strašně lákavý je ohnout kvůli růstu nebo penězům.

Jestli nějaká feature nebo monetizační nápad poruší kodex, je to automaticky špatně. Ne „možná“. Ne „nějak to vysvětlíme“. Prostě špatně.

<a id="duvera-default"></a>
### Důvěra jako výchozí stav
[další](#ferova-monetizace) →

Důvěra u mě není odměna ani razítko po „ověření identity“. Je to vlastnost prostředí.

Co z toho plyne:
- Nehoním lidi přes občanky. Držím rámec, ve kterým se dá chovat normálně.
- Hranice jsou jasný a vymahatelný: co nejde, prostě nejde (a nejde to obcházet).
- Odpovědnost začíná otevřením obchodu: zájem není závazek, obchod je závazek. (Viz [Transakce](#koncept-transakce).)
- „Zavřeno je zavřeno“ je fyzika systému, ne prosba. (Viz [Transakce](#koncept-transakce).)

<a id="ferova-monetizace"></a>
### Férová monetizace a neaktivita
← [předchozí](#duvera-default) | [další](#no-p2w) →

Paywall není past. Je to cedule u dveří: vidíš ji dřív, než do nich vejdeš.

Co držím:
- Platí se za hodnotu, ne za nátlak.
- Žádný gotcha momenty typu „nechám tě to skoro dodělat a pak ti to seberu“.
- Zrušení předplatnýho nesmí být labyrint ani psychologická válka. (Detaily patří do [Ekonomiky](#ekonomika).)
- Neaktivita je signál „už to teď nepoužívám“. Nechci někoho potichu cucat jen proto, že zapomněl.
- Neaktivitu řeším férově a explicitně (viz [Automatické ukončení: Předplatné (neaktivita)](#koncept-automaticke-ukonceni-predplatneho)).

<a id="no-p2w"></a>
### Žádné pay-to-win
← [předchozí](#ferova-monetizace) | [další](#respekt) →

Peníze u mě nesmí dělat z lidí „lepší občany“. Nechci trh, kde vyhrává ten, kdo nejvíc zaplatí, a ostatní jen čumí na zadek.

To znamená:
- Platíš za nástroje, pohodlí a signál. Ne za lež.
- Placený věci jsou pojmenovaný a viditelný. Žádný skrytý boosty.
- Neplatící nejsou potichu penalizovaný. Žádnej tajnej handicap.

Výjimky (tvrdá distribuce, explicitně):
- Jsou věci, kde platíš za **pozici v listingu** (tvrdá distribuce) — jinak se marketplace nerozjede.
- Tyhle nástroje jsou **kriticky vybraný, pojmenovaný a zdokumentovaný** (např. [Top Maxxi](#koncept-top-maxxi)).
- A hlavně: platí to jen pro **inzerát/distribuci**. **Nikdy** pro důvěru lidí. Na [Score](#koncept-metrika-score) a reputační metriky to nemá žádnej vliv.

<a id="respekt"></a>
### Respekt k uživateli
← [předchozí](#no-p2w) | [další](#otevrenost) →

Uživatel není cíl pro optimalizaci metrik. Je to člověk, co si chce v klidu prodat nebo koupit věc.

Respekt v praxi:
- Neotravovat. Notifikace jsou informace, ne bič. (Viz [Notifikace](#koncept-notifikace).)
- Nemanipulovat. Žádný confirm-shaming, žádný dark patterns.
- Dát kontrolu. Filtry, ignor, citlivost, ukončení. (Viz [Citlivost](#koncept-citlivost-inzeratu), [Ignor](#koncept-ignorace-inzeratu).)
- Neznehodnocovat čas. Minimum kroků, žádný zbytečný potvrzování.
- Nebýt creepy. Data sbírám s jasným účelem pro produkt. Ne pro reklamní profilování. (Viz [Retence](#retence).)

<a id="otevrenost"></a>
### Otevřenost a odpovědnost
← [předchozí](#respekt) | [další](#identita) →

Nejsem anonymní „tým“ a nechci se za nic schovávat. Když něco poseru, je to moje. Když něco funguje, je to taky moje.

Co z toho dělám standard:
- Pravidla nejsou magie. Když systém něco dělá (gating, řazení, omezení), umím říct proč.
- Když něco zásadního změním, řeknu to nahlas (ne potichu v changelogu).
- Co jde vyřešit strukturou a mechanikama, řeším strukturou a mechanikama. Ne ručním admin cirkusem.

---

<a id="smer-produktu"></a>
## Směr produktu
← [předchozí](#kodex) | [další](#konkurenceschopnost) →

Tady jsou pravidla, který mi nedovolí udělat z toho další obyč bazar. Držím se jich i ve chvíli, kdy budu unavenej, ve stresu a budu chtít „jen udělat malou výjimku“.

Platí pár jednoduchých věcí:
- **Klid a jistota jsou cíl.** Úspěch není wow-efekt, ale moment, kdy uživatel nic neřeší.
- **Když to nejde pochopit samo, je to špatně.** Ne „uživatel je blbej“, ale já jsem to dojebal.
- **Minimum keců, maximum signálu.** UI se chová fyzikálně přirozeně, žádný kejkle.
- **Důvěra není feature.** Je to výsledek: konzistence, transparentnost, férový pravidla.

<a id="identita"></a>
### Identita
← [předchozí](#otevrenost) | [další](#tov) →

Zbav-se.me není „platforma“. Je to moje práce a můj postoj. A ten postoj je napsanej natvrdo:

> **Prodávám, neojebávám.**

Co z toho plyne:
- **Klid místo chaosu.** Žádný bazarový peklo, kde se člověk prokliká k migréně.
- **Minimum psaní.** Domluva má být primárně klikací a strukturovaná; text je doplněk, ne střed vesmíru (viz [Transakce](#koncept-transakce), [Zprávy](#koncept-zpravy)).
- **Lokálnost jako default.** Poloha je core (viz [Lokace](#koncept-lokace)).
- **Transparentnost jako design.** Žádný skrytý penalizace, žádný „nevíš proč se ti to nezobrazuje“ (viz [Seznam inzerátů](#koncept-seznam-inzeratu)).
- **Férová monetizace.** Platí se za hodnotu (nástroje, čas, pohodlí), ne za manipulaci (viz [Ekonomika](#ekonomika)).
- **Měření je pro lidi, ne pro inzerenty.** Když něco měřím, má to viditelný smysl v produktu; nic neprodávám třetím stranám.

<a id="tov"></a>
### Tone of Voice
← [předchozí](#identita) | [další](#produktove-cile) →

> „**Klikej. Zkoumej. Není tu co posrat.**“
> Onboarding nastaví vztah. A pak držím hubu a nechám UI dělat práci.

Jak mluvím:
- **Tykám.** Jsme lidi, ne úřad.
- **Mužský rod beru jako neutrální default** (kvůli konzistenci a kratším větám).
- **Žádnej pasiv a úředničina.** Ne „bylo odmítnuto“, ale „Odmítl jsi“ / „Prodejce tě odmítl“.
- **Žádný školení v UI.** Žádný tooltipy, žádný „(?)“, žádný „tady klikni“. Když to potřebuje nápovědu, je to špatně navržený.
- **Běžnej workflow je klidnej.** Ostřejší tón si nechávám jen na výjimečný místa (onboarding, bezpečnostní hranice).

<a id="produktove-cile"></a>
### Produktové cíle
← [předchozí](#tov) | [další](#ux-principy) →

Nechci stavět „appku“. Chci postavit **trh**, kterej je čitelnej a předvídatelnej:

- **Ticho = úspěch.** Když uživatel nic neřeší, vyhrál jsem.
- **Známý mentální model, ale bez bordelu.** List → detail → zájem → domluva → konec.
- **Minimum psaní, maximum faktů.** Timeline událostí místo románů.
- **Lokální základ.** Poloha, vzdálenost, radius.
- **Definitivní konce.** „Zavřeno je zavřeno“ (viz [Transakce](#koncept-transakce)).
- **Žádný obcházení.** Brány jsou brány (viz [Citlivost](#koncept-citlivost-inzeratu)).

<a id="ux-principy"></a>
### UX principy
← [předchozí](#produktove-cile) | [další](#komunikace) →

> **Když to potřebuje nápovědu, je to špatně navržený.**

Moje pravidla UX:
- **Konzistence > chytrost.** Výjimky zabíjejí důvěru.
- **Empty state není prázdno. Je to status.** Vzor: **status → krátký proč → jedno jasný CTA**.
- **Prázdno je záměr.** Méně šumu = méně nejistoty.
- **Emoce můžou být v textu. Akce musí být mechanická.**
- **UI je interaktivní hned.** Animace jsou luxus, ne blokace. Respektuju `prefers-reduced-motion`.

<a id="komunikace"></a>
### Komunikace a transparentnost
← [předchozí](#ux-principy) | [další](#co-umim-lip) →

Nejrychlejší způsob, jak zabít důvěru, je dělat tajnosti a pak se tvářit, že „to je pro tvoje dobro“. Já na to seru.

Co je u mě povinný standard:
- **Jsem vidět.** Žádný anonymní „tým“.
- **Monetizace je přiznaná, čitelná a férová.** Žádný gotcha momenty (viz [Kodex](#kodex), [Ekonomika](#ekonomika)).
- **Zdroják je veřejně k nahlédnutí (source-available, ne OSS).**
- **Žádný prodej dat třetím stranám.** Tečka.
- **Bez trackování.** Cookies používám jen pro autentizaci (přihlášení), ne pro marketing ani tracking. Žádný UTM, žádný externí analytický skripty. Měřím jen interní eventy, který mají smysl v produktu.
- **Změny nejsou tichý ojeb.** Když změním něco zásadního, přiznám to.

---

<a id="konkurenceschopnost"></a>
## Konkurenceschopnost
← [předchozí](#smer-produktu) | [další](#koncepty) →

Konkurence (Sbazar, Bazoš, FB Marketplace a spol.) není „špatná“. Je to prostě starej svět: hodně šumu, hodně náhody, hodně domlouvání v mlze, málo jistoty. Lidi tam prodávají, protože tam „někdo je“, ne proto, že by to bylo příjemný.

Moje výhoda není jedna „killer feature“. Moje výhoda je **charakter trhu** a **klidnej systém**, kterej snižuje mentální dluh. Většina marketplace dělá opak: zvyšuje stres, zvyšuje nejistotu, a pak to maskuje notifikacema, badgeama a „algoritmem“.

> Cíl není porazit všechny. Cíl je být tak příjemnej, že návrat do starýho chaosu bude bolet.

<a id="co-umim-lip"></a>
### Co umím líp
← [předchozí](#komunikace) | [další](#slabina) →

1) **Domluva: normální chat + strukturovaný fakta navíc**
Lidi si můžou psát normálně. Rozdíl je v tom, že systém drží fakta vedle toho: zájem, přijetí/odmítnutí, čas, místo, ukončení. (Viz [Transakce](#koncept-transakce), [Zprávy](#koncept-zpravy).)

2) **Klidný UX, co nevysvětluje a netlačí**
Žádný školení, žádný hinty, žádný „tady klikni“. Když to nejde pochopit samo, je to moje chyba.

3) **Lokace jako core, ne jako schovaná mapa pro trpělivý**
Poloha je součást inzerátu, vzdálenost je signál, radius je nástroj. (Viz [Lokace](#koncept-lokace), [Feed](#koncept-feed).)

4) **„Zavřeno je zavřeno“ + žádný obcházení**
Transakce má začátek a konec. Konec je definitivní. Další kontakt = nová transakce. (Viz [Transakce](#koncept-transakce).)

5) **Ochrana prodejce jako feature**
Odpovědnost začíná až obchodem. Kupující může psát hned, ale `interest` není kanál na prodejce: prodejce zprávy neuvidí, dokud z toho neudělá `trade`. (Viz [Transakce](#koncept-transakce).)

6) **Transparentnost jako systémová vlastnost**
Pravidla jsou pojmenovaný. Když něco omezím, má to čitelnej důvod. (Viz [Seznam inzerátů](#koncept-seznam-inzeratu), [Kodex](#kodex).)

7) **Data dělám pro uživatele, ne pro inzerenty**
Metriky jsou signál trhu a nástroje pro férový mechaniky. Ne reklamní profilování. Žádný tajný skóre ani blackbox penalizace nad inzerátem.

8) **Měkká frikce místo manipulace**
Jemný brzdy a struktura, aby se to nerozpadlo do bazarovýho pekla, ale bez moralizování a bez nátlaku.

9) **Minimalismus i v médiích**
Nechci z feedu dělat video cirkus. Fotky stačí.

10) **Osobní data jen dočasně**
Co je osobní a patří jen do domluvy, nesmí v systému hnít věčně. (Viz [Transakce](#koncept-transakce).)

11) **Férová publikace bez instantního vysávání**
Nové inzeráty mají [Release window](#koncept-release-window) (baseline férovost v nalezitelnosti feedu). Kdo chce objevovat dřív, koupí si [Early Discovery](#koncept-early-discovery). Kdo chce dodat inzerát všem hned, koupí si [Early Delivery](#koncept-early-delivery). Všechno je explicitní a čitelné. (Viz [Release window](#koncept-release-window), [Early Discovery](#koncept-early-discovery), [Early Delivery](#koncept-early-delivery).)

12) **Boosty bez pay-to-win: Anti-topper + Payback**
Kupující si můžou vypnout zvýraznění ([Anti-topper](#koncept-anti-topper)) bez toho, aby tím „okrádali“ prodejce. Systém to vidí a prodejce dostane [Payback](#koncept-payback). Boosty existují, ale důvěra v systém zůstává. (Viz [Anti-topper](#koncept-anti-topper), [Payback](#koncept-payback).)

13) **Automatické ukončování všeho, co by jinde hnilo**
Inzeráty, transakce i předplatné mají tvrdý kontrakt konce. Žádný zombie inzeráty, žádný nekonečný „interest“, žádný suby běžící na mrtvolky. (Viz [Automatické ukončení: Inzerát](#koncept-automaticke-ukonceni-inzeratu), [Automatické ukončení: Transakce](#koncept-automaticke-ukonceni-transakce), [Automatické ukončení: Předplatné (neaktivita)](#koncept-automaticke-ukonceni-predplatneho).)

14) **Ekonomika čitelná z jednoho místa**
Jednotný model [Tokeny](#koncept-tokeny) / [Kupón](#koncept-kupon) / [Pass](#koncept-pass). [Ceník](#koncept-cenik) obsahuje všechno. [Exclusive](#koncept-exclusive) je jen viditelné označení, ne tajná výjimka. Když něco existuje, je v ceníku. Když je zamčené, je u toho nápis. (Viz [Ceník](#koncept-cenik), [Exclusive](#koncept-exclusive), [Aktivace](#koncept-aktivace), [Ekonomika](#ekonomika).)

<a id="slabina"></a>
### V čem je má slabina (a proč s tím počítám)
← [předchozí](#co-umim-lip) | [další](#co-nedelam) →

- **Network efekt:** Na startu tam nebude „všechno“. To je gravitace, ne bug. Řeším to sekvenčním startem (viz [Uvedení na trh](#uvedeni-na-trh)).
- **Míň impulsního prodeje přes chaos:** Míň šumu může krátkodobě vypadat pomaleji. Dlouhodobě je to zdravější trh.
- **Transparentnost je závazek:** Znamená míň kliček a víc práce. Správně.
- **Nejsem pro každýho:** Někoho tenhle styl odradí. Filtr je záměr.
- **Průhlednost přitahuje i hejtry:** Počítám s tím. Je to cena za důvěru.

<a id="co-nedelam"></a>
### Co vědomě nedělám
← [předchozí](#slabina) | [další](#koncept-uzivatel) →

- **Žádný prodej dat.** Nikdy.
- **Žádný dark patterns.** Žádný „nejde odejít“, schovaný volby, vynucený souhlasy.
- **Žádný skrytý pay-to-win.** Výjimky pro distribuci jsou explicitní a nikdy nelezou do důvěry lidí (žádný dopad na [Score](#koncept-metrika-score)).
- **Žádný spam-notifikace a onboarding maily.** Informace ano, nátlak ne (viz [Notifikace](#koncept-notifikace)).
- **Žádný „AI řeší všechno“.** Důvěra stojí na prevenci, pravidlech a struktuře.
- **Žádný video feed.** Nechci dělat TikTok.
- **Žádný vysvětlování rozdílů proti konkurenci.** Rozdíl se má projevit chováním UI.
- **Žádná automatická moderace obsahu.** Žádný „systémová policie“ a tajný penalizace za obsah.
- **Anti-abuse a integrita ekonomiky ano.** Rate-limit, ochrana proti farmení bonusů a zjevným exploitům jsou fér (viz [Tokeny: Získávání](#koncept-tokeny-ziskavani)).

---

<a id="koncepty"></a>
## Koncepty
← [předchozí](#konkurenceschopnost) | [další](#ekonomika) →

Tady je katalog reality. Každá otázka „jak funguje X?“ má odpověď v jednom konceptu. Jinde je maximálně odkaz.

Pravidlo proti duplicitám (znovu a naposled):
- Když něco patří sem, nepíšu to nikam jinam.
- Křížový věci mají vlastní autoritu (typicky [Citlivost](#koncept-citlivost-inzeratu), [Seznam inzerátů](#koncept-seznam-inzeratu), [Limit počtu feedů](#koncept-limit-poctu-feedu), [Limit fotek](#koncept-limit-poctu-fotek), [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu), [Ekonomika](#ekonomika)).

---

<a id="koncept-uzivatel"></a>
### Uživatel
← [předchozí](#co-nedelam) | [další](#koncept-kategorie) →

Uživatel je core entita. Je na něj navázaný skoro všechno (inzeráty, drafty, feedy, transakce, activity), ale **PII držím na minimu** (typicky email). Zároveň pro funkci produktu ukládám doménový data účtu (feedy, drafty, transakce, activity, eventy/metriky, flagy…). Všechno navíc je jen riziko a dluh.

Co uživatel reálně ovládá:
- kontext trhu přes [Feedy](#koncept-feed),
- rozpracovaný věci přes [Drafty](#koncept-draft),
- publikovaný věci přes [Inzeráty](#koncept-inzerat),
- obchodní kontext přes [Transakce](#koncept-transakce) a [Zprávy](#koncept-zpravy),
- „co se stalo“ přes [Activity](#koncept-notifikace),
- hranice obsahu přes [Citlivost](#koncept-citlivost-inzeratu) a osobní úklid přes [Ignor](#koncept-ignorace-inzeratu),
- aktivace a limity přes [Ekonomiku](#ekonomika) a [Limit počtu feedů](#koncept-limit-poctu-feedu), [Limit fotek](#koncept-limit-poctu-fotek), [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu).

Kontrakt (co si hlídám):
- Účet je nástroj, ne sociální profil.
- Preferuju nastavení a hranice před „profilovkama a bio“.
- Když něco vypadá jako „sbíráme to, protože můžeme“, je to u mě automaticky špatně.

Related:
- [Feedy](#koncept-feed)
- [Drafty](#koncept-draft)
- [Inzeráty](#koncept-inzerat)
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Activity](#koncept-notifikace)

---

<a id="koncept-kategorie"></a>
### Kategorie
← [předchozí](#koncept-uzivatel) | [další](#koncept-seasons) →

Kategorie je organizační vrstva trhu. Je to kontext, ve kterým dává smysl jinej jazyk a jiný filtry. Držím ji jednoduchou, protože složitá taxonomie je jen bordel pro lidi.

Kategorie nese mimo jiné:
- **název**
- **slug**
- **locale**
- **discovery režim v defaultním listingu**

Discovery režim kategorie:
- `implicit` = normální kategorie. Její inzeráty se můžou objevit v obecném feedu/hledání bez výběru kategorie.
- `explicit` = tichá kategorie. Její inzeráty nelezou do obecného feedu/hledání samy od sebe; uživatel si o tu kategorii musí vědomě říct filtrem.

Tohle není [Citlivost](#koncept-citlivost-inzeratu). `explicit` neznamená zakázaný ani 18+. Je to hygienická brzda veřejného feedu: věci, které existují a jsou normálně dostupné, ale nemusejí být hned na první dobrou všem v ksichtu.

<a id="koncept-category-spec"></a>
#### Category Spec (parametry)

Kategorie může definovat parametry, který dávají smysl právě v ní. Spec je autorita pro:
- co se zobrazí v editoru a jak se to vyplňuje (viz [Draft](#koncept-draft)),
- co dává smysl filtrovat ve feedu (viz [Feed](#koncept-feed)).

Parametr má:
- identifikátor,
- typ (text / enum / number / bool / date …),
- režim filtru: **nefilterovatelný** / **equality** / **range**.

Range filtry jsou vědomý rozhodnutí. Když je zavedu, beru na sebe odpovědnost za výkon i UX.

Related:
- [Draft](#koncept-draft)
- [Feed](#koncept-feed)

---

<a id="koncept-seasons"></a>
### Seasons
← [předchozí](#koncept-kategorie) | [další](#koncept-lokace) →

Seasons jsou sezónní „kategorie“ — interní marketingovej tah, kterej má přimět lidi chodit prodávat a nakupovat ve správnej čas.
Není to reklama ani tracking. Je to interní sezónní režim UI a distribuce uvnitř produktu.

Kontrakt:
- Seasons nejsou novej systém. Je to jen **předdefinovaná sada** v rámci stávajících [Kategorií](#koncept-kategorie).
- Pro uživatele se to chová jako normální kategorie: vybere ji při tvorbě inzerátu nebo si podle ní postaví feed.
- V sezóně je budu zvýrazňovat v UI, mimo sezónu můžou zůstat jen jako běžný kategorie.

Příklady (orientačně):
- Vánoce, Valentýn, Velikonoce, Halloween
- Zima, Jaro, Léto, Podzim
- Začátek školy, Maturita

Related:
- [Kategorie](#koncept-kategorie)
- [Feed](#koncept-feed)
- [Inzerát](#koncept-inzerat)

---

<a id="koncept-lokace"></a>
### Lokace
← [předchozí](#koncept-seasons) | [další](#koncept-uploady) →

Lokace je autorita na polohu. Neukládám random texty typu „u Pepy na rohu“. Když se bavíme o poloze, bavíme se o jednom konkrétním záznamu, na kterej se dá odkázat.

K čemu lokace slouží:
- [Feed](#koncept-feed): radius, řazení podle vzdálenosti, kontext „domov vs. chalupa“.
- [Inzerát](#koncept-inzerat): povinná poloha jako signál „kde to je“.
- [Transakce](#koncept-transakce): domluva místa předání jako strukturovaná informace (ne román ve zprávě).

Kontrakt:
- Vstup od uživatele vždycky protáhnu geolokační službou, která vrátí autoritativní záznam a garantuje existenci vstupu.
- Lokace je veřejnej signál. Když ji zadáváš, dáváš ven informaci, která může vést k fyzický návštěvě.
- Míň přesnosti může být víc bezpečnosti. Kdo chce být opatrnej, nesmí být nucenej dávat „pin na dveře“.

Related:
- [Feed](#koncept-feed)
- [Inzerát](#koncept-inzerat)
- [Transakce](#koncept-transakce)

---

<a id="koncept-uploady"></a>
### Uploady
← [předchozí](#koncept-lokace) | [další](#koncept-galerie) →

Upload je centrální záznam pro soubor (hlavně fotky). Je to autorita na „tenhle soubor existuje a má tyhle metadata“. Nechci, aby se soubory válely po systému jako náhodný URLčka bez kontextu.

Kde se uploady používají:
- galerie [Inzerátu](#koncept-inzerat),
- přílohy ve [Zprávách](#koncept-zpravy).

Kontrakt životnosti (důležitý):
- Uploady (UGC) žijou na externí CDN. V systému držím autoritu a metadata, ne soubory samotný.
- Upload nemá vlastní TTL.
- Životnost vždycky řídí rodič:
  - inzerát → fotky žijí s inzerátem (paměť trhu),
  - transakce → přílohy žijí s transakcí a mizí při jejím hard delete (viz [Transakce](#koncept-transakce)).

Related:
- [Inzerátu](#koncept-inzerat)
- [Zprávách](#koncept-zpravy)
- [Transakce](#koncept-transakce)

---

<a id="koncept-galerie"></a>
### Galerie
← [předchozí](#koncept-uploady) | [další](#koncept-inzerat) →

Galerie je seřazenej balík uploadů. Je to způsob, jak říct „tyhle fotky patří k sobě a tohle je jejich pořadí“.

Kontrakt:
- Galerie drží jen reference na [Uploady](#koncept-uploady) + pořadí. Nic víc.
- Pořadí je význam: první fotka = cover.
- Životnost galerie řídí rodič (typicky [Inzerát](#koncept-inzerat)); sama o sobě nemá TTL.

Related:
- [Uploady](#koncept-uploady)
- [Inzerát](#koncept-inzerat)
- [Zprávy](#koncept-zpravy)

---

<a id="koncept-inzerat"></a>
### Inzerát
← [předchozí](#koncept-galerie) | [další](#koncept-inzerat-titulek) →

Inzerát je veřejná nabídka v trhu. Je to „to, co ukazuju světu“ — a proto to beru vážně. Všechno, co je v inzerátu, je signál: kvalita, důvěra, bezpečí, očekávání.

Inzerát drží:
- kdo to nabízí (viz [Uživatel](#koncept-uzivatel)),
- v jakým kontextu to dává smysl (viz [Kategorie](#koncept-kategorie)),
- kde to je (viz [Lokace](#koncept-lokace)),
- jak to vypadá (viz [Uploady](#koncept-uploady)),
- cenu a podmínky (viz [Ekonomika](#ekonomika)).

Vztahy:
- Inzerát se publikuje z [Draftu](#koncept-draft). Editace je řízená přes draft, ne přímým „přepiš cokoliv kdykoliv“.
- Inzerát se distribuuje do [Feedu](#koncept-feed).
- Inzerát může skončit v [Transakci](#koncept-transakce).

Kontrakt:
- Inzerát je veřejnej závazek. Když něco slíbím v inzerátu, beru to jako dluh vůči druhý straně.
- Inzerát musí být čitelnej bez „doptávání ve zprávách“. Zprávy jsou na domluvu, ne na dohledávání základů. (Viz [Zprávy](#koncept-zpravy).)
- Stav inzerátu je tvrdý enum. To je autorita. Žádný vibe: `live` / `expired` / `closed` / `sold` / `banned`.

| Stav      | Co to znamená                                      | Feed (default)                                    | Přímý odkaz / detail | Interakce                                         |
| --------- | -------------------------------------------------- | ------------------------------------------------- | -------------------- | ------------------------------------------------- |
| `live`    | aktivní, k dispozici pro nový obchod               | ano                                               | ano                  | vše relevantní (zájem, ignor, oblíbené, flag…)    |
| `expired` | vypršela expirace (`expiresAt`), automatický konec | ne (jen přes explicitní filtr / historický režim) | ano (read-only)      | zakázáno, výjimka **flag**                        |
| `closed`  | prodejce to ručně zabil                            | ne (stejně jako `expired`)                        | ano (read-only)      | zakázáno, výjimka **flag**                        |
| `sold`    | prodáno, není k dispozici pro nový obchod          | ne (není k dispozici)                             | ano (read-only)      | zájem ne; bezpečný věci typu flag / undo ignor ok |
| `banned`  | admin hard removal (nelegální/škodlivý obsah)      | ne                                                | **404** (hard block) | zakázáno                                          |

Poznámky:
- [Draft](#koncept-draft) není stav inzerátu. Draft je separátní entita.
- `deleted` neexistuje. Inzeráty nemažu. Jen mění stav. Paměť trhu je záměr.
- `sold` se **nepočítá** jako aktivní (viz [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu)).
- `sold` je explicitní přepnutí stavu. Vzniká buď:
  - v rámci transakce klikem na `resolved`,
  - nebo ručně na detailu inzerátu tlačítkem `sold` (externí prodej).
- Když se inzerát přepne do `sold`, systém všechny ostatní rozjetý transakce nad tímhle inzerátem automaticky přepne do stavu `sold` (jasný „už prodáno“).

Related:
- [Uživatel](#koncept-uzivatel)
- [Kategorie](#koncept-kategorie)
- [Lokace](#koncept-lokace)
- [Uploady](#koncept-uploady)
- [Ekonomika](#ekonomika)
- [Draftu](#koncept-draft)

---

<a id="koncept-inzerat-titulek"></a>
### Inzerát: Titulek
← [předchozí](#koncept-inzerat) | [další](#koncept-inzerat-cena) →

Titulek je krátkej a jasnej popis toho, co prodáváš. Má člověku ve feedu okamžitě říct, jestli ho to zajímá.

Pravidla:
- Jedna věc = jeden titulek.
- Žádný keyword spam.
- Upřímnost > hype.

Technická pravda:
- **Titulek je jediný text, podle kterého se dá hledat.** Textový hledání stojí na titulku.

Related:
- [Inzerát](#koncept-inzerat)
- [Inzerát: Popis](#koncept-inzerat-popis)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)

---

<a id="koncept-inzerat-cena"></a>
### Inzerát: Cena
← [předchozí](#koncept-inzerat-titulek) | [další](#koncept-inzerat-delivery) →

Cena je povinná. Typ ceny jen říká, jak pevně se prodávající té částky drží. Nesmí vzniknout mlha typu „piš mi do zpráv“.

Položky:
- **Cena**: konkrétní částka.
- **Typ ceny**: postoj pro domluvu.

Typ ceny:
- `closed` = pevná cena („nesmlouvám“)
- `open` = výchozí cena („můžeme se domluvit“)
- `offer` = představa prodávajícího („takovou mám představu, nabídni mi“)

Tvrdý pravidlo:
- U všech typů ceny (`closed`, `open`, `offer`) je konkrétní částka povinná.
- `offer` není „bez ceny“. Je to cenová představa prodávajícího a výzva, aby kupující přišel s vlastní nabídkou.
- `offer` nesmí být maskovaný „dohodou“ bordel. Musí být jasně pojmenovaný v UI i ve feedu, aby kupující předem věděl, do čeho leze.

Related:
- [Inzerát](#koncept-inzerat)
- [Kategorie](#koncept-kategorie)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)

---

<a id="koncept-inzerat-delivery"></a>
### Inzerát: Předání
← [předchozí](#koncept-inzerat-cena) | [další](#koncept-inzerat-warranty) →

Způsob předání je dobrovolnej signál. Ne závazek a ne „logistika modul“. Kupující hned ví, jak si to zhruba představuju, a nemusí se ptát na základní věci.

Enum hodnot:
| Hodnota | Enum       | Poznámka                                       |
| ------- | ---------- | ---------------------------------------------- |
| Osobně  | `personal` | defaultní „sousedský“ režim                    |
| Pošta   | `post`     | dopis/pošta obecně                             |
| Balík   | `package`  | balík / kurýr / zásilkovna (typ, ne integrace) |
| Jinak   | `other`    | cokoliv mimo standard                          |

Kontrakt:
- Předání je preference, ne smlouva.
- Ve feedu/hledání to slouží jako filtr.
- Platforma nevynucuje logistiku ani nedělá „garanci doručení“.
- Lokace neurčuje způsob předání: lokace je kontext „kde to je“, ne logistickej závazek.

Related:
- [Inzerát](#koncept-inzerat)
- [Lokace](#koncept-lokace)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Transakce](#koncept-transakce)

---

<a id="koncept-inzerat-warranty"></a>
### Inzerát: Záruka
← [předchozí](#koncept-inzerat-delivery) | [další](#koncept-inzerat-stav) →

Záruka je dobrovolnej signál. Řeší jednu otázku: „Je to v záruce?“ Platforma do toho nijak nevstupuje. Neověřuju to, negarantuju to, nesoudím to. Je to mezi lidma.

Enum hodnot:
| Hodnota        | Enum          | Význam                              | Příklad                    |
| -------------- | ------------- | ----------------------------------- | -------------------------- |
| Bez záruky     | `no-warranty` | nic nenabízím                       | „kupuješ jak stojí a leží“ |
| Vlastní záruka | `custom`      | něco mimo zákon                     | „7 dní na vyzkoušení“      |
| Zákonná záruka | `warranty`    | typicky účtenka / doložitelný nákup | „mám účtenku“              |

Použití:
- Je to filtr ve feedu/hledání.
- Není to „garance“ od platformy.

Related:
- [Inzerát](#koncept-inzerat)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)

---

<a id="koncept-inzerat-stav"></a>
### Inzerát: Stav (A–F)
← [předchozí](#koncept-inzerat-warranty) | [další](#koncept-inzerat-stari) →

Stav je rychlej signál „v jaký kondici to je“. Nechci romány v popisu jen proto, aby někdo zjistil, jestli je to omlácený.

Kontrakt:
- Je to self-report prodejce. Platforma to neověřuje.
- Používá se jako filtr ve feedu/hledání.
- Není to morální soud. Je to popis reality.

Škála:
| Hodnota | Význam      |
| ------- | ----------- |
| A       | top stav    |
| B       | velmi dobrý |
| C       | ok / průměr |
| D       | slabší      |
| E       | špatný      |
| F       | nejhorší    |

Related:
- [Inzerát](#koncept-inzerat)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)

---

<a id="koncept-inzerat-stari"></a>
### Inzerát: Stáří (A–F)
← [předchozí](#koncept-inzerat-stav) | [další](#koncept-inzerat-popis) →

Stáří je rychlej signál „jak starý to je“. Zase: nechci slohovky a dohady, chci jeden krátkej fakt.

Kontrakt:
- Je to self-report prodejce. Platforma to neověřuje.
- Používá se jako filtr ve feedu/hledání.
- Je to stáří věci, ne stáří účtu.

Škála:
| Hodnota | Význam                       |
| ------- | ---------------------------- |
| A       | nový / skoro nový            |
| B       | málo používaný               |
| C       | běžně používaný              |
| D       | starší                       |
| E       | hodně starý                  |
| F       | konec životnosti (na dožití) |

Related:
- [Inzerát](#koncept-inzerat)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)

---

<a id="koncept-inzerat-popis"></a>
### Inzerát: Popis
← [předchozí](#koncept-inzerat-stari) | [další](#koncept-inzerat-pros-cons) →

Popis je dobrovolnej. A je to záměr. Nechci, aby lidi psali slohovky jen proto, že „se to sluší“.

Pravidla:
- Popis je v **Markdownu** (volitelně).
- Popis se **nepoužívá pro vyhledávání / indexaci**. Hledání stojí na [Titulku](#koncept-inzerat-titulek) a strukturovanejch filtrech.
- Méně je často víc: krátký konkrétní body > dlouhej příběh.

Kontrakt:
- Popis je informativní vrstva pro detail: „co se nevešlo do struktury“.

Related:
- [Inzerát](#koncept-inzerat)
- [Kategorie](#koncept-kategorie)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)

---

<a id="koncept-inzerat-pros-cons"></a>
### Inzerát: Co chci vyzdvihnout / Chci být upřímný
← [předchozí](#koncept-inzerat-popis) | [další](#koncept-inzerat-video) →

Tohle není feature pro coverage. Tohle je kulturní signál.

Na většině marketplace se lidi učí jedno: nalešti to, zamlč to, hlavně ať to projde. Já chci opak: aby bylo normální napsat i věc, která se ti úplně nehodí do krámu. Nehraju si na svatýho — je to pragmatika: dlouhodobě to zvedá důvěru a snižuje toxický dohady.

Sekce:
- **Co chci vyzdvihnout** (pozitiva)
- **Chci být upřímný** (negativa / limity / vady)

Kontrakt:
- Obojí je dobrovolný.
- Každá strana má limit **max 5 položek** (mantinel proti balastu, tlak na podstatný věci).
- Krátký, konkrétní, lidský texty. Žádný „pros/cons“, žádnej korporát.
- Nic se za to neměří. Žádný odměny ani tresty.

Related:
- [Inzerát](#koncept-inzerat)
- [Inzerát: Popis](#koncept-inzerat-popis)
- [Palce](#koncept-palce)

---

<a id="koncept-inzerat-video"></a>
### Inzerát: Video (ne)
← [předchozí](#koncept-inzerat-pros-cons) | [další](#koncept-inzerat-brand) →

Video je v 95 % případů šum, ne hodnota. A technicky je to černá díra na náklady.

Rozhodnutí:
- Upload videí k inzerátům **nepodporuju**.

Důvody:
- většina lidí to použije nekvalitně a rozbije feed
- infra náklady (upload, storage, CDN, transkódování, preview, mazání) jsou velký
- přínos je úzkej a kontextovej

Related:
- [Inzerát](#koncept-inzerat)
- [Uploady](#koncept-uploady)
- [Galerie](#koncept-galerie)

---

<a id="koncept-inzerat-brand"></a>
### Inzerát: Brand
← [předchozí](#koncept-inzerat-video) | [další](#koncept-draft) →

Brand je volitelná identita prodejce. Je to handle/slug, kterej jde sdílet jako link nebo zadat do vyhledávání.

Kontrakt:
- Brand nastavím na profilu jako unikátní slug.
- Brand se u inzerátu/detailu zobrazuje jen když mám aktivní **Brand pass**.
- Brand jde použít jako filtr (vyhledání/otevření feedu už s filtrem na Brand).

Brány:
- Brand nikdy neobchází [Citlivost](#koncept-citlivost-inzeratu), [Ignor](#koncept-ignorace-inzeratu) ani pravidla listingu.

Expirace:
- Po vypršení Brand passu se Brand přestane zobrazovat a nejde ho najít přímým vyhledáváním.
- Když Brand dlouhodobě neobnovím, po **1 měsíci** se uvolní pro někoho dalšího.

Related:
- [Inzerát](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Pass](#koncept-pass)
- [Ekonomika](#ekonomika)

---

<a id="koncept-draft"></a>
### Draft
← [předchozí](#koncept-inzerat-brand) | [další](#koncept-feed) →

Draft je vstupní bod tvorby. Inzerát nenechám vzniknout „kliknutím“. Vzniká až publikací Draftu. (Viz [Inzerát](#koncept-inzerat).)

Co je Draft:
- kopie atributů budoucího inzerátu „ve stavu zrodu“,
- postupná tvorba bez stresu (autosave),
- seznam rozpracovaných věcí (a časem z toho přirozeně vzniknou šablony / kopírování).

Co Draft není:
- není to stav inzerátu,
- není to skladiště nedodělků bez konce.

UX kontrakt:
- když narazíš na **Draft Gate** (limit aktivních inzerátů), místo editoru dostaneš Status a dál už je to jen odemknutí přes [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu).
- editor je jedna souvislá činnost. Žádnej wizard, žádný „krok 3/9“, žádný ztrácení kontextu.
- sekce jsou klikací karty: stavovej řádek (vyplněno/čeká/nastavit) + edit.
- vyplněná věc se vizuálně uklidní: nevyplněné má attention, hotový spadne do neutrálu.
- položky jsou ve třech blocích: nutné pro zveřejnění / podle kategorie / další volby.
- autosave je povinnost. Návrat/back je vždycky bezpečnej.
- editor je otevřenej a ne-lineární. Žádná „povinná cesta“.
- smazání draftu je dvoufázově inline (ne modalovej cirkus).

Related:
- [Inzerát](#koncept-inzerat)
- [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu)

---

<a id="koncept-feed"></a>
### Feed
← [předchozí](#koncept-draft) | [další](#koncept-hledat) →

Feed je uložené nastavení filtru nad inzeráty. Není to „seznam“, je to **předpis**: „co chci vidět a odkud“.

Co feed nese:
- filtry (kategorie, parametry, cena… — viz [Kategorie](#koncept-kategorie)),
- radius + vlastní lokaci (např. „domov“ vs „chalupa“ — viz [Lokace](#koncept-lokace)),
- řazení (v rámci pravidel systému).

Typy feedu:
- `user` = vědomě uložený feed („můj seznam“),
- `search` = systémový kontext hledání (UI zkratka), není to „můj seznam“.

Pravidla:
- limity feedů a chování „nad limitem“ řeším v [Limit počtu feedů](#koncept-limit-poctu-feedu),
- defaultně zakládám uživateli jeden obecný feed bez filtrů (bezpečná návratová volba),
- „Hledání“ je systémově special-case instance Feedu, ne jiný datový svět,
- feed nikdy neobchází globální brány (viz [Citlivost](#koncept-citlivost-inzeratu), [Ignor](#koncept-ignorace-inzeratu), stav [Inzerátu](#koncept-inzerat), [Release window](#koncept-release-window)… — pravidla listingu drží [Seznam inzerátů](#koncept-seznam-inzeratu)).

Related:
- [Kategorie](#koncept-kategorie)
- [Lokace](#koncept-lokace)
- [Limit počtu feedů](#koncept-limit-poctu-feedu)
- [Citlivost](#koncept-citlivost-inzeratu)
- [Ignor](#koncept-ignorace-inzeratu)
- [Inzerátu](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Řazení inzerátů](#koncept-razeni-inzeratu)

---

<a id="koncept-hledat"></a>
### Hledat
← [předchozí](#koncept-feed) | [další](#koncept-seznam-inzeratu) →

Hledat je samostatná primární sekce. UXově to není „feed“, ale **vyhledávací kontext** postavenej nad stejným enginem jako [Feed](#koncept-feed) (stejný filtry, stejnej list UI, žádná speciální magie).

`search` jako systémový kontext:
- V systému existuje feed typu `search`.
- `search` je singleton: max 1 instance na účet.
- `search` se nezobrazuje v „Moje seznamy“ a uživatel ho nespravuje jako normální feed.
- `search` je mimo limity: nezabírá slot (limity se týkají jen `user` feedů — viz [Limit počtu feedů](#koncept-limit-poctu-feedu)).

Kontrakt:
- `search` si pamatuje poslední stav Hledat (dotaz, filtry, radius, lokaci, řazení…), aby návrat nebyl opruz.
- Výsledky jsou normální seznam: pravidla listingu drží [Seznam inzerátů](#koncept-seznam-inzeratu).
- Brány se neobchází: [Citlivost](#koncept-citlivost-inzeratu) a [Ignor](#koncept-ignorace-inzeratu) platí stejně.

„Uložit jako feed“:
- vytvoří nový feed typu `user`,
- objeví se v „Moje seznamy“,
- **počítá se do limitu**.
- Když jsi na limitu, ukládání bloknu jasným důvodem, ale Hledat funguje dál.

Reset:
- Hledat má vždy rychlou akci „Reset“ (vrátí dotaz/filtry do neutrálu). Bez modalů, bez výčitek.
- Reset smaže původní `search` feed a vytvoří novej (singleton zůstává 1× na účet).

Related:
- [Feed](#koncept-feed)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Limit počtu feedů](#koncept-limit-poctu-feedu)
- [Citlivost](#koncept-citlivost-inzeratu)
- [Ignor](#koncept-ignorace-inzeratu)

---

<a id="koncept-seznam-inzeratu"></a>
### Seznam inzerátů
← [předchozí](#koncept-hledat) | [další](#koncept-multi-category) →

„Seznam“ není stránka. Seznam je vždycky **výsledek dotazu** ([Feed](#koncept-feed) / hledání). Jeden engine, jeden kontrakt.

Listing vs detail:
- **Listing (seznam)**: inzerát buď projde filtrem, nebo vypadne.
- **Detail (přímý odkaz)**: detail se má dát otevřít i mimo seznam (sdílení, historie, uložený link).

Tvrdý pravidlo:
- Jen [Citlivost](#koncept-citlivost-inzeratu) (uživatelská) a **admin hard removal** (výjimečná stopka, stav `banned` — viz [Ban](#koncept-ban)) smí blokovat detail a vrátit **404**. Žádný „aspoň víš, že to existuje“.

Ostatní brány jsou pravidla listingu (ne zákaz otevření):
- ignor,
- životní cyklus [Inzerátu](#koncept-inzerat) (`expired` / `closed` / `sold`),
- discovery režim [Kategorie](#koncept-kategorie) (`explicit` se zobrazí jen při vědomém category filtru),
- [Release window](#koncept-release-window),
- anti-topper a podobný mechaniky pořadí.

Co se v listingu defaultně neukazuje:
- `expired` a `closed` (jen přes vědomej filtr / historickej režim),
- `sold` (není k dispozici),
- inzeráty v kategoriích s discovery režimem `explicit`, pokud dotaz nemá konkrétní category filtr.

Explicitní category filtr znamená, že dotaz obsahuje konkrétní kategorii nebo seznam kategorií. Prázdnej seznam kategorií se bere jako „bez category filtru“, takže pořád platí jen `implicit`.

Veřejný listing má pevný citlivostní strop: můžou se v něm objevit jen inzeráty s výslednou citlivostí `none` nebo `adult-relaxed`. Tenhle strop nejde uživatelsky ovlivnit ani obejít category filtrem.

Kontrakt detailu mimo `live`:
- Detail se otevře (krom citlivosti), ale je read-only a místo „Mám zájem“ ukážu jasnej status („Už není dostupný“). UI má být fér.

Hard limit listingu:
- Max **200** inzerátů na dotaz. Když chceš víc, zúž filtr. Hotovo.

Related:
- [Feed](#koncept-feed)
- [Citlivost](#koncept-citlivost-inzeratu)
- [Inzerátu](#koncept-inzerat)
- [Řazení inzerátů](#koncept-razeni-inzeratu)

---

<a id="koncept-razeni-inzeratu"></a>
### Řazení inzerátů
← [předchozí](#koncept-seznam-inzeratu) | [další](#koncept-release-window) →

Řazení je věc uživatele. Ve [Feedu](#koncept-feed) si nakliká, co pro něj dává smysl (typicky „nejnovější“, „nejblíž“), a engine to respektuje v rámci pravidel systému.

Výjimky z řazení (vědomě):
- [Top](#koncept-top) – inzeráty s aktivním Top passem mají přednost v rámci dotazu; když má víc inzerátů Top, rozhoduje novější aktivace passu.
- [Top Maxxi](#koncept-top-maxxi) – ještě silnější zvýraznění; při kolizi více inzerátů s Top Maxxi zase vyhrává novější aktivace passu.

Všechno ostatní (Citlivost, životní cyklus inzerátu, Release window, Anti-topper…) jen omezuje **kandidáty** pro seznam nebo mění jejich viditelnost, ale nemá si „tajně ohýbat“ uživatelské řazení.

Related:
- [Feed](#koncept-feed)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Top](#koncept-top)
- [Top Maxxi](#koncept-top-maxxi)

---

<a id="koncept-release-window"></a>
### Release window
← [předchozí](#koncept-seznam-inzeratu) | [další](#koncept-multi-category) →

Release window je systémové zpoždění nalezitelnosti inzerátu ve feedu. Inzerát existuje a přímé odkazy fungují normálně, ale pro většinu lidí se ve feedu objeví až po čase.

Release window není vlastní perk ani oprávnění, které by někdo „získal“. Je to jen popis mechaniky, kterou může pro kupujícího obejít [Early Discovery](#koncept-early-discovery), nebo pro konkrétní inzerát všem zrušit [Early Delivery](#koncept-early-delivery).

Kontrakt:
- Defaultně platí release window = **+12 hodin** od `availableAt` nad inzerátem.
- `availableAt` je autorita pro to, od kdy se počítá běžná nalezitelnost ve feedu.
- Release window se spustí od `availableAt` a je **neměnný** (krom pravidel Early Discovery/Early Delivery).
- Release window je jen nalezitelnost ve feedu/listingu. **Neresetuje ani neodkládá** `expiresAt`.
- Neexistuje publish/republish.
- Kdo má [Early Discovery](#koncept-early-discovery), release window ignoruje a vidí ve feedu všechno hned.
- Když prodejce použije [Early Delivery](#koncept-early-delivery), release window se pro ten inzerát ruší pro všechny (feed ho najde hned).
- Kupující s Early Discovery nemá proti Early Delivery další bonus; nic se nestackuje.
- Release window je pravidlo feedu/listingu. Ostatní brány (hlavně [Citlivost](#koncept-citlivost-inzeratu)) platí pořád.

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Early Discovery](#koncept-early-discovery)
- [Early Delivery](#koncept-early-delivery)
- [Ekonomika](#ekonomika)

---

<a id="koncept-multi-category"></a>
### Multi-Category
← [předchozí](#koncept-release-window) | [další](#koncept-oblibene) →

Multi-Category je **distribuce**, ne duplikace. Nevznikají žádné kopie inzerátu. Jen rozšířím množinu kategorií, přes který se může zobrazit.

Kontrakt:
- Inzerát má jednu **primární kategorii** (autorita pro UI, jazyk a Category Spec).
- Multi-Category přidá k primární až **2 sekundární** kategorie (čistě distribuční).
- Sekundární kategorie nejsou cesta, jak si vybrat „výhodnější“ atributy. Primární je pravda.
- Po skončení oprávnění/passu se nic nemaže a nic se „nezlomí“. Sekundární kategorie zůstávají, jen už nejdou přidávat/změnit nové, dokud nemám aktivní Multi-Category (stejnej pattern jako u [Photo Count](#koncept-limit-poctu-fotek)).
- Všechny kategorie (primární i sekundární) musí patřit do stejné `group` podle [Category](#koncept-category). Multi-Category neumožní míchat kategorie z různých skupin (žádné „všechno všude najednou“).

Viditelnost a deduplikace:
- V rámci jednoho renderovanýho seznamu se inzerát zobrazí **právě jednou**, i když matchuje víc kategorií.
- Po přepnutí do jinýho kontextu (jiný feed/hledání) ho můžeš vidět znovu. To je v pořádku.

Match pravidlo:
- Feed/Hledat, který filtruje kategorii, bere inzerát jako match, když filtr = primární kategorie **nebo** jedna ze sekundárních.

Ekonomika:
- Multi-Category je placený oprávnění. Detaily patří do [Ekonomiky](#ekonomika).

Related:
- [Kategorie](#koncept-kategorie)
- [Inzerát](#koncept-inzerat)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Ekonomika](#ekonomika)

---

<a id="koncept-oblibene"></a>
### Oblíbené
← [předchozí](#koncept-multi-category) | [další](#koncept-citlivost-inzeratu) →

Oblíbené je moje rychlá paměť. Žádný algoritmy. Jen „tohle si chci držet bokem“.

Kontrakt:
- Je to per-user seznam inzerátů (uloženo/odloženo).
- Je to nezávislý na Feedu: feed je dotaz, oblíbené je konkrétní výběr.
- Není to Ignor: ignor je „nechci to vídat“, oblíbené je „chci se k tomu vrátit“.
- Oblíbené nic neobchází: když si zpřísním [Citlivost](#koncept-citlivost-inzeratu), inzeráty mimo nový maximum z Oblíbených zmizí.

Related:
- [Inzerát](#koncept-inzerat)
- [Feed](#koncept-feed)
- [Ignor](#koncept-ignorace-inzeratu)

---

<a id="koncept-citlivost-inzeratu"></a>
### Citlivost
← [předchozí](#koncept-oblibene) | [další](#koncept-ignorace-inzeratu) →

Obsah není jen „co prodávám“. Obsah je i to, *jestli to můžeš vůbec vidět*. **Citlivost** je hard gate: chrání veřejnej prostor před obsahem, kterej určitá skupina lidí buď **nechce**, nebo ho **ani nesmí** vidět.

Úrovně (stupňovaně): `none < adult-relaxed < adult < sensitive < restricted`.

| Úroveň             | Enum            | Poznámka                                                                                                                                                                                                                   |
| ------------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Běžný              | `none`          | default                                                                                                                                                                                                                    |
| Pro dospělé        | `adult`         | 18+ kontext                                                                                                                                                                                                                |
| Pro dospělé (soft) | `adult-relaxed` | adult lze odkliknout na základě varovné hlášky (jen pro 18+)                                                                                                                                                              |
| Citlivé            | `sensitive`     | věci „na hraně“, co nechci cpát všem                                                                                                                                                                                       |
| Omezené            | `restricted`    | zákonný omezení / oprávnění (systém ho **neověřuje**); nutná součást ochrany je také běžící cooldown — tzn. člověk musí vědět, co dělá |

Cooldown při zapnutí vyšší úrovně:
- `adult`: 1h
- `sensitive`: 2h
- `restricted`: 24h

Gating a viditelnost (dvoufázově, schválně):
- **Profil** = nastavíš maximum (co *smíš / jsi ochotnej* vidět).
- **Feed/Hledat** = v rámci maxima si **vědomě** zapneš, co *chceš* vidět. (Viz [Feed](#koncept-feed).)

Hard gate pravidla:
- V listingu (feed/search/seznam) se cokoliv nad maximum **vůbec nedostane do výsledků**.
- Veřejný listing má systémové maximum `adult-relaxed`; `adult`, `sensitive` a `restricted` do něj nikdy nelezou.
- Na detail přes přímý odkaz vracím při nesouladu maxima **404** (žádný obcházení přes link, žádný „aspoň víš že to existuje“).
- Nová omezená akce (např. otevření transakce, reakce, metrika viditelnosti) musí respektovat aktuální maximum. Nižší profilová citlivost nesmí spustit akci nad vyšším inzerátem.
- Historický/post-akční přístup je měkčí: když se uživatel k inzerátu legálně dostal dřív (např. existující transakce, seller info v kontextu otevřené interakce), UI může zachovat potřebný kontext i po snížení maxima. To je kontext, ne nová permission k omezené akci.
- **Citlivost** je **jediná uživatelská** věc, která smí detail tvrdě schovat (404). Kromě citlivosti existuje ještě **admin hard removal** (výjimečná stopka pro nelegální/škodlivý obsah), která je **404** a nastavuje stav `banned` (viz [Ban](#koncept-ban) a [Inzerát](#koncept-inzerat)). Ostatní brány můžou ovlivnit seznam, ale nemaj dělat „ten inzerát pro tebe neexistuje“.

Odpovědnost:
- **Citlivost** je primárně sebeoznačení prodejce.
- Opakovaný a zjevný zneužití (maskování citlivýho/omezenýho jako běžný) je porušení pravidel a důvod k zásahu.

Related:
- [Feed](#koncept-feed)
- [Inzerát](#koncept-inzerat)

---

<a id="koncept-ignorace-inzeratu"></a>
### Ignor
← [předchozí](#koncept-citlivost-inzeratu) | [další](#koncept-flag-inzeratu) →

Ignor je osobní úklid. Není to trest, není to report, není to drama.

Co ignor znamená:
- ignorovaný [Inzerát](#koncept-inzerat) je pro uživatele **skrytej ze všech seznamů** ([Feedy](#koncept-feed), hledání),
- ignor **nic nemění globálně** (nepenalizuje prodejce, nikomu se o tom nic nehlásí),
- ignor se propíše do metrik inzerátu jako signál „tohle lidi nechtějí vidět“.

Přímý odkaz:
- ignor nesmí blokovat otevření detailu,
- v detailu je vidět stav „Ignoruješ“ + akce „Zrušit ignor“.

Parametr listingu:
- feed i hledání podporují `withIgnored`:
  - `false` (default) = ignorované se nezobrazují,
  - `true` = ignorované se zobrazují (např. kontrola).

Scope:
- ignor je globální per-user (napříč zařízeními),
- je to per-user doménovej stav (ne anonymní analytika).

Ignor není [Flag inzerátu](#koncept-flag-inzeratu):
- ignor = „nezajímá mě to“,
- flag = „porušuje pravidla / ojeb / nebezpečný“.

Related:
- [Inzerát](#koncept-inzerat)
- [Feedy](#koncept-feed)
- [Flag inzerátu](#koncept-flag-inzeratu)

---

<a id="koncept-flag-inzeratu"></a>
### Flag inzerátu
← [předchozí](#koncept-ignorace-inzeratu) | [další](#koncept-flag-uzivatele) →

Flag je „tady je problém“, ne „nelíbí se mi to“. Je to bezpečnostní signál a reputační stopa. Nechci z toho dělat tribunál ani automatickýho soudce.

Kontrakt:
- Jde **jen z detailu** [Inzerátu](#koncept-inzerat) (ne z feedu, ne ze zpráv).
- Je to **toggle**: nahlásit / vzít zpět.
- Žádný důvody ani formuláře — jen čudlík.
- Nemá automatický efekt typu „smazáno“ / „shadowban“ / „auto-ban“.

Co s tím dělám:
- promítá se do metrik (flag rate) a je to signál „něco smrdí“,
- je to signál pro ruční rozhodnutí (ne pro autopilota).

Flag není osobní [Ignor](#koncept-ignorace-inzeratu) (viz definice tam).

Related:
- [Inzerátu](#koncept-inzerat)
- [Ignor](#koncept-ignorace-inzeratu)

---

<a id="koncept-flag-uzivatele"></a>
### Flag uživatele
← [předchozí](#koncept-flag-inzeratu) | [další](#koncept-transakce) →

Nahlásit člověka bez kontextu je toxická zbraň. Proto to gateuju chováním systému.

Kontrakt:
- Je to tvrdá akce dostupná **jen v rámci transakce** a až po `trade`.
- Není to toggle.
- Stejně jako u inzerátu: žádný auto-efekt, jen signál a metrika.

Related:
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Ban](#koncept-ban)

---

<a id="koncept-transakce"></a>
### Transakce
← [předchozí](#koncept-flag-uzivatele) | [další](#koncept-zpravy) →

Transakce je obálka obchodu: stav, pravidla a timeline. Je to **autorita obchodu**. Zprávy nejsou samostatnej paralelní svět; jsou jen jedním typem záznamu uvnitř transaction timeline.

Základní kontrakty:
- 1 transakce = 1 konkrétní inzerát + 1 konkrétní buyer/seller kontext.
- Stavový model je autorita tady v tomhle dokumentu.
- „Zavřeno je zavřeno“: terminal stavy jsou read-only, nejde re-open.
- „Zavřít bez emocí“ je `rejected`: explicitní stopka a hint „OK, tady cesta nevede“. Na začátku transakce to může poslat **prodejce i kupující**.

Stavový model (prakticky):

| Stav       | Kdy                                                                                          | Co je povolený                                                                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `interest` | kupující klikne „Mám zájem“                                                                  | kupující může psát a posílat user-authored záznamy do timeline, ale **jen pro sebe**; prodejce je neuvidí a nedostane z nich notifikace, dokud z toho neudělá obchod; kupující může **couvnout** (zrušit zájem → `rejected`); prodejce jen **Obchod** / **Odmítnout** |
| `trade`    | prodejce otevře obchod                                                                       | prodejci se odkryje dosavadní buyer-side komunikace a dál běží zprávy + strukturovaný widgety pro obě strany                                                     |
| `resolved` | prodejce označí „vyřešeno“                                                                   | tahle transakce běží dál, dokud kupující nedá finále (`success`/`closed`); strukturovaná komunikace se omezí a zůstává jen to, co dává smysl pro dotažení konce    |
| `dispute`  | někdo přepne do sporu                                                                        | běží dál (řeší se), dokud kupující nedá finále (`success`/`closed`)                                                                                              |
| `rejected` | kupující nebo prodejce odmítne („bez emocí“)                                                 | read-only                                                                                                                                                        |
| `sold`     | systémová stopka „už prodáno“                                                                | read-only                                                                                                                                                        |
| `expired`  | transakce vyprší po **3 dnech bez aktivity** (aktivita = cokoliv, co se stane nad transakcí) | read-only                                                                                                                                                        |
| `success`  | kupující potvrdí „dopadlo to“                                                                | read-only                                                                                                                                                        |
| `closed`   | kupující zavře (ukončí pro sebe)                                                             | read-only                                                                                                                                                        |

Poznámky ke koncům:
- `rejected` = někdo odmítl („zavřít bez emocí“) — na začátku to může být i „couvnutí“ kupujícího.
- `closed` = kupující to zavřel z vlastní vůle.
- `sold` = systémová stopka „už prodáno“ (bez emocí, bez dohadů).

Anti-spam a ochrana prodejce:
- Prodejce může zájem **ignorovat bez postihu**. Odpovědnost začíná až obchodem.
- Kupující v `interest` může psát, ale je to **buyer-side buffer**, ne inbox prodejce.
- Zprávy a user-authored záznamy z `interest` se prodejci zobrazí až po `trade`; do té doby prodejce nevidí obsah, náhledy, počet zpráv ani z nich nedostává notifikace.
- Kupující může v `interest` couvnout — a je to signál do metrik (viz [Metrika: Closer rate](#koncept-metrika-closer-rate)).
- Odmítnutí je legitimní volba bez vysvětlování. Žádnej mentální dluh.

Timeline místo chatu:
- Detail transakce je časová osa faktů: systémové stavy + lidská komunikace + strukturovaný záznamy, když je text zbytečnej.
- Timeline nese jak user-authored komunikaci, tak systémové/status události.
- Zpráva není samostatná persisted doména. Je to prostě jeden záznam v transaction timeline.

Retence a čistky:
- Transakce je dočasná věc. Po finálním stavu proběhne úklid ve dvou krocích:
  - hned: mažu všechno citlivý a strukturovaný, co už po konci obchodu nemá důvod žít,
  - po **3 měsících**: hard delete celé transakce (včetně textů a fotek).

Related:
- [Zprávách](#koncept-zpravy)

---

<a id="koncept-zpravy"></a>
### Zprávy
← [předchozí](#koncept-transakce) | [další](#koncept-notifikace) →

„Zprávy“ je lidskej název pro komunikaci uvnitř transakce. Technicky ani produktově to není samostatnej paralelní svět mimo transakci.

Co v transaction timeline žije:
- text pro normální lidskou domluvu,
- galerie jako důkaz nebo doplnění bez slohovky,
- lokace jako strukturovaný fakt,
- balík/tracking jako strukturovaný fakt,
- osobní údaje jako dočasná citlivá věc,
- systémové/status záznamy jako fakt „co se stalo“.

Kontrakt:
- V `interest` může kupující vytvářet user-authored komunikaci bez omezení, ale vidí ji jen kupující.
- `trade` odkryje prodejci buyer-side komunikaci z `interest` a dál dovoluje text i strukturovaný zápisy podle role.
- `dispute` dovoluje text i strukturovaný zápisy podle role.
- `resolved` nechává už jen to, co dává smysl pro dotažení konce.
- Terminal stavy jsou read-only.
- Systémové/status záznamy vznikají automaticky ze změn stavu a nesmí se tvářit jako samostatnej chat.

Tracking (zásilka):
- Tracking není bezpečnostní feature. Je to jen fakt v timeline.
- Tracking number je volitelný.
- Když tracking number není, nic navíc nepíšu.

Retence po ukončení transakce:
- Citlivý a strukturovaný zápisy, který po konci obchodu ztrácí smysl, se po ukončení transakce **mažou**.
- „Ukončení transakce“ = dosažení terminal stavu (`rejected` / `sold` / `expired` / `success` / `closed`).

Related:
- [Lokace](#koncept-lokace)

---

<a id="koncept-notifikace"></a>
### Notifikace (Activity)
← [předchozí](#koncept-zpravy) | [další](#koncept-dispute) →

Notifikace nejsou nástroj na otravování. Jsou to **zrcadlo reality**, aby člověk věděl, co se stalo, a nemusel paranoidně refreshovat appku.

Filosofie ticha:
- Defaultní stav je ticho. Žádný umělý FOMO.
- Notifikace vzniká jen z reálný události (typicky změna stavu [Transakce](#koncept-transakce) nebo příchozí [Zpráva](#koncept-zpravy)).

Activity First:
- Activity je jediný zdroj pravdy pro „co se stalo“.
- Všechno ostatní (push/email) je jen mirror toho, co už existuje v Activity.
- Activity musí umět nést realitu transakce: zprávu od kupujícího, zprávu od prodávajícího, systémovou transaction událost i čistě systémovou událost.

Email jako zrcadlo:
- Email není primární kanál. Je to volitelný forward/digest toho, co už je v Activity.
- Když email nedojde, nic se „neztratilo“. Autorita je Activity.

Kontrakt:
- Notifikace se nesmí stát další paralelní svět. Když něco umím zjistit v Activity, nesmím k tomu psát nový pravidla do emailu/pushe.
- Deduplikace je normální (nebudu spamovat ten samej fakt víckrát, jen protože to jde).
- Activity typ události musí odpovídat tomu, odkud ta věc reálně přišla: buyer / seller / transaction / system. `unknown` je jen nouzovej fallback, ne běžná realita.

Kritické výjimky:
- Některý věci se neptají a jdou vždy (reset hesla, bezpečnostní alerty).

Related:
- [Zprávy](#koncept-zpravy)
- [Transakce](#koncept-transakce)
- [Inzerát](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)

---

<a id="koncept-dispute"></a>
### Dispute
← [předchozí](#koncept-notifikace) | [další](#koncept-automaticke-ukonceni-inzeratu) →

Dispute je hint „něco nesedí a ještě nekončíme“. Není to eskalace ani arbitráž systému.

Kontrakt:
- Dispute může vzniknout až po `resolved`.
- Otevřít ho může kupující i prodávající.
- Dispute:
  - promítá se do metrik obou stran,
  - nemá vliv na karmu,
  - je to normální aktivita v transakci (posouvá časovače stejně jako ostatní akce).

Smysl:
- Otevřením dispute se transakce vrací do „běžného režimu řešení“: pokračuje se v domluvě, dokud kupující nedá finále (`success` / `closed`).

Related:
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)

---

<a id="koncept-automaticke-ukonceni-inzeratu"></a>
### Automatické ukončení: Inzerát
← [předchozí](#koncept-dispute) | [další](#koncept-pass-delsi-expirace-inzeratu) →

Automatické ukončení je povinná volba. Drží pořádek v nabídce a brání tomu, aby se z feedu stal hřbitov.

Kontrakt:
- Při tvorbě nastavím `expiresAt`.
- Čas se počítá od `createdAt` (vznik inzerátu), ne v draftu.
- Po uplynutí `expiresAt` se inzerát bez aktivní [Kontinuální nabídky](#koncept-kontinualni-nabidka) přepne do `expired`.
- UI u volby ukazuje i konkrétní datum.

Předdefinované volby:
| Volba        | Smysl                                         | Poznámka                                                                                       |
| :----------- | :-------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| Za týden     | „Chci to rychle pustit ven / otestovat zájem“ | default rychlovka                                                                              |
| Za dva týdny | „Dám tomu čas, ale nechci mrtvoly“            | rozumný střed                                                                                  |
| Za měsíc     | „Vím, že to bude trvat“                       | **zpoplatněná volba** (jinak kanibalizuje [Kontinuální nabídku](#koncept-kontinualni-nabidka)) |

„Za měsíc“ je placená volba: odemykám ji přes [Pass: Delší expirace inzerátu](#koncept-pass-delsi-expirace-inzeratu) (aktivace kupónem / benefitem balíčku, autorita je [Ekonomika](#ekonomika)). Je to schválně: kdyby to bylo zdarma, lidi si vyrobí nekonečný inzeráty bez odpovědnosti. [Kontinuální nabídka](#koncept-kontinualni-nabidka) je separátní pass na prodloužení života.

Tyhle dvě věci jdou složit:
- krátký inzerát (týden/dva týdny) + Kontinuální nabídka = delší život,
- „Za měsíc“ + Kontinuální nabídka = **2 měsíce v kuse** (žádnej bump, jen koupená životnost).

Related:
- [Inzerát](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Pass: Delší expirace inzerátu](#koncept-pass-delsi-expirace-inzeratu)
- [Kontinuální nabídka](#koncept-kontinualni-nabidka)
- [Ekonomika](#ekonomika)

---

<a id="koncept-pass-delsi-expirace-inzeratu"></a>
### Pass: Delší expirace inzerátu (Za měsíc)
← [předchozí](#koncept-automaticke-ukonceni-inzeratu) | [další](#koncept-pass-aktivni-inzeraty-20) →

Tenhle [Pass](#koncept-pass) odemyká v expiraci inzerátu placenou volbu „Za měsíc“. Není to bump, není to republish. Je to jen delší `expiresAt`.

Kontrakt:
- Bez aktivního passu se „Za měsíc“ v UI nenabízí.
- Pass je časově omezený a vzniká přes [Aktivaci](#koncept-aktivace) (typicky [Kupón](#koncept-kupon) → pass).
- Pass nemění `createdAt`, nemění [Release window](#koncept-release-window) a nemění řazení. Je to jen delší život inzerátu.
- Používá se v expiraci inzerátu (autorita je [Automatické ukončení: Inzerát](#koncept-automaticke-ukonceni-inzeratu)).

Related:
- [Automatické ukončení: Inzerát](#koncept-automaticke-ukonceni-inzeratu)
- [Pass](#koncept-pass)
- [Kupón](#koncept-kupon)
- [Aktivace](#koncept-aktivace)
- [Ekonomika](#ekonomika)

---

<a id="koncept-pass-aktivni-inzeraty-20"></a>
### Pass: Aktivní inzeráty +20
← [předchozí](#koncept-pass-delsi-expirace-inzeratu) | [další](#koncept-automaticke-ukonceni-transakce) →

Tenhle [Pass](#koncept-pass) odemyká **+20 aktivních inzerátů** navíc k základnímu limitu (viz [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu)).

Kontrakt:
- Pass je časově omezený (1 měsíc) a vzniká přes [Aktivaci](#koncept-aktivace) (typicky [Kupón](#koncept-kupon) → pass).
- Základní limit aktivních inzerátů (např. 10 pro free tier) **není možné stackovat** — vždy platí jen jeden základní limit podle tieru předplatného.
- Pass přidává fixní bonus +20 k aktuálnímu základnímu limitu.
- Po skončení passu se nic nemaže — existující `live` inzeráty zůstávají, jen už nejdou vytvořit/publikovat nové, dokud není limit odemčený znovu.

Ekonomika:
- Cena: 140 Tokenů (viz [Ceník rozšíření](#ekonomika-cenik-rozsireni)).

Related:
- [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu)
- [Pass](#koncept-pass)
- [Kupón](#koncept-kupon)
- [Aktivace](#koncept-aktivace)
- [Ekonomika](#ekonomika)

---

<a id="koncept-automaticke-ukonceni-transakce"></a>
### Automatické ukončení: Transakce
← [předchozí](#koncept-pass-aktivni-inzeraty-20) | [další](#koncept-limit-poctu-feedu) →

Nechci nedotažený transakce žít navěky. Když se obchod nerozjede nebo se nedotáhne a nikdo ho explicitně neuzavře, transakce vyprší.

Kontrakt:
- Transakce vyprší defaultně za **3 dny bez aktivity**.
- Aktivita = **jakákoli aktivita nad transakcí** (user-authored komunikace i systémové/status události).
- Vypršení přepne transakci do `expired` (read-only).
- `expired` je finální stav: žádný re-open.
- Vypršení je systémová akce → v [User Eventech](#koncept-user-eventy) vzniká `transaction.expired`.
- Čistky a retence se řídí pravidly v [Transakci](#koncept-transakce) a [Zprávách](#koncept-zpravy).

Related:
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)

---

<a id="koncept-limit-poctu-feedu"></a>
### Limit počtu feedů
← [předchozí](#koncept-automaticke-ukonceni-transakce) | [další](#koncept-limit-poctu-fotek) →

Limit není trest. Je to mantinel, aby se z toho nestal inventář nekonečna.

Kontrakt:
- Do limitu se počítají jen feedy typu `user` (uložený „moje seznamy“).
- `search` je mimo limity (nezabírá slot).
- Když jsi nad limitem, feedy nemažu. Jen ty nadlimitní v UI skryju/disable (existují, ale uživatel ví, že je má navíc).

Related:
- [Ceník](#koncept-cenik)
- [Aktivace](#koncept-aktivace)

---

<a id="koncept-limit-poctu-fotek"></a>
### Limit počtu fotek nad inzerátem
← [předchozí](#koncept-limit-poctu-feedu) | [další](#koncept-limit-aktivnich-inzeratu) →

Fotky jsou primární obsah inzerátu. Limit fotek je brzda proti šumu a zároveň jasný místo, kam se dá férově navázat „komfort navíc“.

Kontrakt:
- Defaultně držím krátkou galerii (baseline je **3 fotky**).
- Navýšení je oprávnění přes [Ekonomiku](#ekonomika): typicky `Photo Count` ([Kupón](#koncept-kupon) → [Pass](#koncept-pass)) = **+2 fotky na 1 měsíc**.
- Po skončení [Passu](#koncept-pass) se už nahraný fotky nemažou. Zůstávají beze změny — jen znovu platí aktuální limit pro další přidávání.
- V balíčcích se to může projevit jako vyšší strop (např. **3 → 5**, u Pro i víc).

Related:
- [Ekonomiku](#ekonomika)
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)

---

<a id="koncept-limit-aktivnich-inzeratu"></a>
### Limit aktivních inzerátů
← [předchozí](#koncept-limit-poctu-fotek) | [další](#koncept-palce) →

Limit aktivních inzerátů drží hygienu trhu a chrání pozornost. Nechci, aby se z feedu stal hřbitov a z prodejce správce inventáře.

Kontrakt:
- Počítám jen inzeráty ve stavu `live`.
- `sold` a `banned` se nepočítají jako aktivní.
- Když jsi nad limitem (typicky po vypršení [Passu](#koncept-pass)), existující `live` nechám běžet.
- Jen nepustím vytvořit/publikovat další `live` — aktivuje se **Draft Gate** (viz [Draft](#koncept-draft)).
- Odemknutí limitu je přes [Ekonomiku](#ekonomika): [Kupón](#koncept-kupon)/pas (typicky tier `Aktivní inzeráty 10/20`), nebo [Tokeny](#koncept-tokeny) v hodnotě toho kupónu.

Related:
- [Passu](#koncept-pass)
- [Draft](#koncept-draft)
- [Ekonomiku](#ekonomika)
- [Kupón](#koncept-kupon)
- [Tokeny](#koncept-tokeny)

---

<a id="koncept-palce"></a>
### Palce (Like/Dislike)
← [předchozí](#koncept-limit-aktivnich-inzeratu) | [další](#koncept-karma) →

Palce jsou signál „tahle nabídka je / není atraktivní“. Nejde o morální soud nad prodejcem.

Kontrakt:
- Palce jsou per-inzerát (Like/Dislike).
- Je to toggle: kdykoliv to můžu změnit (like/dislike/žádný).
- Nejsou veřejný ego-lajky. Je to data pro produkt a pro prodávajícího.

Related:
- [Inzerát](#koncept-inzerat)

---

<a id="koncept-karma"></a>
### Karma (Like/Dislike)
← [předchozí](#koncept-palce) | [další](#koncept-xp) →

Karma je hodnocení člověka v kontextu konkrétní transakce. Žádný hvězdičky, žádnej román.

Kontrakt:
- Karma existuje jen v rámci transakce a až po `trade`.
- Dvě volby: Like (Dobrý) / Dislike (Špatný).
- Kdo nehlasuje = neutrál (žádná penalizace za „nechci to řešit“).
- Karma != [Flag uživatele](#koncept-flag-uzivatele). Karma je zkušenost. Flag je průser.

Related:
- [Transakce](#koncept-transakce)
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metrika: Karma](#koncept-metrika-karma)

---

<a id="koncept-xp"></a>
### XP
← [předchozí](#koncept-karma) | [další](#koncept-metrika-karma) →

XP je interní gamifikační bodování, který mi pomáhá popsat „jak moc a jak často“ uživatel appku používá.
XP nesmí být nátlak, FOMO ani nákupní páka: neovlivňuje [Score](#koncept-metrika-score) ani důvěru lidí, je to jen interní signál pro UX.

Kontrakt:
- XP je **per uživatel** a **přičítá se** za vybrané akce.
- Level je **odvozený** z XP (hranice levelů není).
- Některý akce půjdou farmit. Zatím to vědomě toleruju (anti-farm pravidla drží [User Eventy](#koncept-user-eventy)).

Příděl XP:

| Akce               | XP | Poznámka              |
| ------------------ | --- | --------------------- |
| Vytvoření feedu    | 5  | farmitelné (zatím OK) |
| Publikace inzerátu | 25 | farmení složité       |

Related:
- [Feed](#koncept-feed)
- [Inzerát](#koncept-inzerat)

---

<a id="koncept-metrika-karma"></a>
### Metrika: Karma
← [předchozí](#koncept-xp) | [další](#koncept-user-eventy) →

Proč existuje:
- Chci dát prodejci signál „jak se lidem obchodovalo“. Ne román. Jedno kliknutí.

Kontrakt:
- Karma se uděluje v rámci transakce a až po `trade`.
- Je to agregovaná metrika, která se **zobrazuje u prodávajícího** (v rámci jeho metrik).
- Kdo nehlasuje = neutrál.
- Karma není [Flag uživatele](#koncept-flag-uzivatele). Karma je zkušenost. Flag je průser.

Related:
- [Karma](#koncept-karma)
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Transakce](#koncept-transakce)

---

<a id="koncept-user-eventy"></a>
### User Eventy
← [předchozí](#koncept-metrika-karma) | [další](#koncept-metriky-prodavaciho) →

User eventy jsou append-only stopa chování, ze který počítám metriky a score. Nejsou to „cookies analytiky“. Je to doménovej signál „co se stalo“.

Zdrojová data (`user_event`):
| Pole         | Význam                                                               |
| ------------ | -------------------------------------------------------------------- |
| `userId`     | komu se event počítá (na koho se váže metrika)                       |
| `scope`      | `user` = moje akce, `foreign` = akce protistrany, která dopadá na mě |
| `source`     | kontext: `listing` / `transaction`                                   |
| `group`      | skupina/sekvence (typicky `listingId` nebo `transactionId`)          |
| `event`      | typ události (viz níž)                                               |
| `isTerminal` | jestli tímhle eventem sekvence končí (finále skupiny)                |
| `createdAt`  | kdy se to stalo                                                      |

Scope (důležitý kontrakt):
- Když se děje interakce mezi dvěma lidma, zapíšu to **oběma**:
  - pro autora akce jako `scope=user`,
  - pro protistranu jako `scope=foreign`.

Eventy, se kterýma počítám (dnes):
| `source`      | `event`                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `listing`     | `listing.create`, `listing.sold`                                                                                                                                                                        |
| `user`        | `user.active` (heartbeat: 1× za hodinu při pobytu v appce, počítáno od prvního otevření)                                                                                                                |
| `transaction` | `transaction.create`, `transaction.trade`, `transaction.message`, `transaction.resolved`, `transaction.sold`, `transaction.success`, `transaction.rejected`, `transaction.closed`, `transaction.expired` |

Na co to používám:
- výpočet [Metrik prodávajícího](#koncept-metriky-prodavaciho) a [Metrik kupujícího](#koncept-metriky-kupujiciho),
- výpočet [Score (A–F)](#koncept-metrika-score) jako zkratky, která je vždycky dohledatelná přes konkrétní metriky (žádná tajná magie).

Related:
- [Transakce](#koncept-transakce)
- [Inzerát](#koncept-inzerat)
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Metrika: Score (A–F)](#koncept-metrika-score)
- [Komunikace a transparentnost](#komunikace)

---

<a id="koncept-metriky-prodavaciho"></a>
### Metriky prodávajícího
← [předchozí](#koncept-user-eventy) | [další](#koncept-detail-protistrany) →

Proč existují:
- Chci dát kupujícímu **tvrdý signál**, jestli protistrana reálně reaguje a dotahuje věci. Ne „věř mi bro“, ale realita chování.

Přístup: viz [Detail protistrany](#koncept-detail-protistrany).

Kontrakt:
- Metriky jsou signál pro rozhodnutí. Ne automatickej trest.
- Každá metrika má vlastní definici (viz kapitoly níž). Žádná tajná magie.

Zobrazené metriky:
- Datum registrace (zdarma)
- Počet všech inzerátů (zdarma)
- [Metrika: Score (A–F)](#koncept-metrika-score)
- [Metrika: Reakční doba](#koncept-metrika-reakcni-doba)
- [Metrika: Odmítnutí bez interakce](#koncept-metrika-odmitnuti-bez-interakce)
- [Metrika: Resolved rate](#koncept-metrika-resolved-rate)
- [Metrika: Expirace (transakcí)](#koncept-metrika-expirace)
- [Metrika: Vytížení (paralelní obchody)](#koncept-metrika-vytizeni)
- [Metrika: Aktivita](#koncept-metrika-aktivita)
- [Metrika: Flag rate](#koncept-metrika-flag-rate)
- [Metrika: Karma](#koncept-metrika-karma)

Related:
- [Ekonomika](#ekonomika)
- [Transakce](#koncept-transakce)
- [Ban](#koncept-ban)
- [User Eventy](#koncept-user-eventy)

---

<a id="koncept-detail-protistrany"></a>
### Detail protistrany
← [předchozí](#koncept-metriky-prodavaciho) | [další](#koncept-metriky-kupujiciho) →

Detail protistrany není další entita. Je to jen pojmenování situace: dívám se na **druhýho člověka** (jeho základní údaje a metriky) z pozice, ve který zrovna jsem.

Kontrakt:
- Základní údaje a základní metriky (to, co je vypsané u [Metrik prodávajícího](#koncept-metriky-prodavaciho) / [Metrik kupujícího](#koncept-metriky-kupujiciho)) jsou vidět zdarma.
- Rozšířený pohled (rozšířené metriky / detailnější rozpad) odemyká [Pass](#koncept-pass)/[Kupón](#koncept-kupon) definovaný v [Ekonomice](#ekonomika) – v UI jako „Rozšíření: Detail protistrany“.
- S oprávněním ukazuju **[Metrika: Score (A–F)](#koncept-metrika-score)** + sadu metrik podle role (viz [Metriky prodávajícího](#koncept-metriky-prodavaciho) / [Metriky kupujícího](#koncept-metriky-kupujiciho)).
- Co uvidíš záleží na roli:
  - jako kupující vidíš [Metriky prodávajícího](#koncept-metriky-prodavaciho),
  - jako prodávající vidíš [Metriky kupujícího](#koncept-metriky-kupujiciho).

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Ekonomika](#ekonomika)

---

<a id="koncept-metriky-kupujiciho"></a>
### Metriky kupujícího
← [předchozí](#koncept-detail-protistrany) | [další](#koncept-metrika-reakcni-doba) →

Proč existují:
- Chci dát prodávajícímu signál, jestli protistrana obchoduje, nebo jen kliká a nechává věci hnít.

Přístup: viz [Detail protistrany](#koncept-detail-protistrany).

Kontrakt:
- Metriky jsou signál pro očekávání. Ne bič.
- Každá metrika má vlastní definici (viz kapitoly níž).

Zobrazené metriky:
- Datum registrace (zdarma)
- [Metrika: Score (A–F)](#koncept-metrika-score)
- [Metrika: Reakční doba](#koncept-metrika-reakcni-doba)
- [Metrika: Closer rate](#koncept-metrika-closer-rate)
- [Metrika: Decision rate](#koncept-metrika-decision-rate)
- [Metrika: Expirace (transakcí)](#koncept-metrika-expirace)
- [Metrika: Vytížení (paralelní obchody)](#koncept-metrika-vytizeni)
- [Metrika: Aktivita](#koncept-metrika-aktivita)

Related:
- [Ekonomika](#ekonomika)
- [Transakce](#koncept-transakce)
- [Ban](#koncept-ban)
- [User Eventy](#koncept-user-eventy)

---

<a id="koncept-metrika-reakcni-doba"></a>
### Metrika: Reakční doba
← [předchozí](#koncept-metriky-kupujiciho) | [další](#koncept-metrika-odmitnuti-bez-interakce) →

Proč existuje:
- Chci vědět, jestli je protistrana **živá a reaguje**, nebo jestli budu čekat do zblbnutí.

Kontrakt:
- Metrika je o reakci na událost v transakci (zpráva / změna stavu), ne o „kdo je lepší člověk“.
- Je to signál pro rozhodnutí, ne automatickej trest.

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Transakce](#koncept-transakce)

---

<a id="koncept-metrika-odmitnuti-bez-interakce"></a>
### Metrika: Odmítnutí bez interakce
← [předchozí](#koncept-metrika-reakcni-doba) | [další](#koncept-metrika-resolved-rate) →

Proč existuje:
- Rozlišuju „člověk se podíval a odmítl“ vs. „člověk to jen mechanicky zavírá“. To je kvalita trhu.

Kontrakt:
- Počítám odmítnutí, který proběhly bez toho, aby došlo k reálný interakci v `trade`.
- Odmítnutí je legitimní volba (viz `rejected` v [Transakcích](#koncept-transakce)); metrika je jenom popis chování, ne moralizování.

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Transakce](#koncept-transakce)

---

<a id="koncept-metrika-resolved-rate"></a>
### Metrika: Resolved rate
← [předchozí](#koncept-metrika-odmitnuti-bez-interakce) | [další](#koncept-metrika-expirace) →

Proč existuje:
- Chci vidět, jak často protistrana dotahuje obchody do „vyřešenýho“ stavu, ne jak často nechává věci hnít.

Kontrakt:
- Metrika se vztahuje jen na transakce, který se reálně rozjely (`trade` a dál).
- Neexistuje tu žádnej „tajnej downgrade“ — definice musí být čitelná.

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Transakce](#koncept-transakce)

---

<a id="koncept-metrika-expirace"></a>
### Metrika: Expirace (transakcí)
← [předchozí](#koncept-metrika-resolved-rate) | [další](#koncept-metrika-vytizeni) →

Proč existuje:
- Expirace je „nevíme co se stalo“. Pro mě je to signál chaosu a nízký spolehlivosti.

Kontrakt:
- Metrika popisuje, kolik transakcí končí jako `expired`.
- Není to automatickej ban-spouštěč. Je to data.

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Transakce](#koncept-transakce)

---

<a id="koncept-metrika-vytizeni"></a>
### Metrika: Vytížení (paralelní obchody)
← [předchozí](#koncept-metrika-expirace) | [další](#koncept-metrika-aktivita) →

Proč existuje:
- Když je někdo přetíženej, roste šance na ghosting a chaos. Chci to vědět dopředu.

Kontrakt:
- Metrika ukazuje, kolik má protistrana paralelně rozjetejch věcí.
- Nemá to být „trest za úspěch“. Je to praktická informace pro očekávání.

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Transakce](#koncept-transakce)

---

<a id="koncept-metrika-aktivita"></a>
### Metrika: Aktivita
← [předchozí](#koncept-metrika-vytizeni) | [další](#koncept-metrika-flag-rate) →

Proč existuje:
- Potřebuju odlišit „mrtvolu“ od člověka, kterej je reálně přítomnej.

Kontrakt:
- Aktivita je signál přítomnosti, ne kvality charakteru.
- Definice musí být viditelná a stabilní (žádný měnění pod stolem).
- Autorita signálu: `user.active` (1× za hodinu při pobytu v appce, počítáno od prvního otevření). Listing eventy (scroll/view) do toho **nepočítám**.

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)

---

<a id="koncept-metrika-flag-rate"></a>
### Metrika: Flag rate
← [předchozí](#koncept-metrika-aktivita) | [další](#koncept-metrika-closer-rate) →

Proč existuje:
- Flag je signál „tady je problém“. Když se to opakuje, chci vědět, že to není náhoda.

Kontrakt:
- Flag rate je agregace nahlášení, ne automatickej rozsudek.
- Žádnej auto-shadowban. Zásah je vědomý rozhodnutí (viz [Ban](#koncept-ban)).

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Flag inzerátu](#koncept-flag-inzeratu)
- [Flag uživatele](#koncept-flag-uzivatele)

---

<a id="koncept-metrika-closer-rate"></a>
### Metrika: Closer rate
← [předchozí](#koncept-metrika-flag-rate) | [další](#koncept-metrika-decision-rate) →

Proč existuje:
- Vysoký „instantní zavírání bez interakce“ je signál, že protistrana spíš kliká než obchoduje.

Kontrakt:
- Metrika popisuje rychlý ukončování bez smysluplný interakce.
- Neplete se to s `rejected` jako legitimní stopkou (hlavně když odmítá prodejce). Je to chování v čase.
- Výjimka: couvnutí kupujícího v `interest` (`rejected`) se do closer počítá (projevení zájmu není random klik, je to vědomý rozhodnutí).

Related:
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Transakce](#koncept-transakce)

---

<a id="koncept-metrika-decision-rate"></a>
### Metrika: Decision rate
← [předchozí](#koncept-metrika-closer-rate) | [další](#koncept-metrika-score) →

Proč existuje:
- Chci vědět, jestli protistrana umí rozhodnout a dotahovat, nebo jestli nechává věci vyhnít.

Kontrakt:
- Metrika je o tom, jak často dojde k rozhodnutí (uzavření / vyřešení) místo „nechat to umřít“.
- Je to nástroj pro očekávání, ne bič.

Related:
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Transakce](#koncept-transakce)

---

<a id="koncept-metrika-score"></a>
### Metrika: Score (A–F)
← [předchozí](#koncept-metrika-decision-rate) | [další](#koncept-metrika-inzeratu-visible) →

Score je agregace metrik do jedný známky. Je to zkratka pro rozhodnutí, ne magie.

Kontrakt:
- Score je škála **A–F**.
- Score se skládá z metrik v daným kontextu (prodávající vs kupující) a má být vysvětlitelný přes konkrétní čísla pod tím.
- Score není veřejná show. Je to privátní signál v rámci „Detail protistrany“.

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)

---

<a id="koncept-metrika-inzeratu-visible"></a>
### Metrika: Visible
← [předchozí](#koncept-metrika-score) | [další](#koncept-metrika-inzeratu-impression) →

Zdroj:
- `visible`

Význam:
- Karta v listingu ve viewportu alespoň **0,5 s** = „uživatel to reálně viděl“.

Deduplikace:
- Max 1× na jedno zobrazení listu pro danej inzerát.

Related:
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Inzerát](#koncept-inzerat)

---

<a id="koncept-metrika-inzeratu-impression"></a>
### Metrika: Impression
← [předchozí](#koncept-metrika-inzeratu-visible) | [další](#koncept-metrika-inzeratu-view) →

Zdroj:
- `impression`

Význam:
- Karta v listingu ve viewportu alespoň **1,6 s** = „zaujal, zpomalil“.

Deduplikace:
- Max 1× na jedno zobrazení listu pro danej inzerát.

Related:
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Inzerát](#koncept-inzerat)

---

<a id="koncept-metrika-inzeratu-view"></a>
### Metrika: View
← [předchozí](#koncept-metrika-inzeratu-impression) | [další](#koncept-metrika-inzeratu-anti-topper) →

Zdroj:
- `view`

Význam:
- Detail otevřený alespoň **2,5 s** = „reálnej zájem o detail“.

Deduplikace:
- Max 1× na jedno otevření detailu.

Related:
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Inzerát](#koncept-inzerat)

---

<a id="koncept-metrika-inzeratu-anti-topper"></a>
### Metrika: Anti-topper
← [předchozí](#koncept-metrika-inzeratu-view) | [další](#koncept-metrika-inzeratu-thumbs) →

Zdroj:
- `anti-topper`

Význam:
- Když má uživatel aktivní [Anti-topper](#koncept-anti-topper) a v listingu by se měl ukázat inzerát se zvýrazněním **Mark/Top**, systém zapíše `anti-topper` **a zároveň** zapíše i [`visible`](#koncept-metrika-inzeratu-visible) (stejný čas).

Smysl:
- Měřím „kolikrát bylo zvýraznění potlačeno“ (metriky + případnej [Payback](#koncept-payback)).

Výjimka:
- Pro **Top Maxxi** se `anti-topper` negeneruje (je imunní).

Deduplikace:
- Typicky stejný limity jako [`visible`](#koncept-metrika-inzeratu-visible) (ať z toho není spam).

Related:
- [Anti-topper](#koncept-anti-topper)
- [Payback](#koncept-payback)
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Inzerát](#koncept-inzerat)
- [Metrika: Visible](#koncept-metrika-inzeratu-visible)

---

<a id="koncept-metrika-inzeratu-thumbs"></a>
### Metrika: Thumbs
← [předchozí](#koncept-metrika-inzeratu-anti-topper) | [další](#koncept-metrika-inzeratu-ignored) →

Zdroj:
- `thumbs`

Význam:
- Palce (like/dislike) jako signál atraktivity nabídky.

Kontrakt:
- `thumbs` jsou reálný entity palců nad inzerátem (viz [Palce](#koncept-palce)).
- Nejsou to veřejný ego-lajky. Je to data pro produkt a pro mě.

Related:
- [Palce](#koncept-palce)
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Inzerát](#koncept-inzerat)

---

<a id="koncept-metrika-inzeratu-ignored"></a>
### Metrika: Ignored
← [předchozí](#koncept-metrika-inzeratu-thumbs) | [další](#koncept-metrika-inzeratu-transactions) →

Zdroj:
- `ignored`

Význam:
- Kolikrát lidi dali [Ignor](#koncept-ignorace-inzeratu) nad inzerátem.

Kontrakt:
- Je to signál „tohle lidi nechtějí vídat“.
- Neříká to nic o pravdě nebo morálce. Je to osobní úklid.

Related:
- [Ignor](#koncept-ignorace-inzeratu)
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Inzerát](#koncept-inzerat)

---

<a id="koncept-metrika-inzeratu-transactions"></a>
### Metrika: Transactions
← [předchozí](#koncept-metrika-inzeratu-ignored) | [další](#koncept-rozsirena-data-inzeratu) →

Zdroj:
- `transaction.created`

Význam:
- Kolik transakcí tenhle inzerát vyvolal (kolik „vláken obchodu“ na něj vzniklo).

Kontrakt:
- Je to metrika zájmu, ne kvality. Více transakcí neznamená úspěch.

Related:
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Inzerát](#koncept-inzerat)

---

<a id="koncept-rozsirena-data-inzeratu"></a>
### Rozšířená data u inzerátu
← [předchozí](#koncept-metrika-inzeratu-transactions) | [další](#koncept-pass) →

Rozšířená data jsou privátní čísla u **mých** inzerátů. Jsou řízený **[Passem](#koncept-pass)**.

Kontrakt:
- Dokud mám aktivní [Pass](#koncept-pass), vidím rozšířená data.
- Bez [Passu](#koncept-pass) nevidím nic (žádný „free“ pseudo-score).

Zdrojová data (mapa, aby to neujelo ve slovníku):
- Jediný zdroj je `listing_event`. Je to append-only log událostí nad inzerátem. Každý řádek v tabulce níž je **event v `listing_event`**.
- Když vznikne transakce, zapíšu to **dvakrát**: do `listing_event` jako `transaction.created` (kvůli metrikám inzerátu) a do `user_event` (kvůli metrikám lidí). Spamujeme schválně: každý svět slouží svýmu účelu.
- Když se prodá, zapíšu to taky **dvakrát**: do `listing_event` jako `listing.sold` (kvůli rozšířeným datům pro prodejce) a do `user_event` jako `transaction.sold` u dotčených transakcí (kvůli metrikám lidí).

| Event (`listing_event`) | Vznik                                                                    | Na co to používám                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `visible`               | karta v listingu ve viewportu alespoň **0,5 s**                          | metrika „reálný zobrazení“ (autorita: [Metrika: Visible](#koncept-metrika-inzeratu-visible))                             |
| `impression`            | karta v listingu ve viewportu alespoň **1,6 s**                          | metrika „zaujalo“ (autorita: [Metrika: Impression](#koncept-metrika-inzeratu-impression))                                |
| `view`                  | detail otevřený alespoň **2,5 s**                                        | metrika „reálnej zájem o detail“ (autorita: [Metrika: View](#koncept-metrika-inzeratu-view))                             |
| `thumbs`                | uživatel dá like/dislike nad inzerátem                                   | signál atraktivity (autorita: [Metrika: Thumbs](#koncept-metrika-inzeratu-thumbs))                                       |
| `ignored`               | uživatel dá ignor nad inzerátem                                          | osobní úklid + signál pro prodávajícího (autorita: [Metrika: Ignored](#koncept-metrika-inzeratu-ignored))                |
| `transaction.created`   | vznikne transakce nad inzerátem                                          | metrika zájmu (autorita: [Metrika: Transactions](#koncept-metrika-inzeratu-transactions))                                |
| `listing.sold`          | inzerát se přepne do `sold` (ručně nebo přes `resolved`)                 | signál „prodáno“ v rozšířených datech                                                                                    |
| `anti-topper`           | potlačení zvýraznění pro uživatele s [Anti-topper](#koncept-anti-topper) | měření potlačení + [Payback](#koncept-payback) (autorita: [Metrika: Anti-topper](#koncept-metrika-inzeratu-anti-topper)) |

Co ukazuju:

| Zdrojová metrika                                         | Význam                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| [`impression`](#koncept-metrika-inzeratu-impression)     | „zaujalo“ (viz definice Impression)                           |
| [`view`](#koncept-metrika-inzeratu-view)                 | reálnej zájem o detail (viz definice View)                    |
| [`thumbs`](#koncept-metrika-inzeratu-thumbs)             | palce (like/dislike) jako signál atraktivity nabídky          |
| [`ignored`](#koncept-metrika-inzeratu-ignored)           | kolikrát lidi dali ignor (osobní úklid, „tohle nechci vídat“) |
| [`transactions`](#koncept-metrika-inzeratu-transactions) | kolik zájmů / otevřených obchodů inzerát vyvolal              |

[Anti-topper](#koncept-anti-topper) v číslech:
- poměr `anti-topper / visible` (kde [`visible`](#koncept-metrika-inzeratu-visible) je „reálný zobrazení karty“ a [`anti-topper`](#koncept-metrika-inzeratu-anti-topper) je potlačení zvýraznění)

Related:
- [Inzerát](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Anti-topper](#koncept-anti-topper)
- [Ekonomika](#ekonomika)
- [Palce](#koncept-palce)
- [Ignor](#koncept-ignorace-inzeratu)
- [Flag inzerátu](#koncept-flag-inzeratu)

---

<a id="koncept-pass"></a>
### Pass
← [předchozí](#koncept-rozsirena-data-inzeratu) | [další](#koncept-kupon) →

**Pass** je časově omezený oprávnění / režim. Není to měna ani poukázka. Je to stav: „od teď do tehdy tohle platí“.

Kontrakt:
- **Pass** je **stav**, ne spotřební item.
- **Pass** má vždycky expiraci. Buď běží, nebo neběží. Žádný „napůl“.
- [Aktivace](#koncept-aktivace) typicky znamená: vznikne nebo se prodlouží pass (detaily držím v [Ekonomice](#ekonomika)).
- **Pass** nikdy neobchází systémový brány (hlavně [Citlivost](#koncept-citlivost-inzeratu) a [Ignor](#koncept-ignorace-inzeratu)).

Scope:
- Některý passy jsou **na úrovni účtu** (např. [Anti-topper](#koncept-anti-topper)).
- Některý passy jsou **na úrovni inzerátu** (např. Mark/Top/Top Maxxi) — běží jen pro konkrétní inzerát.

Related:
- [Ekonomika](#ekonomika)
- [Early Discovery](#koncept-early-discovery)
- [Early Delivery](#koncept-early-delivery)
- [Anti-topper](#koncept-anti-topper)
- [Mark](#koncept-mark)
- [Top](#koncept-top)
- [Top Maxxi](#koncept-top-maxxi)
- [Kontinuální nabídka](#koncept-kontinualni-nabidka)
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Payback](#koncept-payback)

---

<a id="koncept-kupon"></a>
### Kupón
← [předchozí](#koncept-pass) | [další](#koncept-tokeny) →

**Kupón** je poukázka na konkrétní akci. Není to měna. Je to „máš přesně tohle“.

Kontrakt:
- **Kupón** je konkrétní: buď ho použiju na danou věc, nebo ho nechám ležet do expirace.
- **Kupón** je 1× použití (spotřebuje se).
- **Kupón** má trvanlivost **max. 3 měsíce** od získání. Po vypršení se zneplatní a nelze ho použít.
- Trvanlivost umožňuje nafarmit kupóny z předplatného (např. měsíční kupóny), ale časem vyprší — žádné nekonečné hromadění.
- **Kupón zůstává i po ukončení předplatného** — platnost ukončí pouze a jenom expirace samotného kupónu.
- Pokud k dané věci běží aktivní [Pass](#koncept-pass), **kupón nelze uplatnit**. Tím se zakazuje stackování — nemůžeš mít aktivní pass a zároveň použít kupón na stejnou věc.

Related:
- [Tokeny](#koncept-tokeny)
- [Pass](#koncept-pass)
- [Ekonomika](#ekonomika)

---

<a id="koncept-tokeny"></a>
### Tokeny
← [předchozí](#koncept-kupon) | [další](#koncept-aktivace) →

**Tokeny** jsou interní měna. Palivo na jednorázový věci, který nechci cpát do předplatnýho jako povinnost.

Kontrakt:
- **Tokeny** získám (příděl/bonus/nákup) a pak je utrácím.
- **Tokeny** jsou skladovatelné: neexpirují. Expirovat může jen [Pass](#koncept-pass).

Related:
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)
- [Ekonomika](#ekonomika)

---

<a id="koncept-aktivace"></a>
### Aktivace
← [předchozí](#koncept-tokeny) | [další](#koncept-cenik) →

**Aktivace** je jednotný kontrakt pro „zapínání“ věcí. Uživatel musí vždycky vědět, jestli něco **spotřebovává**, nebo **aktivuje na čas**.

Kontrakt:
- Pokud mám použitelný [Kupón](#koncept-kupon) pro danou věc → použije se kupón.
- Jinak → strhnou se [Tokeny](#koncept-tokeny) podle [Ceníku](#koncept-cenik) (viz [Ekonomika](#ekonomika)). Co je v ceníku označené jako [Exclusive](#koncept-exclusive), se přes tokeny neaktivuje (jen jako benefit [Předplatného](#koncept-predplatne)).
- Výsledek je buď:
  - jednorázová akce (kupón se spálí a hotovo), nebo
  - vznik / prodloužení [Passu](#koncept-pass) (podle typu věci).

CTA pravidlo:
- `Aktivovat (1× Kupón)` vs `Aktivovat (XX Tokenů)`.
- Pravidlo: **nejdřív spotřebuj free věci, až potom měnu**.

Tvrdá hranice:
- Rozšíření jsou nadstavby. Ne zadní vrátka.
- **Aktivace** nikdy neobchází brány (hlavně [Citlivost](#koncept-citlivost-inzeratu) a [Ignor](#koncept-ignorace-inzeratu)).

Related:
- [Tokeny](#koncept-tokeny)
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)
- [Ceník](#koncept-cenik)
- [Ekonomika](#ekonomika)

---

<a id="koncept-cenik"></a>
### Ceník
← [předchozí](#koncept-aktivace) | [další](#koncept-exclusive) →

**Ceník** je seznam **všech věcí**, které jde aktivovat. Je to produktová autorita pro „tohle existuje a jak se to aktivuje".

Kontrakt:
- Ceník obsahuje **všechno** (všechny věci, které jde aktivovat).
- Věci, které jsou pouze z balíčku, jsou v ceníku označené jako **[Exclusive](#koncept-exclusive)** – detailní pravidla (koupitelnost, nárok z balíčku) drží [Exclusive](#koncept-exclusive) a [Aktivace](#koncept-aktivace).
- Konkrétní částky a tabulky držím v [Ekonomice](#ekonomika).

Related:
- [Ekonomika](#ekonomika)
- [Aktivace](#koncept-aktivace)
- [Tokeny](#koncept-tokeny)
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)
- [Exclusive](#koncept-exclusive)

---

<a id="koncept-exclusive"></a>
### Exclusive
← [předchozí](#koncept-cenik) | [další](#koncept-predplatne) →

**Exclusive** je označení v [Ceníku](#koncept-cenik) pro věci, které jsou **pouze z balíčku** / [Předplatného](#koncept-predplatne). Nejsou koupitelné samostatně přes [Tokeny](#koncept-tokeny).

Kontrakt:
- **Exclusive** věci jsou **v ceníku**, ale označené jako "Exclusive" (viz [Ekonomika](#ekonomika)).
- Nejsou koupitelný přes [Tokeny](#koncept-tokeny). Pokud existují, běží jen jako nárok (typicky [Pass](#koncept-pass)) z [Předplatného](#koncept-predplatne).
- Autorita toho, co je „koupitelný", je [Ceník](#koncept-cenik) (a pravidla použití drží [Aktivace](#koncept-aktivace)).

Related:
- [Ekonomika](#ekonomika)
- [Aktivace](#koncept-aktivace)
- [Ceník](#koncept-cenik)
- [Pass](#koncept-pass)
- [Tokeny](#koncept-tokeny)
- [Kupón](#koncept-kupon)

---

<a id="koncept-predplatne"></a>
### Předplatné
← [předchozí](#koncept-exclusive) | [další](#koncept-automaticke-ukonceni-predplatneho) →

Předplatné je komfort a nástroje navíc, bez pay-to-win cirkusu. Stojí na jasných věcech: limit, pass, kupón, tokeny.

Kontrakt:
- Renew = příděly vždycky: při každým renew se připíšou tokeny/kupóny z balíčku.
- Cancel je jediná **uživatelská** změna: když zruším předplatné, jen se neobnoví. Co běží, doběhne do konce zaplacenýho období.
- Systémová varianta je [Automatické ukončení: Předplatné (neaktivita)](#koncept-automaticke-ukonceni-predplatneho).

Related:
- [Ekonomika](#ekonomika)
- [Tokeny](#koncept-tokeny)
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)
- [Exclusive](#koncept-exclusive)
- [Ceník](#koncept-cenik)

---

<a id="koncept-automaticke-ukonceni-predplatneho"></a>
### Automatické ukončení: Předplatné (neaktivita)
← [předchozí](#koncept-predplatne) | [další](#koncept-tokeny-ziskavani) →

Tohle je férovka vůči lidem, co platí a pak na to zapomenou. Radši přijdu o platbu než o důvěru.

Kontrakt:
- Po **1 měsíci neaktivity** pošlu email připomínku.
- Po **2 měsících neaktivity** předplatné **ukončím**: doběhne aktuální období a na konci už se **neobnoví**.
- Aktivita = existuje aspoň jeden `user.active` (`user_event`, `scope=user`) v daným čase. Je to nudnej heartbeat „hej bro, jsem tu“ (1× za hodinu při pobytu v appce).
- Neaktivita je chování (signál používání), ne "nemám chuť kliknout na cancel".

Related:
- [Předplatné](#koncept-predplatne)
- [Notifikace (Activity)](#koncept-notifikace)
- [Ekonomika](#ekonomika)

---

<a id="koncept-tokeny-ziskavani"></a>
### Tokeny: Získávání
← [předchozí](#koncept-automaticke-ukonceni-predplatneho) | [další](#koncept-early-discovery) →

[Tokeny](#koncept-tokeny) získáš:
- z předplatného (měsíční příděl)
- z bonusů za používání
- nákupem balíčků

Bonusy za používání (kontrakt):
| Mechanika            | Kdy vzniká                                 | Smysl                                | Poznámka                      |
| -------------------- | ------------------------------------------ | ------------------------------------ | ----------------------------- |
| Odměna za `resolved` | prodávající přepne transakci do `resolved` | motivace k úklidu a pravdivým koncům | bez `resolved` bonus nevzniká |
| Denní drop           | 1× denně k vyzvednutí (řádově ~10 T)       | drobná pobídka k návratu             | ne ekonomickej model          |
| RNG dropy ve feedu   | občas při scrollu (nízká pravděpodobnost)  | malý překvapení                      | ne ekonomickej model          |
| Anti-abuse           | při zjevným zneužití                       | ochrana proti farmení                | bonus se nemusí vyplatit      |

Related:
- [Tokeny](#koncept-tokeny)
- [Předplatné](#koncept-predplatne)
- [Aktivace](#koncept-aktivace)
- [Transakce](#koncept-transakce)

---

<a id="koncept-early-discovery"></a>
### Early Discovery
← [předchozí](#koncept-tokeny-ziskavani) | [další](#koncept-early-delivery) →

Early Discovery je výhoda kupujícího: ve feedu najdeš nově dostupné inzeráty hned.

Kontrakt:
- Ovlivňuje pouze nalezitelnost inzerátu v rámci feedu.
- Přímé odkazy fungují normálně bez ohledu na Early Discovery.
- Ve feedu ignoruju release window, takže inzerát vidíš **hned** (běžně je to až za **+12 hodin** od `availableAt`).
- Maximum posunu je vždycky **12 hodin** (žádný „super-early“).
- Ostatní brány a chování detailu drží [Seznam inzerátů](#koncept-seznam-inzeratu).
- V nastavení [Feedu](#koncept-hledat) máš extra filtr „Jen Early Discovery“; ta volba je vidět a funguje jen po dobu, kdy máš aktivní **Early Discovery**. Jakmile pass skončí, změní se ten přepínač na „Zaplatit si Early Discovery“.
- Pokud prodejce použije [Early Delivery](#koncept-early-delivery), Early Discovery už k tomu inzerátu nepřidává žádný další bonus.

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Ekonomika](#ekonomika)

---

<a id="koncept-early-delivery"></a>
### Early Delivery
← [předchozí](#koncept-early-discovery) | [další](#koncept-mark) →

Early Delivery je výhoda prodávajícího pro konkrétní inzerát: zruší release window pro všechny a přenese váhu placení z kupujícího na prodejce.

Kontrakt:
- Pro tenhle inzerát ruším release window úplně, takže ho ve feedu najdou **hned i lidi bez Early Discovery**.
- Maximum posunu je vždycky **12 hodin** od `availableAt`.
- Kupující s [Early Discovery](#koncept-early-discovery) proti Early Delivery už další bonus nemají. Nic se nestackuje.
- Brány a chování detailu platí stejně jako u [Early Discovery](#koncept-early-discovery) (autorita je [Seznam inzerátů](#koncept-seznam-inzeratu)).

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Ekonomika](#ekonomika)

---

<a id="koncept-mark"></a>
### Mark
← [předchozí](#koncept-early-delivery) | [další](#koncept-top) →

Mark je čistě listing mechanika. Není to výhoda v pravidlech. Je to výhoda v signálu.

Kontrakt:
- Co Mark dělá: jen vizuální signál (badge „Zvýrazněno“). Nezaručuje top pozici.
- Co Mark nikdy neobchází: filtry, radius, release window, ignor, [Citlivost](#koncept-citlivost-inzeratu).
- Trvání: Mark běží tak dlouho, jak je aktivní jeho **[Pass](#koncept-pass) na úrovni inzerátu**.
- [Kontinuální nabídka](#koncept-kontinualni-nabidka):
  - pokud se inzerát vrátí do `live` a Mark pass je pořád aktivní, Mark se projeví normálně,
  - pokud Mark pass doběhl, Mark se neprojeví.

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Anti-topper](#koncept-anti-topper)
- [Payback](#koncept-payback)
- [Ekonomika](#ekonomika)

---

<a id="koncept-top"></a>
### Top
← [předchozí](#koncept-mark) | [další](#koncept-top-maxxi) →

Top je listing mechanika: inzerát skočí do prioritní vrstvy listingu (pod Top Maxxi).

Kontrakt:
- Co Top dělá: posune inzerát do priority vrstvy listingu.
- Co Top nikdy neobchází: filtry, radius, release window, ignor, [Citlivost](#koncept-citlivost-inzeratu).
- [Anti-topper](#koncept-anti-topper): Top ztratí výhodu pozice, zůstane mu jen badge.
- Trvání: Top běží tak dlouho, jak je aktivní jeho **[Pass](#koncept-pass) na úrovni inzerátu**.
- [Kontinuální nabídka](#koncept-kontinualni-nabidka):
  - pokud se inzerát vrátí do `live` a Top pass je pořád aktivní, Top se projeví normálně,
  - pokud Top pass doběhl, Top se neprojeví.

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Anti-topper](#koncept-anti-topper)
- [Payback](#koncept-payback)
- [Ekonomika](#ekonomika)

---

<a id="koncept-top-maxxi"></a>
### Top Maxxi
← [předchozí](#koncept-top) | [další](#koncept-anti-topper) →

Top Maxxi je absolutní přednost v listingu. Je to nejvyšší vrstva priority a je imunní vůči [Anti-topper](#koncept-anti-topper)u.

Kontrakt:
- Co dělá: inzerát je v listingu vždy nahoře (priorita #1).
- Co nikdy neobchází: filtry, radius, release window, ignor, [Citlivost](#koncept-citlivost-inzeratu).
- [Anti-topper](#koncept-anti-topper): Top Maxxi je imunní (neovlivní ho).
- [Payback](#koncept-payback): Top Maxxi je imunní → payback pro něj nikdy nevzniká.
- Trvání: Top Maxxi běží tak dlouho, jak je aktivní jeho **[Pass](#koncept-pass) na úrovni inzerátu**.
- Limit: maximum **1** Top Maxxi aktivní současně na jeden účet.

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Anti-topper](#koncept-anti-topper)
- [Payback](#koncept-payback)
- [Ekonomika](#ekonomika)

---

<a id="koncept-anti-topper"></a>
### Anti-topper
← [předchozí](#koncept-top-maxxi) | [další](#koncept-payback) →

**Anti-topper** je placenej klid kupujícího. Nechci, aby se listing změnil v katalog placenýho šumu.

Kontrakt:
- **Anti-topper** mění jen chování listingu:
  - **Top Maxxi** zůstává nahoře (imunní),
  - **Top + běžné** se smíchají a řadí se čistě podle preference uživatele (Top ztratí výhodu pozice, zůstane badge).
- **Anti-topper** **nikdy neblokuje detail**. Je to mechanika listingu, ne zákaz existence.

Měření:
- Když by se v listingu ukázal inzerát se zvýrazněním (Mark/Top) uživateli s **Anti-topper**em, vznikne event [`anti-topper`](#koncept-metrika-inzeratu-anti-topper) **a zároveň** vznikne i [`visible`](#koncept-metrika-inzeratu-visible) (stejný čas).

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Ekonomika](#ekonomika)
- [Payback](#koncept-payback)

---

<a id="koncept-payback"></a>
### Payback
← [předchozí](#koncept-anti-topper) | [další](#koncept-kontinualni-nabidka) →

**Payback** je kompenzace pro prodávajícího, když si koupil zvýraznění a část publika mu ho odfoukla přes [Anti-topper](#koncept-anti-topper).

Kontrakt:
- Kompenzuje jen boosty, který [Anti-topper](#koncept-anti-topper) umí potlačit: **Mark** a **Top**.
- **Top Maxxi** je imunní → payback pro něj nikdy nevzniká.
- Vyhodnocuju ve chvíli, kdy inzerát dostane svůj terminal stav: `expired` / `sold` / `closed` (už se nic nevrací do hry, jen vyrovnám účty).
- Když prodejce inzerát ručně zavře (`closed`), vyúčtování proběhne taky. Payback může vyjít klidně **0** — ale nesmí to „nechat viset“.
- **Payback** je **[Pass](#koncept-pass) ([Exclusive](#koncept-exclusive))** (typicky Seller/Pro) a vzniká jen pokud má prodávající v době vyhodnocení aktivní **Payback** pass.
- Základ je `anti-topper` metrika (viz [Metrika: Anti-topper](#koncept-metrika-inzeratu-anti-topper)). Výše vrácení z ceny zvýraznění:

| Poměr **anti-topper**         | Vrácená část ceny zvýraznění |
| ----------------------------- | ---------------------------- |
| < 25 %                        | 0 %                          |
| 25–49 %                       | 25 %                         |
| 50–74 %                       | 50 %                         |
| ≥ 75 %                        | 75 %                         |

Nikdy nevracím víc než tři čtvrtiny zaplacený částky.

Related:
- [Anti-topper](#koncept-anti-topper)
- [Ekonomika](#ekonomika)

---

<a id="koncept-kontinualni-nabidka"></a>
### Kontinuální nabídka
← [předchozí](#koncept-payback) | [další](#koncept-landing) →

**Kontinuální nabídka** je legální způsob, jak řízeně prodloužit život **inzerátu**, když to není jednorázovej kus.

Smysl:
- automatická expirace drží pořádek a zabíjí hřbitovy,
- **Kontinuální nabídka** je způsob, jak tenhle řád koupit bez ojebů.

Jak to funguje:
- Je to **[Pass](#koncept-pass)**, který prodlužuje aktivní cyklus inzerátu (prakticky posouvá „efektivní expiraci“).
  - Aktivuje ji **vlastník inzerátu**.
- Kontinuální nabídka **neresetuje** `createdAt` ani [Release window](#koncept-release-window). Žádný bump exploit.
- Lze ji zapnout kdykoliv:
  - když je inzerát ještě `live`, prodloužení se **naváže na expiraci** (nekrade čas),
  - když je už `expired`, začne to **okamžitě** a inzerát se vrátí mezi `live`.

Chování během aktivního passu:
- Inzerát se chová jako normální `live` (leze do feedů, jde na něj založit transakce, metriky se počítají normálně).
- Po vypršení [Passu](#koncept-pass) se vrací do režimu `expired` (read-only, mimo standardní feedy).

Hranice:
- Nic z toho neobchází systémový brány (hlavně [Citlivost](#koncept-citlivost-inzeratu), ignor, Early Discovery/Early Delivery).
- Nad `sold` inzerátem nejde **Kontinuální nabídku** zapnout. `sold` je konec.

Related:
- [Inzerát](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Ekonomika](#ekonomika)

---

<a id="koncept-landing"></a>
### Landing
← [předchozí](#koncept-kontinualni-nabidka) | [další](#koncept-navigace) →

Landing je vizitka postoje. Držím to krátký: pět bloků a hotovo.

| Blok            | Co je uvnitř                                                                                                    | Proč                           |
| --------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Hero            | claim **„Nakupuješ nebo prodáváš?“** + 2 rovnocenný CTA: **„Už se známe“** (Login), **„Přidej se!“** (Register) | žádný trick CTA, žádnej nátlak |
| Autor           | moje fotka, moje jméno, odkaz na GitHub, motto **„Bez keců. Bez ojebů.“**                                       | důvěra přes tvář a odpovědnost |
| Aktivita vývoje | GitHub-like heatmap                                                                                             | důkaz práce, ne sliby          |
| Live Pulse      | poslední události (registrace, nový inzeráty, transakce) – timeline živosti trhu                                | ať je vidět, že to žije        |

Tón: minimalistickej. Bez popupů, bez urgencí, bez vysvětlování.

Related:
- [Uživatel](#koncept-uzivatel)
- [Kodex](#kodex)

---

<a id="koncept-navigace"></a>
### Navigace
← [předchozí](#koncept-landing) | [další](#koncept-muj-ucet) →

Navigace je schválně nudná a stabilní. Uživatel se nemá proklikávat labyrintem. Má mít jistotu, že vždycky ví, kde je, a vždycky má únik.

Kontrakt:
- Navigace má držet několik stabilních vstupů do hlavních produktových kontextů: společný přehled, prodej, nákup, účet a ekonomiku / aktivace.
- Role nejsou identita ani přepínač „jsem seller/buyer“. Je to rychlej vstup do dvou nejčastějších mindsetů.
- Konkrétní podoba navigace není součástí pravdy tohohle dokumentu. Důležitý je jen to, jaké kontexty má zpřístupnit a jak se v nich má člověk orientovat.

Related:
- [Landing](#koncept-landing)
- [Draft](#koncept-draft)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Notifikace (Activity)](#koncept-notifikace)
- [Můj účet](#koncept-muj-ucet)
- [Ekonomika](#ekonomika)

---

<a id="koncept-muj-ucet"></a>
### Můj účet
← [předchozí](#koncept-navigace) | [další](#koncept-ui-ramec) →

Můj účet není sociální profil. Je to místo pro preference a hranice: kdo jsem (minimálně) a co chci/nesnesu vidět.

Co tu řeším:
- maximum [Citlivosti](#koncept-citlivost-inzeratu),
- nastavení ticha a přeposílání/digestu pro [Activity](#koncept-notifikace),
- základní účetní věci typu email (minimum identit, žádný „profilovky pro pocit“).

Kontrakt:
- Když se něco týká hranic obsahu nebo ticha, autorita je tady + příslušný koncept (Citlivost/Notifikace). Jinde je jen odkaz.

Related:
- [Uživatel](#koncept-uzivatel)
- [Citlivost](#koncept-citlivost-inzeratu)
- [Notifikace (Activity)](#koncept-notifikace)
- [Ekonomika](#ekonomika)

---

<a id="koncept-ui-ramec"></a>
### UI: Rámec
← [předchozí](#koncept-muj-ucet) | [další](#koncept-ui-dashboard) →

UI je půl produktu. Když působí nejistě, uživatel je nejistej. Když je klidný a stabilní, nic neřeší.

Pravidla:
- Mobile-first vždycky.
- Nevysvětlovat. Když to potřebuje nápovědu, je to špatně.
- Minimum psaní. Klikací kroky a jasný stavy.
- Akce mají váhu. Primární CTA je jasná, destruktivní je opatrná.
- Klid > efekt. Reakce systému má být okamžitá.

Related:
- [Navigace](#koncept-navigace)
- [Draft](#koncept-draft)
- [Landing](#koncept-landing)
- [UI: Rozšíření](#koncept-ui-rozsireni)
- [UI: Bonusy](#koncept-ui-bonusy)

---

<a id="koncept-ui-dashboard"></a>
### UI: Dashboard
← [předchozí](#koncept-ui-ramec) | [další](#koncept-ui-seller) →

Dashboard je společný entrypoint. Není to feed ani další samostatný svět.

Kontrakt:
- Má rychle ukázat „co je nového“, „co čeká na reakci“ a „kam mám teď nejspíš jít“.
- Je to přehled a rozcestník, ne místo, kde se znovu vymýšlí logika ostatních konceptů.

Related:
- [Notifikace (Activity)](#koncept-notifikace)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Draft](#koncept-draft)

---

<a id="koncept-ui-seller"></a>
### UI: Chci prodávat
← [předchozí](#koncept-ui-dashboard) | [další](#koncept-ui-buyer) →

Tohle je produktový kontext „prodávám“.

Kontrakt:
- Má soustředit tvorbu, rozpracované věci, publikované nabídky a rozjednané obchody do jednoho srozumitelného prostoru.
- Má podporovat flow „začít / navázat / spravovat / dotáhnout“, ne rozpadnout ho do náhodných odboček.

Related:
- [Draft](#koncept-draft)
- [Inzerát](#koncept-inzerat)
- [Transakce](#koncept-transakce)

---

<a id="koncept-ui-buyer"></a>
### UI: Chci nakupovat
← [předchozí](#koncept-ui-seller) | [další](#koncept-ui-rozsireni) →

Tohle je produktový kontext „nakupuju“.

Kontrakt:
- Má soustředit návrat do listingu, správu vlastních feedů, oblíbené a rozjednané nákupy do jednoho mentálního rámce.
- Má držet kontinuitu nákupního kontextu, aby člověk nemusel znovu hledat, co už si rozkoukal nebo rozjednal.

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Transakce](#koncept-transakce)
- [Feed](#koncept-feed)
- [Oblíbené](#koncept-oblibene)

---

<a id="koncept-ui-rozsireni"></a>
### UI: Rozšíření
← [předchozí](#koncept-ui-buyer) | [další](#koncept-ui-bonusy) →

Rozšíření jsou produktový kontext pro věci, které se dají aktivovat nebo odemknout.

Kontrakt:
- Rozšíření je katalog toho, co jde aktivovat (viz [Ceník](#koncept-cenik)) a co je zamčený ([Exclusive](#koncept-exclusive)).
- Každá položka má jednu jasnou akci: `Aktivovat` → pravidla drží [Aktivace](#koncept-aktivace).
- Musí být čitelné, jaký je stav aktivace, na jakém principu se věc odemyká a co je k tomu potřeba.
- Musí držet pohromadě aktivní stav, dostupné možnosti a důsledky aktivace, ale konkrétní rozložení UI není součástí tohohle dokumentu.

Related:
- [Aktivace](#koncept-aktivace)
- [Ceník](#koncept-cenik)
- [Kupón](#koncept-kupon)
- [Tokeny](#koncept-tokeny)
- [Pass](#koncept-pass)
- [Exclusive](#koncept-exclusive)
- [Předplatné](#koncept-predplatne)

---

<a id="koncept-ui-bonusy"></a>
### UI: Bonusy
← [předchozí](#koncept-ui-rozsireni) | [další](#koncept-ban) →

Bonusy jsou produktový kontext pro vědomé vyzvedávání odměn a práci s drobnější ekonomickou vrstvou.

Kontrakt:
- Bonusy jsou místo, kde si **vědomě vyzvednu** věci typu denní drop. Nic se „nevyzvedává samo“.
- Bonusy jsou místo, kde si můžu pořídit **[Předplatné](#koncept-predplatne)** a **balíčky [Tokenů](#koncept-tokeny)**. Neříkám tomu „obchod“, ale je to tenhle účel.
- Pravidla bonusů a anti-abuse drží [Tokeny: Získávání](#koncept-tokeny-ziskavani). Tady je jen UI přístup.
- Bonusy mají navazovat na [Rozšíření](#koncept-ui-rozsireni), ale konkrétní UI propojení není součástí tohohle dokumentu.

Related:
- [Tokeny: Získávání](#koncept-tokeny-ziskavani)
- [Tokeny](#koncept-tokeny)
- [Předplatné](#koncept-predplatne)
- [Transakce](#koncept-transakce)
- [Rozšíření](#koncept-ui-rozsireni)

---

<a id="koncept-ban"></a>
### Ban
← [předchozí](#koncept-ui-bonusy) | [další](#ekonomika-balicky) →

Ban je ruční nástroj admina (já). Ne automat.

Kontrakt:
- Důvod musí být konkrétní (podvod/spam/ojeby a podobně).
- Žádný tichý „shadow“ tresty. Když stopka, tak stopka.
- **Dopad na účet**: účet je zablokovaný (nemůže vytvářet nové inzeráty, transakce, zprávy).
- **Dopad na inzeráty**: všechny inzeráty uživatele se přepnou do stavu `banned` (viz [Inzerát](#koncept-inzerat)). `banned` je další legální způsob, jak poslat zpět **404** a zabránit zobrazení v UI (vedle [Citlivosti](#koncept-citlivost-inzeratu)).
- **Admin hard removal**: kromě citlivosti existuje ještě admin hard removal (výjimečná stopka), která je **404**. To je jediná výjimka z pravidla „jen citlivost smí blokovat detail" (viz [Citlivost](#koncept-citlivost-inzeratu) a [Seznam inzerátů](#koncept-seznam-inzeratu)).

Related:
- [Flag inzerátu](#koncept-flag-inzeratu)
- [Flag uživatele](#koncept-flag-uzivatele)
- [Citlivost](#koncept-citlivost-inzeratu)
- [Inzerát](#koncept-inzerat)

---

<a id="ekonomika"></a>
## Ekonomika
← [předchozí](#koncepty) | [další](#uvedeni-na-trh) →

Ekonomika je autorita na to, **za co se platí** a **proč**. Neřeším tady UI obrazovky ani platební brány. Řeším kontrakt: co je fér, co je čitelné, co je manipulace.

Zásady:
- Platí se za **nástroje, čas a pohodlí**. Ne za “vítězství”. (Viz Kodex: „žádné pay-to-win“.)
- Všechno, co jde aktivovat, musí být v [Ceníku](#koncept-cenik). Věci, které jsou pouze z balíčku, jsou v ceníku označené jako [Exclusive](#koncept-exclusive).
- Aktivace je vždycky mechanická: nejdřív spotřebuju [Kupón](#koncept-kupon), pak teprve platím [Tokeny](#koncept-tokeny). Autorita je [Aktivace](#koncept-aktivace).
- Všechny “věci co běží v čase” jsou [Pass](#koncept-pass). Nic jiného.

Co prodávám (mentálně):
- **Kupující** kupuje klid (méně šumu), čas (vidět dřív), rozhodování (lepší signál).
- **Prodávající** kupuje distribuci (pozice v listingu) a nástroje (privátní data, limity).

Refundy a férovky:
- Když vznikne kompenzace, je to explicitní mechanika (typicky [Payback](#koncept-payback)). Žádný tichý “vrátili jsme ti něco, ale neřekneme proč”.

<a id="ekonomika-balicky"></a>
### Předplatné (balíčky)
← [předchozí](#koncept-ban) | [další](#ekonomika-tokeny-ceny) →

Balíčky jsou měsíční balík oprávnění + příděly. Nejsou to role. Oprávnění jsou vždycky jen [Passy](#koncept-pass) a limity na účtu.

| Položka                                                          | Free | Founders | Kupující<br>(149 Kč) | Prodejce<br>(229 Kč) | **Pro**<br>(499 Kč) |
| :--------------------------------------------------------------- | :--: | :------: | :------------------: | :------------------: | :-----------------: |
| **Tokeny / měsíc**                                               | -    | 100 T    | 100 T                | 200 T                | **300 T**           |
| **Limity**                                                       |      |          |                      |                      |                     |
| Uložené Feedy                                                    | 3    | 10       | 5                    | -                    | **10**              |
| Aktivní inzeráty                                                 | 3    | 20       | 5                    | 10                   | **20**              |
| [Photo Count](#koncept-limit-poctu-fotek) (+foto)                | 3    | 10       | 3                    | 5                    | **10**              |
| **Passy (Trvalé)**                                               |      |          |                      |                      |                     |
| [Payback](#koncept-payback)                                      | -    | ✓        | -                    | ✓                    | **✓**               |
| [Photo Count](#koncept-limit-poctu-fotek) (+foto)                | -    | -        | -                    | ✓                    | **✓**               |
| [Delší expirace inzerátu](#koncept-pass-delsi-expirace-inzeratu) | -    | ✓        | -                    | ✓                    | **✓**               |
| [Rozšířená data](#koncept-rozsirena-data-inzeratu)               | -    | ✓        | -                    | ✓                    | **✓**               |
| [Inzerát: Brand](#koncept-inzerat-brand)                         | -    | ✓        | -                    | ✓                    | **✓**               |
| [Detail protistrany](#koncept-detail-protistrany)                | -    | ✓        | -                    | -                    | **✓**               |
| [Anti-topper](#koncept-anti-topper)                              | -    | ✓        | -                    | -                    | **✓**               |
| [Early Discovery](#koncept-early-discovery)                      | -    | ✓        | -                    | -                    | **✓**               |
| [Multi-Category](#koncept-multi-category)                        | -    | ✓        | -                    | -                    | **✓**               |
| **Kupóny (Měsíčně)**                                             |      |          |                      |                      |                     |
| [Early Discovery](#koncept-early-discovery)                      | -    | -        | 3×                   | -                    | **(Pass)**          |
| [Anti-topper](#koncept-anti-topper)                              | -    | -        | 3×                   | -                    | **(Pass)**          |
| [Early Delivery](#koncept-early-delivery)                        | -    | -        | -                    | 3×                   | **3×**              |
| [Mark](#koncept-mark)                                            | -    | 10x      | -                    | 3×                   | **3×**              |
| [Top](#koncept-top)                                              | -    | 5x       | -                    | 3×                   | **3×**              |
| [Top Maxxi](#koncept-top-maxxi)                                  | -    | 3x       | -                    | 3×                   | **3×**              |
| [Multi-Category](#koncept-multi-category)                        | -    | -        | -                    | 3×                   | **(Pass)**          |
| [Kontinuální nabídka](#koncept-kontinualni-nabidka)              | -    | 5x       | -                    | 3×                   | **5×**              |

> Pozn.: řádky „(Pass)“ znamenají, že v tom balíčku to není jako měsíční kupón, ale jako aktivní pass/benefit.

<a id="ekonomika-tokeny-ceny"></a>
### Tokeny (nabídka a ceny)
← [předchozí](#ekonomika-balicky) | [další](#ekonomika-cenik-rozsireni) →

Tady je jen ekonomický model: kurz + top-up balíčky.

- **Baseline kurz:** cca **1 CZK ≈ 2 Tokeny**

| Balíček        | Cena (CZK) | Získám Tokenů | Výhodnost     |
| :------------- | :--------: | :-----------: | :------------ |
| **Na zkoušku** | 149 Kč     | **300 T**     | Standard      |
| **Balík**      | 299 Kč     | **650 T**     | +50 T zdarma  |
| **Do zásoby**  | 599 Kč     | **1400 T**    | +200 T zdarma |

<a id="ekonomika-cenik-rozsireni"></a>
### Ceník rozšíření (kupóny / passy)
← [předchozí](#ekonomika-tokeny-ceny)

Pozn.:
- **Kupón → Pass** znamená: jednorázově aktivuješ a vznikne/obnoví se [Pass](#koncept-pass) na dobu trvání.
- **Exclusive** = dostupné jen v rámci [Předplatného](#koncept-predplatne) (nejde koupit samostatně).

| Co                                                               | Typ          | Efekt / Trvání                          | Cena (Token) |
| :--------------------------------------------------------------- | :----------- | :-------------------------------------- | -----------: |
| [Early Discovery](#koncept-early-discovery)                      | Kupón → Pass | 7 dnů                                   | 75           |
| [Early Delivery](#koncept-early-delivery)                        | Kupón        | Dodá jeden inzerát všem hned            | 20           |
| [Anti-topper](#koncept-anti-topper)                              | Kupón → Pass | 7 dnů                                   | Exclusive    |
| [Mark](#koncept-mark)                                            | Kupón → Pass | 7 dnů                                   | 20           |
| [Top](#koncept-top)                                              | Kupón → Pass | 7 dnů                                   | 40           |
| [Top Maxxi](#koncept-top-maxxi)                                  | Kupón → Pass | 3 dny                                   | 50           |
| [Multi-Category](#koncept-multi-category)                        | Kupón        | 1 použití (1 + 2 kategorie)             | 50           |
| [Detail protistrany](#koncept-detail-protistrany)                | Kupón → Pass | 7 dnů                                   | 50           |
| [Photo Count](#koncept-limit-poctu-fotek)                        | Kupón → Pass | 1 měsíc (+2 fotky)                      | 75           |
| [Aktivní inzeráty +20](#koncept-pass-aktivni-inzeraty-20)       | Kupón → Pass | 1 měsíc                                 | 140          |
| [Delší expirace inzerátu](#koncept-pass-delsi-expirace-inzeratu) | Kupón → Pass | 1 měsíc (odemkne „Za měsíc“ v expiraci) | 60           |
| [Payback](#koncept-payback)                                      | Pass         | Benefit předplatného                    | Exclusive    |
| [Kontinuální nabídka](#koncept-kontinualni-nabidka)              | Kupón → Pass | 1 měsíc (prodlouží život inzerátu)      | Exclusive    |

Related:
- [Ceník](#koncept-cenik)
- [Aktivace](#koncept-aktivace)
- [Tokeny](#koncept-tokeny)
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)
- [Předplatné](#koncept-predplatne)
- [Exclusive](#koncept-exclusive)

---

<a id="uvedeni-na-trh"></a>
## Uvedení na trh
← [předchozí](#ekonomika) | [další](#verejne-vystupovani) →

Největší nepřítel marketplace není konkurence. Je to prázdno. Takže launch není “globální release”, launch je **sekvenční roztočení trhu**.

Fázování:
- **Fáze 1: Online komunitní start (Discord)**
  - Úzký téma (typicky vapování).
  - Vysoká shoda a vyšší tolerance k nedokonalostem.
  - Cíl: první inzeráty, první transakce, první paměť trhu.

- **Fáze 2: Regionální expanze (Karlovy Vary + Ostrov + Sokolov)**
  - Jdu ven až ve chvíli, kdy to není mrtvá stránka.
  - Billboard / word-of-mouth má vést do reality, ne do prázdna.

**Founders (early adopters):**
- Prvních **300 registrovaných uživatelů** dostane systémový [Founders](#ekonomika-balicky) subscription na **6 měsíců od registrace**.
- Founders je normální předplatné z pohledu benefitů (viz tabulka [Předplatné (balíčky)](#ekonomika-balicky)), ale **nejde koupit** – uděluju ho jen jednou na start jako poděkování za spolupráci.
- V ceníku má vlastní sloupec „Founders“, aby bylo vidět, co navíc ti lidi dostali, ale v žádným obchodě se neobjevuje jako volba k nákupu.

Kontrakt komunikace:
- Neučím. Nevysvětluju. Rozdíl se má projevit chováním UI (viz [Landing](#koncept-landing), [Navigace](#koncept-navigace)).
- “Ticho” je default i v růstu: žádnej spam. Activity je autorita (viz [Notifikace](#koncept-notifikace)).

Slogany:
- „Hoď to sem taky.“

Related:
- [Landing](#koncept-landing)
- [Navigace](#koncept-navigace)
- [Notifikace](#koncept-notifikace)
- [Transakce](#koncept-transakce)

---

<a id="verejne-vystupovani"></a>
## Veřejné vystupování
← [předchozí](#uvedeni-na-trh) | [další](#retence) →

Veřejný vystupování není „marketing“. Je to forma transparentnosti: ukazuju, že to existuje, a že to žije. Kdo chce, najde si cestu. Kdo nechce, odpadne. To je v pořádku.

### Billboardy (Karlovy Vary)

Účel:
- povědomí + šok (filtr publika je záměr),
- něco, co si lidi pošlou mezi sebou, protože je to nezvyklý.

Formát (tvrdý kontrakt):
- jen 2 řádky:
  - tagline (striktně **1 řádek**),
  - `https://zbav-se.me` (povinně).
- bílé pozadí, minimum barev, žádný QR, žádný další text, žádný ikonky.
- čitelné z auta (cca 40–50 km/h).

Sazba (hierarchie):
- tagline = největší váha (primární fokus).
- druhý řádek:
  - `https://` je vizuálně slabší (menší váha / menší kontrast),
  - `zbav-se.me` je dominantní barvou a větší.

Tagline shortlist (varianta A, bez duplicit):
- „Prodávám. Neojebávám.“
- „Prodej bez sraní.“
- „Bez keců. Bez ojebů.“
- „Bazary? Ne.“
- „Beze sraní. Tečka.“
- „Prodávej. Neojebávej.“
- „Kupuj. Bez ojebů.“
- „Prodej. Neojebávej.“
- „Bez keců. Bez sraní.“

### YouTube Shorts

Kontrakt:
- mluvím **já** (ich‑forma, stejnej duch jako tenhle dokument),
- žádnej marketing ani nábor: žádný „přidej se“, žádný „stáhni teď“, žádný CTA nátlak,
- jen:
  - ukázky „co appka umí“,
  - update „co přibylo“ (a proč).
- tón: „tohle tu je, cuc na to“ (postoj), bez vysvětlování konkurence.

Formáty (aby to drželo tvar):
- 10–30 s „feature drop“ (1 věc, 1 kontrakt),
- 30–60 s „change log“ (co přibylo + proč),
- 30–60 s „princip“ (jedna zásada z Kodexu/UX a jak se projeví).

---

<a id="retence"></a>
## Retence
← [předchozí](#verejne-vystupovani) | [další](#odhady) →

Retence u mě není “návykovost”. Retence je **paměť trhu**.

Kontrakt:
- Inzerát je paměť. Ne mazaná stopa. Po expiraci je defaultně mimo listing, ale existuje dál (viz [Seznam inzerátů](#koncept-seznam-inzeratu)).
- Transakce je domluva. Domluva je dočasná. Po čase mizí bez milosti (viz [Transakce](#koncept-transakce), [Zprávy](#koncept-zpravy)).
- Uploady žijou podle rodiče: co je navázaný na inzerát může žít dlouho, co je navázaný na transakci má životnost transakce (viz [Uploady](#koncept-uploady)).

Smysl:
- Čím víc historie, tím míň stresu. Vidíš kontext cen a nabídky. Trh je čitelnější.

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Inzerát](#koncept-inzerat)
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Uploady](#koncept-uploady)

---

<a id="odhady"></a>
## Odhady
← [předchozí](#retence) | [další](#obsah) →

Křišťálová koule. Ale radši s jasnýma předpokladama než “věřím ve vesmír”.

Baseline předplatného (konzervativní):
- **Celková konverze:** ~**3 % MAU**

| Balíček    | Podíl MAU | Cena (Kč / měsíc) | ARPU příspěvek   |
| ---------- | --------: | ----------------: | ---------------: |
| Kupující   | 0,5 %     | 119               | 0,60             |
| Prodejce   | 2,0 %     | 229               | 4,58             |
| Pro        | 0,5 %     | 499               | 2,50             |
| **Celkem** | **3,0 %** |                   | **7,68 Kč ARPU** |

Extras baseline (cash-in model):
- **MAU:** 10 000
- **Podíl uživatelů, co si dokoupí tokeny:** 10 %
- **Průměrná útrata:** ~210 Kč

| Metrika             | Hodnota         |
| ------------------- | --------------: |
| Počet nakupujících  | 1 000           |
| Průměrná útrata     | ~210 Kč         |
| **Měsíční revenue** | **~210 000 Kč** |
| **ARPU (cash-in)**  | **~21,0 Kč**    |

Kombinovaný scénář (konzervativní, MAU 10k):

| Zdroj      | ARPU (Kč) | Měsíční revenue |
| ---------- | --------: | --------------: |
| Předplatné | 7,68      | ~76 800         |
| Extras     | 21,0      | ~210 000        |
| **Celkem** | **28,68** | **~286 800**    |

Related:
- [Ekonomika](#ekonomika)
- [Předplatné](#koncept-predplatne)
- [Tokeny](#koncept-tokeny)

---

<a id="obsah"></a>
## Obsah
← [předchozí](#odhady)

- [Pravidla dokumentu](#pravidla-dokumentu)
- [Kodex](#kodex)
  - [Důvěra jako výchozí stav](#duvera-default)
  - [Férová monetizace a neaktivita](#ferova-monetizace)
  - [Žádné pay-to-win](#no-p2w)
  - [Respekt k uživateli](#respekt)
  - [Otevřenost a odpovědnost](#otevrenost)
- [Směr produktu](#smer-produktu)
  - [Identita](#identita)
  - [Tone of Voice](#tov)
  - [Produktové cíle](#produktove-cile)
  - [UX principy](#ux-principy)
  - [Komunikace a transparentnost](#komunikace)
- [Konkurenceschopnost](#konkurenceschopnost)
  - [Co umím líp](#co-umim-lip)
  - [V čem je má slabina (a proč s tím počítám)](#slabina)
  - [Co vědomě nedělám](#co-nedelam)
- [Koncepty](#koncepty)
  - [Uživatel](#koncept-uzivatel)
  - [Kategorie](#koncept-kategorie)
  - [Seasons](#koncept-seasons)
  - [Lokace](#koncept-lokace)
  - [Uploady](#koncept-uploady)
  - [Galerie](#koncept-galerie)
  - [Inzerát](#koncept-inzerat)
  - [Inzerát: Titulek](#koncept-inzerat-titulek)
  - [Inzerát: Cena](#koncept-inzerat-cena)
  - [Inzerát: Předání](#koncept-inzerat-delivery)
  - [Inzerát: Záruka](#koncept-inzerat-warranty)
  - [Inzerát: Stav (A–F)](#koncept-inzerat-stav)
  - [Inzerát: Stáří (A–F)](#koncept-inzerat-stari)
  - [Inzerát: Popis](#koncept-inzerat-popis)
  - [Inzerát: Co chci vyzdvihnout / Chci být upřímný](#koncept-inzerat-pros-cons)
  - [Inzerát: Video (ne)](#koncept-inzerat-video)
  - [Inzerát: Brand](#koncept-inzerat-brand)
  - [Draft](#koncept-draft)
  - [Feed](#koncept-feed)
  - [Hledat](#koncept-hledat)
  - [Seznam inzerátů](#koncept-seznam-inzeratu)
  - [Release window](#koncept-release-window)
  - [Multi-Category](#koncept-multi-category)
  - [Oblíbené](#koncept-oblibene)
  - [Citlivost](#koncept-citlivost-inzeratu)
  - [Ignor](#koncept-ignorace-inzeratu)
  - [Flag inzerátu](#koncept-flag-inzeratu)
  - [Flag uživatele](#koncept-flag-uzivatele)
  - [Transakce](#koncept-transakce)
  - [Zprávy](#koncept-zpravy)
  - [Notifikace (Activity)](#koncept-notifikace)
  - [Dispute](#koncept-dispute)
  - [Automatické ukončení: Inzerát](#koncept-automaticke-ukonceni-inzeratu)
  - [Pass: Delší expirace inzerátu (Za měsíc)](#koncept-pass-delsi-expirace-inzeratu)
  - [Pass: Aktivní inzeráty +20](#koncept-pass-aktivni-inzeraty-20)
  - [Automatické ukončení: Transakce](#koncept-automaticke-ukonceni-transakce)
  - [Limit počtu feedů](#koncept-limit-poctu-feedu)
  - [Limit počtu fotek nad inzerátem](#koncept-limit-poctu-fotek)
  - [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu)
  - [Palce (Like/Dislike)](#koncept-palce)
  - [Karma (Like/Dislike)](#koncept-karma)
  - [XP](#koncept-xp)
  - [Metrika: Karma](#koncept-metrika-karma)
  - [User Eventy](#koncept-user-eventy)
  - [Metriky prodávajícího](#koncept-metriky-prodavaciho)
  - [Detail protistrany](#koncept-detail-protistrany)
  - [Metriky kupujícího](#koncept-metriky-kupujiciho)
  - [Metrika: Reakční doba](#koncept-metrika-reakcni-doba)
  - [Metrika: Odmítnutí bez interakce](#koncept-metrika-odmitnuti-bez-interakce)
  - [Metrika: Resolved rate](#koncept-metrika-resolved-rate)
  - [Metrika: Expirace (transakcí)](#koncept-metrika-expirace)
  - [Metrika: Vytížení (paralelní obchody)](#koncept-metrika-vytizeni)
  - [Metrika: Aktivita](#koncept-metrika-aktivita)
  - [Metrika: Flag rate](#koncept-metrika-flag-rate)
  - [Metrika: Closer rate](#koncept-metrika-closer-rate)
  - [Metrika: Decision rate](#koncept-metrika-decision-rate)
  - [Metrika: Score (A–F)](#koncept-metrika-score)
  - [Metrika: Visible](#koncept-metrika-inzeratu-visible)
  - [Metrika: Impression](#koncept-metrika-inzeratu-impression)
  - [Metrika: View](#koncept-metrika-inzeratu-view)
  - [Metrika: Anti-topper](#koncept-metrika-inzeratu-anti-topper)
  - [Metrika: Thumbs](#koncept-metrika-inzeratu-thumbs)
  - [Metrika: Ignored](#koncept-metrika-inzeratu-ignored)
  - [Metrika: Transactions](#koncept-metrika-inzeratu-transactions)
  - [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
  - [Pass](#koncept-pass)
  - [Kupón](#koncept-kupon)
  - [Tokeny](#koncept-tokeny)
  - [Aktivace](#koncept-aktivace)
  - [Ceník](#koncept-cenik)
  - [Exclusive](#koncept-exclusive)
  - [Předplatné](#koncept-predplatne)
  - [Automatické ukončení: Předplatné (neaktivita)](#koncept-automaticke-ukonceni-predplatneho)
  - [Tokeny: Získávání](#koncept-tokeny-ziskavani)
  - [Early Discovery](#koncept-early-discovery)
  - [Early Delivery](#koncept-early-delivery)
  - [Mark](#koncept-mark)
  - [Top](#koncept-top)
  - [Top Maxxi](#koncept-top-maxxi)
  - [Anti-topper](#koncept-anti-topper)
  - [Payback](#koncept-payback)
  - [Kontinuální nabídka](#koncept-kontinualni-nabidka)
  - [Landing](#koncept-landing)
  - [Navigace](#koncept-navigace)
  - [Můj účet](#koncept-muj-ucet)
  - [UI: Rámec](#koncept-ui-ramec)
  - [UI: Dashboard](#koncept-ui-dashboard)
  - [UI: Chci prodávat](#koncept-ui-seller)
  - [UI: Chci nakupovat](#koncept-ui-buyer)
  - [UI: Rozšíření](#koncept-ui-rozsireni)
  - [UI: Bonusy](#koncept-ui-bonusy)
  - [Ban](#koncept-ban)
- [Ekonomika](#ekonomika)
  - [Předplatné (balíčky)](#ekonomika-balicky)
  - [Tokeny (nabídka a ceny)](#ekonomika-tokeny-ceny)
  - [Ceník rozšíření (kupóny / passy)](#ekonomika-cenik-rozsireni)
- [Uvedení na trh](#uvedeni-na-trh)
- [Veřejné vystupování](#verejne-vystupovani)
- [Retence](#retence)
- [Odhady](#odhady)
