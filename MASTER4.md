# MASTER

Tohle je finální „single source of truth“ pro Zbav-se.me. Je to moje produktová ústava: popisuje **co je pravda** (koncepty, pravidla, hranice) a **proč**. Neřeší, jak to technicky nakóduju.

Co tu najdeš:
- **Směr produktu**: postoj a zásady, který mi nedovolí udělat z toho další bazar.
- **Kodex**: tvrdý hranice férovosti (monetizace, pay-to-win, data, manipulace).
- **Koncepty**: „jak funguje X?“ na jednom místě (inzerát, draft, feed, transakce, citlivost, limity…).
- **Ekonomika**: model nabídky ([tokeny](#koncept-tokeny)/[kupóny](#koncept-kupon)/[passy](#koncept-pass)/[předplatné](#koncept-predplatne)) a pravidla aktivace.

Jak to číst:
- Kontrakt „co tu není, neexistuje“ držím natvrdo v kapitole [Pravidla dokumentu](#pravidla-dokumentu) a nikde jinde ho už nerozmělňuju.

<a id="pravidla-dokumentu"></a>
## Pravidla dokumentu

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

Kodex je moje „no bullshit“ vrstva. Není to právní text. Je to sada pravidel, který držím i ve chvíli, kdy by bylo strašně lákavý je ohnout kvůli růstu nebo penězům.

Jestli nějaká feature nebo monetizační nápad poruší kodex, je to automaticky špatně. Ne „možná“. Ne „nějak to vysvětlíme“. Prostě špatně.

<a id="duvera-default"></a>
### Důvěra jako výchozí stav

Related:
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Notifikace](#koncept-notifikace)
- [Retence](#retence)
- [Ekonomika](#ekonomika)

Důvěra u mě není odměna ani razítko po „ověření identity“. Je to vlastnost prostředí.

Co z toho plyne:
- Nehoním lidi přes občanky. Držím rámec, ve kterým se dá chovat normálně.
- Hranice jsou jasný a vymahatelný: co nejde, prostě nejde (a nejde to obcházet).
- Odpovědnost začíná přijetím: nezájem není zločin, přijetí je závazek. (Viz [Transakce](#koncept-transakce).)
- „Zavřeno je zavřeno“ je fyzika systému, ne prosba. (Viz [Transakce](#koncept-transakce).)

<a id="ferova-monetizace"></a>
### Férová monetizace a neaktivita

Related:
- [Ekonomika](#ekonomika)
- [Předplatné](#koncept-predplatne)
- [Tokeny](#koncept-tokeny)
- [Aktivace](#koncept-aktivace)
- [Ceník](#koncept-cenik)
- [Exclusive](#koncept-exclusive)

Paywall není past. Je to cedule u dveří: vidíš ji dřív, než do nich vejdeš.

Co držím:
- Platí se za hodnotu, ne za nátlak.
- Žádný gotcha momenty typu „nechám tě to skoro dodělat a pak ti to seberu“.
- Zrušení předplatnýho nesmí být labyrint ani psychologická válka. (Detaily patří do [Ekonomiky](#ekonomika).)
- Neaktivita je signál „už to teď nepoužívám“. Nechci někoho potichu cucat jen proto, že zapomněl.

<a id="no-p2w"></a>
### Žádné pay-to-win

Related:
- [Ekonomika](#ekonomika)
- [Mark](#koncept-mark)
- [Top](#koncept-top)
- [Top Maxxi](#koncept-top-maxxi)
- [Anti-topper](#koncept-anti-topper)
- [Ceník](#koncept-cenik)


Peníze u mě nesmí dělat z lidí „lepší občany“. Nechci trh, kde vyhrává ten, kdo nejvíc zaplatí, a ostatní jen čumí na zadek.

To znamená:
- Platíš za nástroje, pohodlí a signál. Ne za lež.
- Placený věci jsou pojmenovaný a viditelný. Žádný skrytý boosty.
- Neplatící nejsou potichu penalizovaný. Žádnej tajnej handicap.

<a id="respekt"></a>
### Respekt k uživateli

Related:
- [Notifikace](#koncept-notifikace)
- [Citlivost](#koncept-citlivost-inzeratu)
- [Ignor](#koncept-ignorace-inzeratu)
- [Retence](#retence)
- [UI: Rámec](#koncept-ui-ramec)
- [Transakce](#koncept-transakce)


Uživatel není cíl pro optimalizaci metrik. Je to člověk, co si chce v klidu prodat nebo koupit věc.

Respekt v praxi:
- Neotravovat. Notifikace jsou informace, ne bič. (Viz [Notifikace](#koncept-notifikace).)
- Nemanipulovat. Žádný confirm-shaming, žádný dark patterns.
- Dát kontrolu. Filtry, ignor, citlivost, ukončení. (Viz [Citlivost](#koncept-citlivost-inzeratu), [Ignor](#koncept-ignorace-inzeratu).)
- Neznehodnocovat čas. Minimum kroků, žádný zbytečný potvrzování.
- Nebýt creepy. Data sbírám s jasným účelem pro produkt. Ne pro reklamní profilování. (Viz [Retence](#retence).)

<a id="otevrenost"></a>
### Otevřenost a odpovědnost

Related:
- [Komunikace a transparentnost](#komunikace)
- [Kodex](#kodex)
- [Seznam inzerátů](#koncept-seznam-inzeratu)

Nejsem anonymní „tým“ a nechci se za nic schovávat. Když něco poseru, je to moje. Když něco funguje, je to taky moje.

Co z toho dělám standard:
- Pravidla nejsou magie. Když systém něco dělá (gating, řazení, omezení), umím říct proč.
- Změny nejsou tichý ojeb. Když změním něco zásadního, přiznám to.
- Co jde vyřešit strukturou a mechanikama, řeším strukturou a mechanikama. Ne ručním admin cirkusem.

---

<a id="smer-produktu"></a>
## Směr produktu

Tady jsou pravidla, který mi nedovolí udělat z toho další obyč bazar. Držím se jich i ve chvíli, kdy budu unavenej, ve stresu a budu chtít „jen udělat malou výjimku“.

Platí pár jednoduchých věcí:
- **Klid a jistota jsou cíl.** Úspěch není wow-efekt, ale moment, kdy uživatel nic neřeší.
- **Když to nejde pochopit samo, je to špatně.** Ne „uživatel je blbej“, ale já jsem to dojebal.
- **Minimum keců, maximum signálu.** UI se chová fyzikálně přirozeně, žádný kejkle.
- **Důvěra není feature.** Je to výsledek: konzistence, transparentnost, férový pravidla.

<a id="identita"></a>
### Identita

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

Related:
- [Transakce](#koncept-transakce)
- [Citlivost](#koncept-citlivost-inzeratu)
- [Kodex](#kodex)
- [Ekonomika](#ekonomika)


Nechci stavět „appku“. Chci postavit **trh**, kterej je čitelnej a předvídatelnej:

- **Ticho = úspěch.** Když uživatel nic neřeší, vyhrál jsem.
- **Známý mentální model, ale bez bordelu.** List → detail → zájem → domluva → konec.
- **Minimum psaní, maximum faktů.** Timeline událostí místo románů.
- **Lokální základ.** Poloha, vzdálenost, radius.
- **Definitivní konce.** „Zavřeno je zavřeno“ (viz [Transakce](#koncept-transakce)).
- **Žádný obcházení.** Brány jsou brány (viz [Citlivost](#koncept-citlivost-inzeratu)).

<a id="ux-principy"></a>
### UX principy

Related:
- [Kodex](#kodex)
- [Ekonomika](#ekonomika)


> **Když to potřebuje nápovědu, je to špatně navržený.**

Moje pravidla UX:
- **Konzistence > chytrost.** Výjimky zabíjejí důvěru.
- **Empty state není prázdno. Je to status.** Vzor: **status → krátký proč → jedno jasný CTA**.
- **Prázdno je záměr.** Méně šumu = méně nejistoty.
- **Emoce můžou být v textu. Akce musí být mechanická.**
- **UI je interaktivní hned.** Animace jsou luxus, ne blokace. Respektuju `prefers-reduced-motion`.

<a id="komunikace"></a>
### Komunikace a transparentnost

Related:
- [Kodex](#kodex)
- [Ekonomika](#ekonomika)


Nejrychlejší způsob, jak zabít důvěru, je dělat tajnosti a pak se tvářit, že „to je pro tvoje dobro“. Já na to seru.

Co je u mě povinný standard:
- **Jsem vidět.** Žádný anonymní „tým“.
- **Monetizace je přiznaná, čitelná a férová.** Žádný gotcha momenty (viz [Kodex](#kodex), [Ekonomika](#ekonomika)).
- **Zdroják je veřejně k nahlédnutí (source-available, ne OSS).**
- **Transparentní účet** je viditelně vytaženej i na landingu.
- **Žádný prodej dat třetím stranám.** Tečka.
- **Změny nejsou tichý ojeb.** Když změním něco zásadního, přiznám to.

---

<a id="konkurenceschopnost"></a>
## Konkurenceschopnost

Konkurence (Sbazar, Bazoš, FB Marketplace a spol.) není „špatná“. Je to prostě starej svět: hodně šumu, hodně náhody, hodně domlouvání v mlze, málo jistoty. Lidi tam prodávají, protože tam „někdo je“, ne proto, že by to bylo příjemný.

Moje výhoda není jedna „killer feature“. Moje výhoda je **charakter trhu** a **klidnej systém**, kterej snižuje mentální dluh. Většina marketplace dělá opak: zvyšuje stres, zvyšuje nejistotu, a pak to maskuje notifikacema, badgeama a „algoritmem“.

> Cíl není porazit všechny. Cíl je být tak příjemnej, že návrat do starýho chaosu bude bolet.

<a id="co-umim-lip"></a>
### Co umím líp

Related:
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Lokace](#koncept-lokace)
- [Feed](#koncept-feed)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Kodex](#kodex)


1) **Domluva: normální chat + strukturovaný fakta navíc**  
Lidi si můžou psát normálně. Rozdíl je v tom, že systém drží fakta vedle toho: zájem, přijetí/odmítnutí, čas, místo, ukončení. (Viz [Transakce](#koncept-transakce), [Zprávy](#koncept-zpravy).)

2) **Klidný UX, co nevysvětluje a netlačí**  
Žádný školení, žádný hinty, žádný „tady klikni“. Když to nejde pochopit samo, je to moje chyba.

3) **Lokace jako core, ne jako schovaná mapa pro trpělivý**  
Poloha je součást inzerátu, vzdálenost je signál, radius je nástroj. (Viz [Lokace](#koncept-lokace), [Feed](#koncept-feed).)

4) **„Zavřeno je zavřeno“ + žádný obcházení**  
Transakce má začátek a konec. Konec je definitivní. Další kontakt = nová transakce. (Viz [Transakce](#koncept-transakce).)

5) **Ochrana prodejce jako feature**  
Odpovědnost začíná až přijetím. `pending` není kanál pro spam. (Viz [Transakce](#koncept-transakce).)

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

<a id="slabina"></a>
### V čem je má slabina (a proč s tím počítám)

Related:
- [Uvedení na trh](#uvedeni-na-trh)
- [Notifikace](#koncept-notifikace)


- **Network efekt:** Na startu tam nebude „všechno“. To je gravitace, ne bug. Řeším to sekvenčním startem (viz [Uvedení na trh](#uvedeni-na-trh)).
- **Míň impulsního prodeje přes chaos:** Míň šumu může krátkodobě vypadat pomaleji. Dlouhodobě je to zdravější trh.
- **Transparentnost je závazek:** Znamená míň kliček a víc práce. Správně.
- **Nejsem pro každýho:** Někoho tenhle styl odradí. Filtr je záměr.
- **Průhlednost přitahuje i hejtry:** Počítám s tím. Je to cena za důvěru.

<a id="co-nedelam"></a>
### Co vědomě nedělám

Related:
- [Notifikace](#koncept-notifikace)


- **Žádný prodej dat.** Nikdy.
- **Žádný dark patterns.** Žádný „nejde odejít“, schovaný volby, vynucený souhlasy.
- **Žádný pay-to-win.** Platíš za nástroje, ne za „vítězství“.
- **Žádný spam-notifikace a onboarding maily.** Informace ano, nátlak ne (viz [Notifikace](#koncept-notifikace)).
- **Žádný „AI řeší všechno“.** Důvěra stojí na prevenci, pravidlech a struktuře.
- **Žádný video feed.** Nechci dělat TikTok.
- **Žádný vysvětlování rozdílů proti konkurenci.** Rozdíl se má projevit chováním UI.

---

<a id="koncepty"></a>
## Koncepty

Tady je katalog reality. Každá otázka „jak funguje X?“ má odpověď v jednom konceptu. Jinde je maximálně odkaz.

Pravidlo proti duplicitám (znovu a naposled):
- Když něco patří sem, nepíšu to nikam jinam.
- Křížový věci mají vlastní autoritu (typicky [Citlivost](#koncept-citlivost-inzeratu), [Seznam inzerátů](#koncept-seznam-inzeratu), [Limit počtu feedů](#koncept-limit-poctu-feedu), [Limit fotek](#koncept-limit-poctu-fotek), [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu), [Ekonomika](#ekonomika)).

---

<a id="koncept-uzivatel"></a>
### Uživatel

Related:
- [Feedy](#koncept-feed)
- [Drafty](#koncept-draft)
- [Inzeráty](#koncept-inzerat)
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Inbox](#koncept-notifikace)


Uživatel je core entita. Je na něj navázaný skoro všechno (inzeráty, drafty, feedy, transakce, inbox), ale osobní data držím na minimu. Je to vědomá brzda: všechno navíc je jen riziko a dluh.

Co uživatel reálně ovládá:
- kontext trhu přes [Feedy](#koncept-feed),
- rozpracovaný věci přes [Drafty](#koncept-draft),
- publikovaný věci přes [Inzeráty](#koncept-inzerat),
- obchodní kontext přes [Transakce](#koncept-transakce) a [Zprávy](#koncept-zpravy),
- „co se stalo“ přes [Inbox](#koncept-notifikace),
- hranice obsahu přes [Citlivost](#koncept-citlivost-inzeratu) a osobní úklid přes [Ignor](#koncept-ignorace-inzeratu),
- aktivace a limity přes [Ekonomiku](#ekonomika) a [Limit počtu feedů](#koncept-limit-poctu-feedu), [Limit fotek](#koncept-limit-poctu-fotek), [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu).

Kontrakt (co si hlídám):
- Účet je nástroj, ne sociální profil.
- Preferuju nastavení a hranice před „profilovkama a bio“.
- Když něco vypadá jako „sbíráme to, protože můžeme“, je to u mě automaticky špatně.

---

<a id="koncept-kategorie"></a>
### Kategorie

Related:
- [Draft](#koncept-draft)
- [Feed](#koncept-feed)


Kategorie je organizační vrstva trhu. Je to kontext, ve kterým dává smysl jinej jazyk a jiný filtry. Držím ji jednoduchou, protože složitá taxonomie je jen bordel pro lidi.

Kategorie nese mimo jiné:
- **název**
- **slug**
- **locale**

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

---

<a id="koncept-lokace"></a>
### Lokace

Related:
- [Feed](#koncept-feed)
- [Inzerát](#koncept-inzerat)
- [Transakce](#koncept-transakce)


Lokace je autorita na polohu. Neukládám random texty typu „u Pepy na rohu“. Když se bavíme o poloze, bavíme se o jednom konkrétním záznamu, na kterej se dá odkázat.

K čemu lokace slouží:
- [Feed](#koncept-feed): radius, řazení podle vzdálenosti, kontext „domov vs. chalupa“.
- [Inzerát](#koncept-inzerat): povinná poloha jako signál „kde to je“.
- [Transakce](#koncept-transakce): domluva místa předání jako strukturovaná informace (ne román ve zprávě).

Kontrakt:
- Vstup od uživatele vždycky protáhnu geolokační službou, která vrátí autoritativní záznam a garantuje existenci vstupu.
- Lokace je veřejnej signál. Když ji zadáváš, dáváš ven informaci, která může vést k fyzický návštěvě.
- Míň přesnosti může být víc bezpečnosti. Kdo chce být opatrnej, nesmí být nucenej dávat „pin na dveře“.

---

<a id="koncept-uploady"></a>
### Uploady

Related:
- [Inzerátu](#koncept-inzerat)
- [Zprávách](#koncept-zpravy)
- [Transakce](#koncept-transakce)


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

---

<a id="koncept-inzerat"></a>
### Inzerát

Related:
- [Uživatel](#koncept-uzivatel)
- [Kategorie](#koncept-kategorie)
- [Lokace](#koncept-lokace)
- [Uploady](#koncept-uploady)
- [Ekonomika](#ekonomika)
- [Draftu](#koncept-draft)


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
- Stav inzerátu je tvrdý enum. To je autorita. Žádný vibe: `live` / `expired` / `closed` / `sold`.

| Stav | Co to znamená | Feed (default) | Přímý odkaz / detail | Interakce |
| --- | --- | --- | --- | --- |
| `live` | aktivní, k dispozici pro nový obchod | ano | ano | vše relevantní (zájem, ignor, oblíbené, flag…) |
| `expired` | vypršela expirace (`expiresAt`), automatický konec | ne (jen přes explicitní filtr / historický režim) | ano (read-only) | zakázáno, výjimka **flag** |
| `closed` | prodejce to ručně zabil | ne (stejně jako `expired`) | ano (read-only) | zakázáno, výjimka **flag** |
| `sold` | prodáno, není k dispozici pro nový obchod | ne (není k dispozici) | ano (read-only) | zájem ne; bezpečný věci typu flag / undo ignor ok |

Poznámky:
- [Draft](#koncept-draft) není stav inzerátu. Draft je separátní entita.
- `deleted` neexistuje. Inzeráty nemažu. Jen mění stav. Paměť trhu je záměr.
- `sold` se **nepočítá** jako aktivní (viz [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu)).

---

<a id="koncept-draft"></a>
### Draft

Related:
- [Inzerát](#koncept-inzerat)
- [Limit aktivních inzerátů](#koncept-limit-aktivnich-inzeratu)


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

---

<a id="koncept-feed"></a>
### Feed

Related:
- [Kategorie](#koncept-kategorie)
- [Lokace](#koncept-lokace)
- [Limit počtu feedů](#koncept-limit-poctu-feedu)
- [Citlivost](#koncept-citlivost-inzeratu)
- [Ignor](#koncept-ignorace-inzeratu)
- [Inzerátu](#koncept-inzerat)


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
- feed nikdy neobchází globální brány (viz [Citlivost](#koncept-citlivost-inzeratu), [Ignor](#koncept-ignorace-inzeratu), stav [Inzerátu](#koncept-inzerat), release window… — pravidla listingu drží [Seznam inzerátů](#koncept-seznam-inzeratu)).

---

<a id="koncept-citlivost-inzeratu"></a>
### Citlivost

Related:
- [Feed](#koncept-feed)
- [Inzerát](#koncept-inzerat)


Obsah není jen „co prodávám“. Obsah je i to, *jestli to můžeš vůbec vidět*. Citlivost je hard gate: chrání veřejnej prostor před obsahem, kterej určitá skupina lidí buď **nechce**, nebo ho **ani nesmí** vidět.

Úrovně (stupňovaně): `common < adult < sensitive < restricted`.

| Úroveň | Enum | Poznámka |
| --- | --- | --- |
| Běžný | `common` | default |
| Pro dospělé | `adult` | 18+ kontext |
| Citlivé | `sensitive` | věci „na hraně“, co nechci cpát všem |
| Omezené | `restricted` | zákonný omezení / oprávnění (systém ho **neověřuje**) |

Gating a viditelnost (dvoufázově, schválně):
- **Profil** = nastavíš maximum (co *smíš / jsi ochotnej* vidět).
- **Feed/Hledat** = v rámci maxima si **vědomě** zapneš, co *chceš* vidět. (Viz [Feed](#koncept-feed).)

Hard gate pravidla:
- V listingu (feed/search/seznam) se cokoliv nad maximum **vůbec nedostane do výsledků**.
- Na detail přes přímý odkaz vracím při nesouladu maxima **404** (žádný obcházení přes link, žádný „aspoň víš že to existuje“).
- Citlivost je **jediná** věc, která smí detail tvrdě schovat (404). Ostatní brány můžou ovlivnit seznam, ale nemaj dělat „ten inzerát pro tebe neexistuje“. (Viz [Inzerát](#koncept-inzerat).)

Odpovědnost:
- Citlivost je primárně sebeoznačení prodejce.
- Opakovaný a zjevný zneužití (maskování citlivýho/omezenýho jako běžný) je porušení pravidel a důvod k zásahu.

---

<a id="koncept-ignorace-inzeratu"></a>
### Ignor

Related:
- [Inzerát](#koncept-inzerat)
- [Feedy](#koncept-feed)
- [Flag inzerátu](#koncept-flag-inzeratu)


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

---

<a id="koncept-flag-inzeratu"></a>
### Flag inzerátu

Related:
- [Inzerátu](#koncept-inzerat)
- [Ignor](#koncept-ignorace-inzeratu)


Flag je „tady je problém“, ne „nelíbí se mi to“. Je to bezpečnostní signál a reputační stopa. Nechci z toho dělat tribunál ani automatickýho soudce.

Kontrakt:
- Jde **jen z detailu** [Inzerátu](#koncept-inzerat) (ne z feedu, ne ze zpráv).
- Je to **toggle**: nahlásit / vzít zpět.
- Žádný důvody ani formuláře — jen čudlík.
- Nemá automatický efekt typu „smazáno“ / „shadowban“ / „auto-ban“.

Co s tím dělám:
- promítá se do metrik (flag rate) a je to signál „něco smrdí“,
- je to signál pro ruční rozhodnutí (ne pro autopilota).

Flag není [Ignor](#koncept-ignorace-inzeratu):
- ignor = „nezajímá mě to“,
- flag = „porušuje pravidla / ojeb / nebezpečný“.

---

<a id="koncept-flag-uzivatele"></a>
### Flag uživatele

Related:
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Ban](#koncept-ban)

Nahlásit člověka bez kontextu je toxická zbraň. Proto to gateuju chováním systému.

Kontrakt:
- Je to tvrdá akce dostupná **jen v rámci transakce** a až po `open`.
- Není to toggle.
- Stejně jako u inzerátu: žádný auto-efekt, jen signál a metrika.

---

<a id="koncept-limit-poctu-feedu"></a>
### Limit počtu feedů

Related:
- [Ceník](#koncept-cenik)
- [Aktivace](#koncept-aktivace)


Limit není trest. Je to mantinel, aby se z toho nestal inventář nekonečna.

Kontrakt:
- Do limitu se počítají jen feedy typu `user` (uložený „moje seznamy“).
- `search` je mimo limity (nezabírá slot).
- Když jsi nad limitem, feedy nemažu. Jen ty nadlimitní v UI skryju/disable (existují, ale uživatel ví, že je má navíc).

---

<a id="koncept-limit-poctu-fotek"></a>
### Limit počtu fotek nad inzerátem

Related:
- [Ekonomiku](#ekonomika)
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)


Fotky jsou primární obsah inzerátu. Limit fotek je brzda proti šumu a zároveň jasný místo, kam se dá férově navázat „komfort navíc“.

Kontrakt:
- Defaultně držím krátkou galerii (baseline je **3 fotky**).
- Navýšení je oprávnění přes [Ekonomiku](#ekonomika): typicky `Photo Count` ([Kupón](#koncept-kupon) → [Pass](#koncept-pass)) = **+2 fotky na 1 měsíc**.
- Po skončení [Passu](#koncept-pass) se už nahraný fotky nemažou. Zůstávají beze změny — jen znovu platí aktuální limit pro další přidávání.
- V balíčcích se to může projevit jako vyšší strop (např. **3 → 5**, u Pro i víc).

---

<a id="koncept-limit-aktivnich-inzeratu"></a>
### Limit aktivních inzerátů

Related:
- [Passu](#koncept-pass)
- [Draft](#koncept-draft)
- [Ekonomiku](#ekonomika)
- [Kupón](#koncept-kupon)
- [Tokeny](#koncept-tokeny)


Limit aktivních inzerátů drží hygienu trhu a chrání pozornost. Nechci, aby se z feedu stal hřbitov a z prodejce správce inventáře.

Kontrakt:
- Počítám jen inzeráty ve stavu `live`.
- `sold` se nepočítá jako aktivní.
- Když jsi nad limitem (typicky po vypršení [Passu](#koncept-pass)), existující `live` nechám běžet.
- Jen nepustím vytvořit/publikovat další `live` — aktivuje se **Draft Gate** (viz [Draft](#koncept-draft)).
- Odemknutí limitu je přes [Ekonomiku](#ekonomika): [Kupón](#koncept-kupon)/pas (typicky tier `Aktivní inzeráty 10/20`), nebo [Tokeny](#koncept-tokeny) v hodnotě toho kupónu.

---

<a id="koncept-transakce"></a>
### Transakce

Related:
- [Zprávách](#koncept-zpravy)


Transakce je obálka obchodu: stav, pravidla a timeline. **Stojí na [Zprávách](#koncept-zpravy)** — zprávy jsou obsah, transakce je kontext.

Základní kontrakty:
- 1 vlákno = 1 transakce = 1 konkrétní inzerát (izolovaný kontext).
- Stavový model je autorita tady v tomhle dokumentu.
- „Zavřeno je zavřeno“: terminal stavy jsou read-only, nejde re-open.
- „Zavřít bez emocí“ je `rejected`: moje volba odmítnout a dát protistraně hint „OK, tady cesta nevede“.

Stavový model (prakticky):

| Stav | Kdy | Co je povolený |
| --- | --- | --- |
| `pending` | kupující klikne „Mám zájem“ | kupující **nemůže psát**; prodejce jen **Přijmout** / **Odmítnout** |
| `open` | prodejce přijme | odemknou se zprávy + strukturovaný widgety |
| `resolved` | prodejce označí „vyřešeno“ | běží dál, dokud kupující nedá finále (`success`/`closed`) |
| `dispute` | někdo přepne do sporu | běží dál (řeší se), dokud kupující nedá finále (`success`/`closed`) |
| `rejected` | prodejce odmítne („bez emocí“) | read-only |
| `expired` | transakce vyprší (nikdo nic nedotáhl) | read-only |
| `success` | kupující potvrdí „dopadlo to“ | read-only |
| `closed` | kupující zavře (ukončí pro sebe) | read-only |

Poznámky ke koncům:
- `rejected` = prodejce odmítl („zavřít bez emocí“).
- `closed` = kupující to zavřel z vlastní vůle.

Anti-spam a ochrana prodejce:
- Prodejce může zájem **ignorovat bez postihu**. Odpovědnost začíná až přijetím.
- Kupující v `pending` **nemůže spamovat zprávama**.
- Odmítnutí je legitimní volba bez vysvětlování. Žádnej mentální dluh.

Timeline místo chatu:
- Detail transakce je časová osa faktů: systémové stavy + text, když chtějí, + strukturovaný widgety, když je text zbytečnej.
- Systém drží pravdu vedle toho, i když si lidi píšou normálně.

Retence a čistky:
- Transakce je dočasná věc. Po finálním stavu proběhne úklid ve dvou krocích:
  - hned: mažu všechno strukturovaný (viz typy zpráv v [Zprávách](#koncept-zpravy) — všechno krom `message_text` a `message_gallery`),
  - po **3 měsících**: hard delete celé transakce (včetně textů a fotek).

---

<a id="koncept-zpravy"></a>
### Zprávy

Related:
- [Lokace](#koncept-lokace)


Zprávy jsou obsah transakce. Text je volnost pro lidi, ale systém drží fakta vedle toho.

Typy zpráv (co systém umí):

| Typ | Co to je | Poznámka |
| --- | --- | --- |
| `message_text` | klasická textová zpráva | volnost pro lidi |
| `message_gallery` | obrázek (jedna fotka) | důkaz / doplnění bez slohovky |
| `message_location` | poloha | strukturovaná [Lokace](#koncept-lokace) |
| `message_package` | info o balíku | tracking / dopravce jako fakt v timeline |
| `message_personal` | osobní info | kontakty a další citlivý údaje |
| `message_system` | systémová zpráva bez uživatele | fakt „co se stalo“ (např. změna stavu) |

Tracking (zásilka):
- Tracking není bezpečnostní feature. Je to jen fakt v timeline.
- Tracking number je volitelný.
- Když tracking number není, nic navíc nepíšu.

Retence po ukončení transakce:
- Všechny typy **kromě** `message_text` a `message_gallery` se po ukončení transakce **mažou**.

Kontrakt:
- V `pending` se zprávy neposílají.
- Strukturovaný data ukládám odděleně, aby šla cíleně mazat hned po ukončení transakce.

---

<a id="koncept-notifikace"></a>
### Notifikace (Inbox)

Related:
- [Zprávy](#koncept-zpravy)
- [Transakce](#koncept-transakce)
- [Inzerát](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)

Notifikace nejsou nástroj na otravování. Jsou to **zrcadlo reality**, aby člověk věděl, co se stalo, a nemusel paranoidně refreshovat appku.

Filosofie ticha:
- Defaultní stav je ticho. Žádný umělý FOMO.
- Notifikace vzniká jen z reálný události (typicky změna stavu [Transakce](#koncept-transakce) nebo příchozí [Zpráva](#koncept-zpravy)).

Inbox First:
- Inbox je jediný zdroj pravdy pro „co se stalo“.
- Všechno ostatní (push/email) je jen mirror toho, co už existuje v Inboxu.

Email jako zrcadlo:
- Email není primární kanál. Je to volitelný forward/digest toho, co už je v Inboxu.
- Když email nedojde, nic se „neztratilo“. Autorita je Inbox.

Kontrakt:
- Notifikace se nesmí stát další paralelní svět. Když něco umím zjistit v Inboxu, nesmím k tomu psát nový pravidla do emailu/pushe.
- Deduplikace je normální (nebudu spamovat ten samej fakt víckrát, jen protože to jde).

Kritické výjimky:
- Některý věci se neptají a jdou vždy (reset hesla, bezpečnostní alerty).

---

<a id="koncept-seznam-inzeratu"></a>
### Seznam inzerátů

Related:
- [Feed](#koncept-feed)
- [Citlivost](#koncept-citlivost-inzeratu)
- [Inzerátu](#koncept-inzerat)


„Seznam“ není stránka. Seznam je vždycky **výsledek dotazu** ([Feed](#koncept-feed) / hledání). Jeden engine, jeden kontrakt.

Listing vs detail:
- **Listing (seznam)**: inzerát buď projde filtrem, nebo vypadne.
- **Detail (přímý odkaz)**: detail se má dát otevřít i mimo seznam (sdílení, historie, uložený link).

Tvrdý pravidlo:
- Jen [Citlivost](#koncept-citlivost-inzeratu) smí blokovat detail a vrátit **404**. Žádný „aspoň víš, že to existuje“.

Ostatní brány jsou pravidla listingu (ne zákaz otevření):
- ignor,
- životní cyklus [Inzerátu](#koncept-inzerat) (`expired` / `closed` / `sold`),
- release window,
- anti-topper a podobný mechaniky pořadí.

Co se v listingu defaultně neukazuje:
- `expired` a `closed` (jen přes vědomej filtr / historickej režim),
- `sold` (není k dispozici).

Kontrakt detailu mimo `live`:
- Detail se otevře (krom citlivosti), ale je read-only a místo „Mám zájem“ ukážu jasnej status („Už není dostupný“). UI má být fér.

Hard limit listingu:
- Max **200** inzerátů na dotaz. Když chceš víc, zúž filtr. Hotovo.

---

<a id="koncept-hledat"></a>
### Hledat

Related:
- [Feed](#koncept-feed)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Limit počtu feedů](#koncept-limit-poctu-feedu)
- [Citlivost](#koncept-citlivost-inzeratu)
- [Ignor](#koncept-ignorace-inzeratu)

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

---

<a id="koncept-multi-category"></a>
### Multi-Category

Related:
- [Kategorie](#koncept-kategorie)
- [Inzerát](#koncept-inzerat)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Ekonomika](#ekonomika)

Multi-Category je **distribuce**, ne duplikace. Nevznikají žádné kopie inzerátu. Jen rozšířím množinu kategorií, přes který se může zobrazit.

Kontrakt:
- Inzerát má jednu **primární kategorii** (autorita pro UI, jazyk a Category Spec).
- Multi-Category přidá k primární až **2 sekundární** kategorie (čistě distribuční).
- Sekundární kategorie nejsou cesta, jak si vybrat „výhodnější“ atributy. Primární je pravda.

Viditelnost a deduplikace:
- V rámci jednoho renderovanýho seznamu se inzerát zobrazí **právě jednou**, i když matchuje víc kategorií.
- Po přepnutí do jinýho kontextu (jiný feed/hledání) ho můžeš vidět znovu. To je v pořádku.

Match pravidlo:
- Feed/Hledat, který filtruje kategorii, bere inzerát jako match, když filtr = primární kategorie **nebo** jedna ze sekundárních.

Ekonomika:
- Multi-Category je placený oprávnění. Detaily patří do [Ekonomiky](#ekonomika).

---

<a id="koncept-palce"></a>
### Palce (Like/Dislike)

Related:
- [Inzerát](#koncept-inzerat)

Palce jsou signál „tahle nabídka je / není atraktivní“. Nejde o morální soud nad prodejcem.

Kontrakt:
- Palce jsou per-inzerát (Like/Dislike).
- Je to toggle: kdykoliv to můžu změnit (like/dislike/žádný).
- Nejsou veřejný ego-lajky. Je to data pro produkt a pro prodávajícího.

---

<a id="koncept-karma"></a>
### Karma (Like/Dislike)

Related:
- [Transakce](#koncept-transakce)
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metrika: Karma](#koncept-metrika-karma)

Karma je hodnocení člověka v kontextu konkrétní transakce. Žádný hvězdičky, žádnej román.

Kontrakt:
- Karma existuje jen v rámci transakce a až po `open`.
- Dvě volby: Like (Dobrý) / Dislike (Špatný).
- Kdo nehlasuje = neutrál (žádná penalizace za „nechci to řešit“).
- Karma != [Flag uživatele](#koncept-flag-uzivatele). Karma je zkušenost. Flag je průser.

---

<a id="koncept-metrika-karma"></a>
### Metrika: Karma

Related:
- [Karma](#koncept-karma)
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Transakce](#koncept-transakce)

Proč existuje:
- Chci dát prodejci signál „jak se lidem obchodovalo“. Ne román. Jedno kliknutí.

Kontrakt:
- Karma se uděluje v rámci transakce a až po `open`.
- Je to agregovaná metrika, která se **zobrazuje u prodávajícího** (v rámci jeho metrik).
- Kdo nehlasuje = neutrál.
- Karma není [Flag uživatele](#koncept-flag-uzivatele). Karma je zkušenost. Flag je průser.

---

<a id="koncept-metriky-prodavaciho"></a>
### Metriky prodávajícího

Related:
- [Ekonomika](#ekonomika)
- [Transakce](#koncept-transakce)
- [Ban](#koncept-ban)

Proč existují:
- Chci dát kupujícímu **tvrdý signál**, jestli protistrana reálně reaguje a dotahuje věci. Ne „věř mi bro“, ale realita chování.

Přístup (Detail protistrany):
- Bez oprávnění neukazuju nic. Ani „Score“.
- S oprávněním ukazuju **[Metrika: Score (A–F)](#koncept-metrika-score)** + konkrétní metriky.
- Oprávnění je [Pass](#koncept-pass)/[Kupón](#koncept-kupon) v [Ekonomice](#ekonomika).

Kontrakt:
- Metriky jsou signál pro rozhodnutí. Ne automatickej trest.
- Každá metrika má vlastní definici (viz kapitoly níž). Žádná tajná magie.

Zobrazené metriky:
- [Metrika: Score (A–F)](#koncept-metrika-score)
- [Metrika: Reakční doba](#koncept-metrika-reakcni-doba)
- [Metrika: Odmítnutí bez interakce](#koncept-metrika-odmitnuti-bez-interakce)
- [Metrika: Resolved rate](#koncept-metrika-resolved-rate)
- [Metrika: Expirace (transakcí)](#koncept-metrika-expirace)
- [Metrika: Vytížení (paralelní obchody)](#koncept-metrika-vytizeni)
- [Metrika: Aktivita](#koncept-metrika-aktivita)
- [Metrika: Flag rate](#koncept-metrika-flag-rate)
- [Metrika: Karma](#koncept-metrika-karma)

---

<a id="koncept-metriky-kupujiciho"></a>
### Metriky kupujícího

Related:
- [Ekonomika](#ekonomika)
- [Transakce](#koncept-transakce)
- [Ban](#koncept-ban)

Proč existují:
- Chci dát prodávajícímu signál, jestli protistrana obchoduje, nebo jen kliká a nechává věci hnít.

Přístup (Detail protistrany):
- Bez oprávnění neukazuju nic. Ani „Score“.
- S oprávněním ukazuju **[Metrika: Score (A–F)](#koncept-metrika-score)** + konkrétní metriky.
- Oprávnění je [Pass](#koncept-pass)/[Kupón](#koncept-kupon) v [Ekonomice](#ekonomika).

Kontrakt:
- Metriky jsou signál pro očekávání. Ne bič.
- Každá metrika má vlastní definici (viz kapitoly níž).

Zobrazené metriky:
- [Metrika: Score (A–F)](#koncept-metrika-score)
- [Metrika: Reakční doba](#koncept-metrika-reakcni-doba)
- [Metrika: Closer rate](#koncept-metrika-closer-rate)
- [Metrika: Decision rate](#koncept-metrika-decision-rate)
- [Metrika: Expirace (transakcí)](#koncept-metrika-expirace)
- [Metrika: Vytížení (paralelní obchody)](#koncept-metrika-vytizeni)
- [Metrika: Aktivita](#koncept-metrika-aktivita)

---

<a id="koncept-metrika-reakcni-doba"></a>
### Metrika: Reakční doba

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Transakce](#koncept-transakce)

Proč existuje:
- Chci vědět, jestli je protistrana **živá a reaguje**, nebo jestli budu čekat do zblbnutí.

Kontrakt:
- Metrika je o reakci na událost v transakci (zpráva / změna stavu), ne o „kdo je lepší člověk“.
- Je to signál pro rozhodnutí, ne automatickej trest.

---

<a id="koncept-metrika-odmitnuti-bez-interakce"></a>
### Metrika: Odmítnutí bez interakce

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Transakce](#koncept-transakce)

Proč existuje:
- Rozlišuju „člověk se podíval a odmítl“ vs. „člověk to jen mechanicky zavírá“. To je kvalita trhu.

Kontrakt:
- Počítám odmítnutí, který proběhly bez toho, aby došlo k reálný interakci v `open`.
- Odmítnutí je legitimní volba (viz `rejected` v [Transakcích](#koncept-transakce)); metrika je jenom popis chování, ne moralizování.

---

<a id="koncept-metrika-resolved-rate"></a>
### Metrika: Resolved rate

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Transakce](#koncept-transakce)

Proč existuje:
- Chci vidět, jak často protistrana dotahuje obchody do „vyřešenýho“ stavu, ne jak často nechává věci hnít.

Kontrakt:
- Metrika se vztahuje jen na transakce, který se reálně rozjely (`open` a dál).
- Neexistuje tu žádnej „tajnej downgrade“ — definice musí být čitelná.

---

<a id="koncept-metrika-expirace"></a>
### Metrika: Expirace (transakcí)

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Transakce](#koncept-transakce)

Proč existuje:
- Expirace je „nevíme co se stalo“. Pro mě je to signál chaosu a nízký spolehlivosti.

Kontrakt:
- Metrika popisuje, kolik transakcí končí jako `expired`.
- Není to automatickej ban-spouštěč. Je to data.

---

<a id="koncept-metrika-vytizeni"></a>
### Metrika: Vytížení (paralelní obchody)

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Transakce](#koncept-transakce)

Proč existuje:
- Když je někdo přetíženej, roste šance na ghosting a chaos. Chci to vědět dopředu.

Kontrakt:
- Metrika ukazuje, kolik má protistrana paralelně rozjetejch věcí.
- Nemá to být „trest za úspěch“. Je to praktická informace pro očekávání.

---

<a id="koncept-metrika-aktivita"></a>
### Metrika: Aktivita

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)

Proč existuje:
- Potřebuju odlišit „mrtvolu“ od člověka, kterej je reálně přítomnej.

Kontrakt:
- Aktivita je signál přítomnosti, ne kvality charakteru.
- Definice musí být viditelná a stabilní (žádný měnění pod stolem).

---

<a id="koncept-metrika-flag-rate"></a>
### Metrika: Flag rate

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Flag inzerátu](#koncept-flag-inzeratu)
- [Flag uživatele](#koncept-flag-uzivatele)

Proč existuje:
- Flag je signál „tady je problém“. Když se to opakuje, chci vědět, že to není náhoda.

Kontrakt:
- Flag rate je agregace nahlášení, ne automatickej rozsudek.
- Žádnej auto-shadowban. Zásah je vědomý rozhodnutí (viz [Ban](#koncept-ban)).

---

<a id="koncept-metrika-closer-rate"></a>
### Metrika: Closer rate

Related:
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Transakce](#koncept-transakce)

Proč existuje:
- Vysoký „instantní zavírání bez interakce“ je signál, že protistrana spíš kliká než obchoduje.

Kontrakt:
- Metrika popisuje rychlý ukončování bez smysluplný interakce.
- Neplete se to s `rejected` (legitimní odmítnutí prodejce). Je to chování v čase.

---

<a id="koncept-metrika-decision-rate"></a>
### Metrika: Decision rate

Related:
- [Metriky kupujícího](#koncept-metriky-kupujiciho)
- [Transakce](#koncept-transakce)

Proč existuje:
- Chci vědět, jestli protistrana umí rozhodnout a dotahovat, nebo jestli nechává věci vyhnít.

Kontrakt:
- Metrika je o tom, jak často dojde k rozhodnutí (uzavření / vyřešení) místo „nechat to umřít“.
- Je to nástroj pro očekávání, ne bič.

---

<a id="koncept-ban"></a>
### Ban

Related:
Ban je ruční nástroj admina (já). Ne automat.

Kontrakt:
- Důvod musí být konkrétní (podvod/spam/ojeby a podobně).
- Žádný tichý „shadow“ tresty. Když stopka, tak stopka.

---

<a id="koncept-anti-topper"></a>
### Anti-topper

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Ekonomika](#ekonomika)
- [Payback](#koncept-payback)

Anti-topper je placenej klid kupujícího. Nechci, aby se listing změnil v katalog placenýho šumu.

Kontrakt:
- Anti-topper mění jen chování listingu:
  - **Top Maxxi** zůstává nahoře (imunní),
  - **Top + běžné** se smíchají a řadí se čistě podle preference uživatele (Top ztratí výhodu pozice, zůstane badge).
- Anti-topper **nikdy neblokuje detail**. Je to mechanika listingu, ne zákaz existence.

Měření:
- Když by se v listingu ukázal inzerát se zvýrazněním (Mark/Top) uživateli s Anti-topperem, místo [`visible`](#koncept-metrika-inzeratu-visible) vznikne event [`anti-topper`](#koncept-metrika-inzeratu-anti-topper).

---

<a id="koncept-payback"></a>
### Payback

Related:
- [Anti-topper](#koncept-anti-topper)
- [Ekonomika](#ekonomika)

Payback je kompenzace pro prodávajícího, když si koupil zvýraznění a část publika mu ho odfoukla přes Anti-topper.

Kontrakt:
- Kompenzuje jen boosty, který Anti-topper umí potlačit: **Mark** a **Top**.
- **Top Maxxi** je imunní → payback pro něj nikdy nevzniká.
- Vyhodnocuju až po expiraci inzerátu (po expiraci už se nic nevrací do hry, jen vyrovnám účty).
- Payback je **[Pass](#koncept-pass) ([Exclusive](#koncept-exclusive))** (typicky Seller/Pro) a vzniká jen pokud má prodávající v době vyhodnocení aktivní Payback pass.

---

<a id="koncept-early-access"></a>
### Early Access

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Ekonomika](#ekonomika)

Early Access je výhoda kupujícího: v listingu vidíš nově publikovaný inzeráty dřív.

Kontrakt:
- V listingu ignoruju release window, takže inzerát vidíš **hned** (běžně je to až za **+8 hodin**).
- Maximum posunu je vždycky **8 hodin** (žádný „super-early“).
- Neobchází to systémový brány (hlavně [Citlivost](#koncept-citlivost-inzeratu)).
- Release window nikdy neblokuje detail přes přímý odkaz (krom citlivosti).

---

<a id="koncept-early-delivery"></a>
### Early Delivery

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Ekonomika](#ekonomika)

Early Delivery je výhoda prodávajícího pro konkrétní inzerát: zruší release window pro všechny.

Kontrakt:
- Pro tenhle inzerát ruším release window úplně, takže ho v listingu vidí **hned i lidi bez Early Access**.
- Maximum posunu je vždycky **8 hodin** (žádný stackování do nekonečna).
- Neobchází to systémový brány (hlavně [Citlivost](#koncept-citlivost-inzeratu)).
- Release window nikdy neblokuje detail přes přímý odkaz (krom citlivosti).

---

<a id="koncept-mark"></a>
### Mark

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Anti-topper](#koncept-anti-topper)
- [Payback](#koncept-payback)
- [Ekonomika](#ekonomika)

Mark je čistě listing mechanika. Není to výhoda v pravidlech. Je to výhoda v signálu.

Kontrakt:
- Co Mark dělá: jen vizuální signál (badge „Zvýrazněno“). Nezaručuje top pozici.
- Kde se projeví: pouze v listingu.
- Co Mark nikdy neobchází: filtry, radius, release window, ignor, [Citlivost](#koncept-citlivost-inzeratu).
- Trvání: Mark běží tak dlouho, jak je aktivní jeho **[Pass](#koncept-pass) na úrovni inzerátu**.
- Kontinuální nabídka:
  - pokud se inzerát vrátí do `live` a Mark pass je pořád aktivní, Mark se projeví normálně,
  - pokud Mark pass doběhl, Mark se neprojeví.

---

<a id="koncept-top"></a>
### Top

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Anti-topper](#koncept-anti-topper)
- [Payback](#koncept-payback)
- [Ekonomika](#ekonomika)

Top je listing mechanika: inzerát skočí do prioritní vrstvy listingu (pod Top Maxxi).

Kontrakt:
- Co Top dělá: posune inzerát do priority vrstvy listingu.
- Kde se projeví: pouze v listingu.
- Co Top nikdy neobchází: filtry, radius, release window, ignor, [Citlivost](#koncept-citlivost-inzeratu).
- Anti-topper: Top ztratí výhodu pozice, zůstane mu jen badge.
- Trvání: Top běží tak dlouho, jak je aktivní jeho **[Pass](#koncept-pass) na úrovni inzerátu**.
- Kontinuální nabídka:
  - pokud se inzerát vrátí do `live` a Top pass je pořád aktivní, Top se projeví normálně,
  - pokud Top pass doběhl, Top se neprojeví.

---

<a id="koncept-top-maxxi"></a>
### Top Maxxi

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Anti-topper](#koncept-anti-topper)
- [Payback](#koncept-payback)
- [Ekonomika](#ekonomika)

Top Maxxi je absolutní přednost v listingu. Je to nejvyšší vrstva priority a je imunní vůči Anti-topperu.

Kontrakt:
- Co dělá: inzerát je v listingu vždy nahoře (priorita #1).
- Kde se projeví: pouze v listingu.
- Co nikdy neobchází: filtry, radius, release window, ignor, [Citlivost](#koncept-citlivost-inzeratu).
- Anti-topper: Top Maxxi je imunní (neovlivní ho).
- Payback: Top Maxxi je imunní → payback pro něj nikdy nevzniká.
- Trvání: Top Maxxi běží tak dlouho, jak je aktivní jeho **[Pass](#koncept-pass) na úrovni inzerátu**.

---

<a id="koncept-kontinualni-nabidka"></a>
### Kontinuální nabídka

Related:
- [Inzerát](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Ekonomika](#ekonomika)

Kontinuální nabídka je legální způsob, jak řízeně prodloužit život **inzerátu**, když to není jednorázovej kus.

Smysl:
- automatická expirace drží pořádek a zabíjí hřbitovy,
- Kontinuální nabídka je způsob, jak tenhle řád koupit bez ojebů.

Jak to funguje:
- Je to **[Pass](#koncept-pass)**, který prodlužuje aktivní cyklus inzerátu (prakticky posouvá „efektivní expiraci“).
- Aktivuje ji **vlastník inzerátu**.
- Lze ji zapnout kdykoliv:
  - když je inzerát ještě `live`, prodloužení se **naváže na expiraci** (nekrade čas),
  - když je už `expired`, začne to **okamžitě** a inzerát se vrátí mezi `live`.

Chování během aktivního passu:
- Inzerát se chová jako normální `live` (leze do feedů, jde na něj založit transakce, metriky se počítají normálně).
- Po vypršení [Passu](#koncept-pass) se vrací do režimu `expired` (read-only, mimo standardní feedy).

Hranice:
- Nic z toho neobchází systémový brány (hlavně [Citlivost](#koncept-citlivost-inzeratu), ignor, Early Access/Early Delivery).

---

<a id="koncept-rozsirena-data-inzeratu"></a>
### Rozšířená data u inzerátu

Related:
- [Inzerát](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Anti-topper](#koncept-anti-topper)
- [Ekonomika](#ekonomika)
- [Palce](#koncept-palce)
- [Ignor](#koncept-ignorace-inzeratu)
- [Flag inzerátu](#koncept-flag-inzeratu)

Rozšířená data jsou privátní čísla u **mých** inzerátů. Jsou řízený **[Passem](#koncept-pass)**.

Kontrakt:
- Dokud mám aktivní [Pass](#koncept-pass), vidím rozšířená data.
- Bez [Passu](#koncept-pass) nevidím nic (žádný „free“ pseudo-score).

Co ukazuju:

| Zdrojová metrika | Význam |
|---|---|
| [`impression`](#koncept-metrika-inzeratu-impression) | „zaujalo“ (viz definice Impression) |
| [`view`](#koncept-metrika-inzeratu-view) | reálnej zájem o detail (viz definice View) |
| [`thumbs`](#koncept-metrika-inzeratu-thumbs) | palce (like/dislike) jako signál atraktivity nabídky |
| [`ignored`](#koncept-metrika-inzeratu-ignored) | kolikrát lidi dali ignor (osobní úklid, „tohle nechci vídat“) |
| [`transactions`](#koncept-metrika-inzeratu-transactions) | kolik zájmů / otevřených obchodů inzerát vyvolal |

Anti-topper v číslech:
- poměr `anti-topper / (visible + anti-topper)` (kde [`visible`](#koncept-metrika-inzeratu-visible) je „reálný zobrazení karty“ a [`anti-topper`](#koncept-metrika-inzeratu-anti-topper) je potlačení zvýraznění)

---

<a id="koncept-dispute"></a>
### Dispute

Related:
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)

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

---

<a id="koncept-metrika-score"></a>
### Metrika: Score (A–F)

Related:
- [Metriky prodávajícího](#koncept-metriky-prodavaciho)
- [Metriky kupujícího](#koncept-metriky-kupujiciho)

Score je agregace metrik do jedný známky. Je to zkratka pro rozhodnutí, ne magie.

Kontrakt:
- Score je škála **A–F**.
- Score se skládá z metrik v daným kontextu (prodávající vs kupující) a má být vysvětlitelný přes konkrétní čísla pod tím.
- Score není veřejná show. Je to privátní signál v rámci „Detail protistrany“.

---

<a id="koncept-oblibene"></a>
### Oblíbené

Related:
- [Inzerát](#koncept-inzerat)
- [Feed](#koncept-feed)
- [Ignor](#koncept-ignorace-inzeratu)

Oblíbené je moje rychlá paměť. Žádný algoritmy. Jen „tohle si chci držet bokem“.

Kontrakt:
- Je to per-user seznam inzerátů (uloženo/odloženo).
- Je to nezávislý na Feedu: feed je dotaz, oblíbené je konkrétní výběr.
- Není to Ignor: ignor je „nechci to vídat“, oblíbené je „chci se k tomu vrátit“.
- Oblíbené nic neobchází: když si zpřísním [Citlivost](#koncept-citlivost-inzeratu), inzeráty mimo nový maximum z Oblíbených zmizí.

---

<a id="koncept-metrika-inzeratu-view"></a>
### Metrika: View

Related:
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Inzerát](#koncept-inzerat)

Zdroj:
- `view`

Význam:
- Detail otevřený alespoň **2,5 s** = „reálnej zájem o detail“.

Deduplikace:
- Max 1× na jedno otevření detailu.

---

<a id="koncept-metrika-inzeratu-impression"></a>
### Metrika: Impression

Related:
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Inzerát](#koncept-inzerat)

Zdroj:
- `impression`

Význam:
- Karta v listingu ve viewportu alespoň **1,6 s** = „zaujal, zpomalil“.

Deduplikace:
- Max 1× na jedno zobrazení listu pro danej inzerát.

---

<a id="koncept-metrika-inzeratu-visible"></a>
### Metrika: Visible

Related:
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Inzerát](#koncept-inzerat)

Zdroj:
- `visible`

Význam:
- Karta v listingu ve viewportu alespoň **0,5 s** = „uživatel to reálně viděl“.

Deduplikace:
- Max 1× na jedno zobrazení listu pro danej inzerát.

---

<a id="koncept-metrika-inzeratu-anti-topper"></a>
### Metrika: Anti-topper

Related:
- [Anti-topper](#koncept-anti-topper)
- [Payback](#koncept-payback)
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Inzerát](#koncept-inzerat)
- [Metrika: Visible](#koncept-metrika-inzeratu-visible)

Zdroj:
- `anti-topper`

Význam:
- Když má uživatel aktivní [Anti-topper](#koncept-anti-topper) a v listingu by se měl ukázat inzerát se zvýrazněním **Mark/Top**, systém místo [`visible`](#koncept-metrika-inzeratu-visible) zapíše `anti-topper`.

Smysl:
- Měřím „kolikrát bylo zvýraznění potlačeno“ (metriky + případnej [Payback](#koncept-payback)).

Výjimka:
- Pro **Top Maxxi** se `anti-topper` negeneruje (je imunní).

Deduplikace:
- Typicky stejný limity jako [`visible`](#koncept-metrika-inzeratu-visible) (ať z toho není spam).

---

<a id="koncept-metrika-inzeratu-thumbs"></a>
### Metrika: Thumbs

Related:
- [Palce](#koncept-palce)
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Inzerát](#koncept-inzerat)

Zdroj:
- `thumbs`

Význam:
- Palce (like/dislike) jako signál atraktivity nabídky.

Kontrakt:
- `thumbs` jsou reálný entity palců nad inzerátem (viz [Palce](#koncept-palce)).
- Nejsou to veřejný ego-lajky. Je to data pro produkt a pro mě.

---

<a id="koncept-metrika-inzeratu-ignored"></a>
### Metrika: Ignored

Related:
- [Ignor](#koncept-ignorace-inzeratu)
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Inzerát](#koncept-inzerat)

Zdroj:
- `ignored`

Význam:
- Kolikrát lidi dali [Ignor](#koncept-ignorace-inzeratu) nad inzerátem.

Kontrakt:
- Je to signál „tohle lidi nechtějí vídat“.
- Neříká to nic o pravdě nebo morálce. Je to osobní úklid.

---

<a id="koncept-metrika-inzeratu-transactions"></a>
### Metrika: Transactions

Related:
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Inzerát](#koncept-inzerat)

Zdroj:
- `transactions`

Význam:
- Kolik transakcí tenhle inzerát vyvolal (kolik „vláken obchodu“ na něj vzniklo).

Kontrakt:
- Je to metrika zájmu, ne kvality. Více transakcí neznamená úspěch.

---

<a id="koncept-pass"></a>
### Pass

Related:
- [Ekonomika](#ekonomika)
- [Early Access](#koncept-early-access)
- [Early Delivery](#koncept-early-delivery)
- [Anti-topper](#koncept-anti-topper)
- [Mark](#koncept-mark)
- [Top](#koncept-top)
- [Top Maxxi](#koncept-top-maxxi)
- [Kontinuální nabídka](#koncept-kontinualni-nabidka)
- [Rozšířená data u inzerátu](#koncept-rozsirena-data-inzeratu)
- [Payback](#koncept-payback)

Pass je časově omezený oprávnění / režim. Není to měna ani poukázka. Je to stav: „od teď do tehdy tohle platí“.

Kontrakt:
- Pass je **stav**, ne spotřební item.
- Pass má vždycky expiraci. Buď běží, nebo neběží. Žádný „napůl“.
- Aktivace typicky znamená: vznikne nebo se prodlouží pass (detaily držím v [Ekonomice](#ekonomika)).
- Pass nikdy neobchází systémový brány (hlavně [Citlivost](#koncept-citlivost-inzeratu) a [Ignor](#koncept-ignorace-inzeratu)).

Scope:
- Některý passy jsou **na úrovni účtu** (např. Anti-topper).
- Některý passy jsou **na úrovni inzerátu** (např. Mark/Top/Top Maxxi) — běží jen pro konkrétní inzerát.

---

<a id="koncept-kupon"></a>
### Kupón

Related:
- [Tokeny](#koncept-tokeny)
- [Pass](#koncept-pass)
- [Ekonomika](#ekonomika)

Kupón je poukázka na konkrétní akci. Není to měna. Je to „máš přesně tohle“.

Kontrakt:
- Kupón je konkrétní: buď ho použiju na danou věc, nebo mi zůstane.
- Kupón je 1× použití (spotřebuje se).
- Kupón neexpiruje (žádný „vypršelo ti to, smůla“).

---

<a id="koncept-tokeny"></a>
### Tokeny

Related:
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)
- [Ekonomika](#ekonomika)

Tokeny jsou interní měna. Palivo na jednorázový věci, který nechci cpát do předplatnýho jako povinnost.

Kontrakt:
- Tokeny získám (příděl/bonus/nákup) a pak je utrácím.
- Tokeny jsou skladovatelné: neexpirují. Expirovat může jen [Pass](#koncept-pass).

---

<a id="koncept-aktivace"></a>
### Aktivace

Related:
- [Tokeny](#koncept-tokeny)
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)
- [Ekonomika](#ekonomika)

Aktivace je jednotný kontrakt pro „zapínání“ věcí. Uživatel musí vždycky vědět, jestli něco **spotřebovává**, nebo **aktivuje na čas**.

Kontrakt:
- Pokud mám použitelný [Kupón](#koncept-kupon) pro danou věc → použije se kupón.
- Jinak → strhnou se [Tokeny](#koncept-tokeny), **ale jen pokud je tenhle [Pass](#koncept-pass) koupitelnej v ceníku** (viz [Ekonomika](#ekonomika)). Když v ceníku není, je to zamčený / [Exclusive](#koncept-exclusive).
- Výsledek je buď:
  - jednorázová akce (kupón se spálí a hotovo), nebo
  - vznik / prodloužení [Passu](#koncept-pass) (podle typu věci).

CTA pravidlo:
- `Aktivovat (1× Kupón)` vs `Aktivovat (XX Tokenů)`.
- Pravidlo: **nejdřív spotřebuj free věci, až potom měnu**.

Tvrdá hranice:
- Rozšíření jsou nadstavby. Ne zadní vrátka.
- Aktivace nikdy neobchází brány (hlavně [Citlivost](#koncept-citlivost-inzeratu) a [Ignor](#koncept-ignorace-inzeratu)).

---

<a id="koncept-exclusive"></a>
### Exclusive

Related:
- [Ekonomika](#ekonomika)
- [Aktivace](#koncept-aktivace)
- [Ceník](#koncept-cenik)
- [Pass](#koncept-pass)
- [Tokeny](#koncept-tokeny)
- [Kupón](#koncept-kupon)

Exclusive je zamčený oprávnění. Není to věc, kterou si „dokoupím tokenama“. Je to benefit balíčku / [Předplatného](#koncept-predplatne).

Kontrakt:
- Autorita toho, co je „koupitelný“, je [Ceník](#koncept-cenik) (a pravidla použití drží [Aktivace](#koncept-aktivace)).
- Exclusive věci nejsou koupitelný přes [Tokeny](#koncept-tokeny). Pokud existují, běží jen jako nárok (typicky [Pass](#koncept-pass)).

---

<a id="koncept-cenik"></a>
### Ceník

Related:
- [Ekonomika](#ekonomika)
- [Aktivace](#koncept-aktivace)
- [Tokeny](#koncept-tokeny)
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)
- [Exclusive](#koncept-exclusive)

Ceník je seznam věcí, který si umím koupit (typicky za [Tokeny](#koncept-tokeny) nebo přes [Kupón](#koncept-kupon)). Je to produktová autorita pro „tohle jde dokoupit“.

Kontrakt:
- Pokud něco **je v ceníku**, jde to aktivovat i přes tokeny (pokud nemám kupón).
- Pokud něco **není v ceníku**, je to zamčený → [Exclusive](#koncept-exclusive) (benefit balíčku/[Předplatného](#koncept-predplatne)).
- Konkrétní částky a tabulky držím v [Ekonomice](#ekonomika).

---

<a id="koncept-inzerat-cena"></a>
### Inzerát: Cena

Related:
- [Inzerát](#koncept-inzerat)
- [Kategorie](#koncept-kategorie)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)

Cena je povinná. Bez ceny je to jen „piš mi do zpráv“ a to je přesně ten chaos, kterej chci zabít ještě dřív, než vznikne.

Položky:
- **Cena**: konkrétní částka.
- **Typ ceny**: postoj pro domluvu.

Typ ceny:
- `closed` = pevná cena („nesmlouvám“)
- `open` = výchozí cena („můžeme se domluvit“)

Tvrdý pravidlo:
- I u `open` je cena pořád povinná. Žádný „dohodou“ jako únik z reality.

---

<a id="koncept-inzerat-delivery"></a>
### Inzerát: Předání

Related:
- [Inzerát](#koncept-inzerat)
- [Lokace](#koncept-lokace)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Transakce](#koncept-transakce)

Způsob předání je dobrovolnej signál. Ne závazek a ne „logistika modul“. Kupující hned ví, jak si to zhruba představuju, a nemusí se ptát na základní věci.

Enum hodnot:
| Hodnota | Enum | Poznámka |
|---|---|---|
| Osobně | `personal` | defaultní „sousedský“ režim |
| Pošta | `post` | dopis/pošta obecně |
| Balík | `package` | balík / kurýr / zásilkovna (typ, ne integrace) |
| Jinak | `other` | cokoliv mimo standard |

Kontrakt:
- Předání je preference, ne smlouva.
- Ve feedu/hledání to slouží jako filtr.
- Platforma nevynucuje logistiku ani nedělá „garanci doručení“.
- Lokace neurčuje způsob předání: lokace je kontext „kde to je“, ne logistickej závazek.

---

<a id="koncept-inzerat-warranty"></a>
### Inzerát: Záruka

Related:
- [Inzerát](#koncept-inzerat)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)

Záruka je dobrovolnej signál. Řeší jednu otázku: „Je to v záruce?“ Platforma do toho nijak nevstupuje. Neověřuju to, negarantuju to, nesoudím to. Je to mezi lidma.

Enum hodnot:
| Hodnota | Enum | Význam | Příklad |
|---|---|---|---|
| Bez záruky | `no-warranty` | nic nenabízím | „kupuješ jak stojí a leží“ |
| Vlastní záruka | `custom` | něco mimo zákon | „7 dní na vyzkoušení“ |
| Zákonná záruka | `warranty` | typicky účtenka / doložitelný nákup | „mám účtenku“ |

Použití:
- Je to filtr ve feedu/hledání.
- Není to „garance“ od platformy.

---

<a id="koncept-inzerat-popis"></a>
### Inzerát: Popis

Related:
- [Inzerát](#koncept-inzerat)
- [Kategorie](#koncept-kategorie)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)

Popis je dobrovolnej. A je to záměr. Nechci, aby lidi psali slohovky jen proto, že „se to sluší“.

Pravidla:
- Popis je v **Markdownu** (volitelně).
- Popis se **nepoužívá pro vyhledávání / indexaci**. Hledání stojí na [Titulku](#koncept-inzerat-titulek) a strukturovanejch filtrech.
- Méně je často víc: krátký konkrétní body > dlouhej příběh.

Kontrakt:
- Popis je informativní vrstva pro detail: „co se nevešlo do struktury“.

---

<a id="koncept-inzerat-pros-cons"></a>
### Inzerát: Co chci vyzdvihnout / Chci být upřímný

Related:
- [Inzerát](#koncept-inzerat)
- [Inzerát: Popis](#koncept-inzerat-popis)
- [Palce](#koncept-palce)

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

---

<a id="koncept-inzerat-titulek"></a>
### Inzerát: Titulek

Related:
- [Inzerát](#koncept-inzerat)
- [Inzerát: Popis](#koncept-inzerat-popis)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)

Titulek je krátkej a jasnej popis toho, co prodáváš. Má člověku ve feedu okamžitě říct, jestli ho to zajímá.

Pravidla:
- Jedna věc = jeden titulek.
- Žádný keyword spam.
- Upřímnost > hype.

Technická pravda:
- **Titulek je jediný text, podle kterého se dá hledat.** Textový hledání stojí na titulku.

---

<a id="koncept-predplatne"></a>
### Předplatné

Related:
- [Ekonomika](#ekonomika)
- [Tokeny](#koncept-tokeny)
- [Kupón](#koncept-kupon)
- [Pass](#koncept-pass)
- [Exclusive](#koncept-exclusive)
- [Ceník](#koncept-cenik)

Předplatné je komfort a nástroje navíc, bez pay-to-win cirkusu. Stojí na jasných věcech: limit, pass, kupón, tokeny.

Kontrakt:
- Renew = příděly vždycky: při každým renew se připíšou tokeny/kupóny z balíčku.
- Cancel je jediná změna: když zruším předplatné, jen se neobnoví. Co běží, doběhne do konce zaplacenýho období.

---

<a id="koncept-tokeny-ziskavani"></a>
### Tokeny: Získávání

Related:
- [Tokeny](#koncept-tokeny)
- [Předplatné](#koncept-predplatne)
- [Aktivace](#koncept-aktivace)
- [Transakce](#koncept-transakce)

Tokeny získáš:
- z předplatného (měsíční příděl)
- z bonusů za používání
- nákupem balíčků

Bonusy za používání (kontrakt):
| Mechanika | Kdy vzniká | Smysl | Poznámka |
|---|---|---|---|
| Odměna za `resolved` | prodávající přepne transakci do `resolved` | motivace k úklidu a pravdivým koncům | bez `resolved` bonus nevzniká |
| Denní drop | 1× denně k vyzvednutí (řádově ~10 T) | drobná pobídka k návratu | ne ekonomickej model |
| RNG dropy ve feedu | občas při scrollu (nízká pravděpodobnost) | malý překvapení | ne ekonomickej model |
| Anti-abuse | při zjevným zneužití | ochrana proti farmení | bonus se nemusí vyplatit |

---

<a id="koncept-inzerat-video"></a>
### Inzerát: Video (ne)

Related:
- [Inzerát](#koncept-inzerat)
- [Uploady](#koncept-uploady)
- [Galerie](#koncept-galerie)

Video je v 95 % případů šum, ne hodnota. A technicky je to černá díra na náklady.

Rozhodnutí:
- Upload videí k inzerátům **nepodporuju**.

Důvody:
- většina lidí to použije nekvalitně a rozbije feed
- infra náklady (upload, storage, CDN, transkódování, preview, mazání) jsou velký
- přínos je úzkej a kontextovej

---

<a id="koncept-landing"></a>
### Landing

Related:
- [Uživatel](#koncept-uzivatel)
- [Kodex](#kodex)

Landing je vizitka postoje. Držím to krátký: pět bloků a hotovo.

| Blok | Co je uvnitř | Proč |
|---|---|---|
| Hero | claim **„Nakupuješ nebo prodáváš?“** + 2 rovnocenný CTA: **„Už se známe“** (Login), **„Přidej se!“** (Register) | žádný trick CTA, žádnej nátlak |
| Autor | moje fotka, moje jméno, odkaz na GitHub, motto **„Bez keců. Bez ojebů.“** | důvěra přes tvář a odpovědnost |
| Aktivita vývoje | GitHub-like heatmap | důkaz práce, ne sliby |
| Live Pulse | poslední události (registrace, nový inzeráty, transakce) – timeline živosti trhu | ať je vidět, že to žije |
| Transparentní účet | link na bankovnictví | finance netajím; kdo hledá shady shit, tady by to bylo |

Tón: minimalistickej. Bez popupů, bez urgencí, bez vysvětlování.

---

<a id="koncept-navigace"></a>
### Navigace

Related:
- [Landing](#koncept-landing)
- [Draft](#koncept-draft)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Notifikace (Inbox)](#koncept-notifikace)
- [Můj účet](#koncept-uzivatel)
- [Ekonomika](#ekonomika)

Navigace je schválně nudná a stabilní. Uživatel se nemá proklikávat labyrintem. Má mít jistotu, že vždycky ví, kde je, a vždycky má únik.

Bottom nav (5 ikon, pořád stejně):
| Ikona | Sekce | Poznámka |
|---|---|---|
| Home | Centrální Dashboard | společnej entrypoint |
| Chci prodávat | Seller home | mindset „prodávám“ |
| Chci nakupovat | Buyer home | mindset „nakupuju“ |
| Bonusy | ekonomika / aktivace | rozšíření, passy, tokeny |
| Můj účet | profil / nastavení | preference, hranice, ticho |

Kontrakt:
- Role nejsou identita ani přepínač „jsem seller/buyer“. Je to rychlej vstup do dvou nejčastějších mindsetů.

---

<a id="koncept-ui-rozsireni"></a>
### UI: Rozšíření

Related:
- [Aktivace](#koncept-aktivace)
- [Ceník](#koncept-cenik)
- [Kupón](#koncept-kupon)
- [Tokeny](#koncept-tokeny)
- [Pass](#koncept-pass)
- [Exclusive](#koncept-exclusive)
- [Předplatné](#koncept-predplatne)

Rozšíření jsou centrální ovládací pult pro věci, co se dají zapnout. Uživateli to dává jedno místo, kde vidí „co mám aktivní, co mi končí, co můžu zapnout, a čím to zaplatím“.

Kontrakt:
- Rozšíření je katalog toho, co jde aktivovat (viz [Ceník](#koncept-cenik)) a co je zamčený ([Exclusive](#koncept-exclusive)).
- Každá položka má jednu jasnou akci: `Aktivovat` → pravidla drží [Aktivace](#koncept-aktivace).
- UI vždycky ukáže, jestli spotřebovávám [Kupón](#koncept-kupon), nebo platím [Tokeny](#koncept-tokeny), nebo jen využívám nárok z [Předplatného](#koncept-predplatne).
- Součástí je „inventář“ kontextu: kolik mám [Tokenů](#koncept-tokeny), kolik mám [Kupónů](#koncept-kupon), jaké mám aktivní [Passy](#koncept-pass) a kdy končí.
- Pod rozšířeníma je místo pro kupóny, který nejsou „zapni pass“ (jednorázovky).

---

<a id="koncept-ui-bonusy"></a>
### UI: Bonusy

Related:
- [Tokeny: Získávání](#koncept-tokeny-ziskavani)
- [Tokeny](#koncept-tokeny)
- [Předplatné](#koncept-predplatne)
- [Transakce](#koncept-transakce)
- [Rozšíření](#koncept-ui-rozsireni)

Bonusy je UI kapsa na ekonomiku v malým: vyzvednout bonusy, vidět historii, mít po ruce aktivace, a zároveň si pořídit věci navíc (suby + balíčky tokenů).

Kontrakt:
- Bonusy jsou místo, kde si **vědomě vyzvednu** věci typu denní drop. Nic se „nevyzvedává samo“.
- Bonusy jsou místo, kde si můžu pořídit **[Předplatné](#koncept-predplatne)** a **balíčky [Tokenů](#koncept-tokeny)**. Neříkám tomu „obchod“, ale je to tenhle účel.
- Pravidla bonusů a anti-abuse drží [Tokeny: Získávání](#koncept-tokeny-ziskavani). Tady je jen UI přístup.
- Bonusy jsou vstupní bod zpátky do [Rozšíření](#koncept-ui-rozsireni): když už mám tokeny, chci hned vidět, co s nima jde dělat.

---

<a id="koncept-automaticke-ukonceni-inzeratu"></a>
### Automatické ukončení: Inzerát

Related:
- [Inzerát](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Kontinuální nabídka](#koncept-kontinualni-nabidka)
- [Ekonomika](#ekonomika)

Automatické ukončení je povinná volba. Drží pořádek v nabídce a brání tomu, aby se z feedu stal hřbitov.

Kontrakt:
- Při tvorbě nastavím `expiresAt`.
- Čas se počítá až po zveřejnění, ne v draftu.
- Po uplynutí `expiresAt` se inzerát bez aktivní [Kontinuální nabídky](#koncept-kontinualni-nabidka) přepne do `expired`.
- UI u volby ukazuje i konkrétní datum.

---

<a id="koncept-automaticke-ukonceni-transakce"></a>
### Automatické ukončení: Transakce

Related:
- [Transakce](#koncept-transakce)
- [Zprávy](#koncept-zpravy)

Nechci nedotažený transakce žít navěky. Když se obchod nerozjede nebo se nedotáhne a nikdo ho explicitně neuzavře, transakce vyprší.

Kontrakt:
- Vypršení přepne transakci do `expired` (read-only).
- `expired` je finální stav: žádný re-open.
- Čistky a retence se řídí pravidly v [Transakci](#koncept-transakce) a [Zprávách](#koncept-zpravy).

---

<a id="koncept-inzerat-brand"></a>
### Inzerát: Brand

Related:
- [Inzerát](#koncept-inzerat)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Feed](#koncept-feed)
- [Hledat](#koncept-hledat)
- [Pass](#koncept-pass)
- [Ekonomika](#ekonomika)

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

---

<a id="koncept-ui-ramec"></a>
### UI: Rámec

Related:
- [Navigace](#koncept-navigace)
- [Draft](#koncept-draft)
- [Landing](#koncept-landing)
- [UI: Rozšíření](#koncept-ui-rozsireni)
- [UI: Bonusy](#koncept-ui-bonusy)

UI je půl produktu. Když působí nejistě, uživatel je nejistej. Když je klidný a stabilní, nic neřeší.

Pravidla:
- Mobile-first vždycky.
- Nevysvětlovat. Když to potřebuje nápovědu, je to špatně.
- Minimum psaní. Klikací kroky a jasný stavy.
- Akce mají váhu. Primární CTA je jasná, destruktivní je opatrná.
- Klid > efekt. Reakce systému má být okamžitá.

---

<a id="koncept-ui-dashboard"></a>
### UI: Dashboard

Related:
- [Notifikace (Inbox)](#koncept-notifikace)
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Draft](#koncept-draft)

Dashboard je launcher. Není to feed. Má být krátkej, jasnej, bez potřeby scrollovat jak blázen.

Co tu je:
- Novinky / pulz: co přibylo.
- Notifikace: co čeká na reakci.
- Rychlý skoky: typicky „Inzeráty“ a „Nový inzerát“ (vstupy do existujících konceptů, ne vlastní svět).

---

<a id="koncept-ui-seller"></a>
### UI: Chci prodávat

Related:
- [Draft](#koncept-draft)
- [Inzerát](#koncept-inzerat)
- [Transakce](#koncept-transakce)

Domov pro „prodávám“. Velký karty, jasný volby, žádný menu v menu.

Karty:
| Karta | Co dělá | Pravidlo |
|---|---|---|
| Nový inzerát / Pokračovat | primární vstup do tvorby | když existuje draft → „Pokračovat“, jinak „Nový inzerát“; při „Nový inzerát“ může nastat Draft Gate |
| Zprávy | moje rozjednané prodeje | transakce přeložený do řeči lidí |
| Šablony | seznam draftů | název „Šablony“, protože mentálně „mám to připravený“ |
| Moje inzeráty | přehled publikovaných | stavy `live/expired/closed/sold` |

---

<a id="koncept-ui-buyer"></a>
### UI: Chci nakupovat

Related:
- [Seznam inzerátů](#koncept-seznam-inzeratu)
- [Transakce](#koncept-transakce)
- [Feed](#koncept-feed)
- [Oblíbené](#koncept-oblibene)

Domov pro „nakupuju“. Velký karty, jasný volby, žádný menu v menu.

Karty:
| Karta | Co dělá | Poznámka |
|---|---|---|
| Inzeráty | vstup do listu | typicky návrat do posledního kontextu |
| Zprávy | moje nákupy / domluvy | pořád transakce, jen lidský název |
| Moje seznamy | uložený feedy | správa „co chci vidět“ |
| Oblíbené | moje uložený inzeráty | rychlá paměť, žádný algoritmy |

---
