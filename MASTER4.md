# MASTER

Tohle je finální „single source of truth“ pro Zbav-se.me. Je to moje produktová ústava: popisuje **co je pravda** (koncepty, pravidla, hranice) a **proč**. Neřeší, jak to technicky nakóduju.

Co tu najdeš:
- **Směr produktu**: postoj a zásady, který mi nedovolí udělat z toho další bazar.
- **Kodex**: tvrdý hranice férovosti (monetizace, pay-to-win, data, manipulace).
- **Koncepty**: „jak funguje X?“ na jednom místě (inzerát, draft, feed, transakce, citlivost, limity…).
- **Ekonomika**: model nabídky ([tokeny](#koncept-tokeny)/[kupóny](#koncept-kupon)/[passy](#koncept-pass)/předplatné) a pravidla aktivace.

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
- **Ekonomika** je model nabídky ([tokeny](#koncept-tokeny)/[kupóny](#koncept-kupon)/[passy](#koncept-pass)/předplatné/[ceník](#koncept-cenik)): [`#ekonomika`](#ekonomika)
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

Důvěra u mě není odměna ani razítko po „ověření identity“. Je to vlastnost prostředí.

Co z toho plyne:
- Nehoním lidi přes občanky. Držím rámec, ve kterým se dá chovat normálně.
- Hranice jsou jasný a vymahatelný: co nejde, prostě nejde (a nejde to obcházet).
- Odpovědnost začíná přijetím: nezájem není zločin, přijetí je závazek. (Viz [Transakce](#koncept-transakce).)
- „Zavřeno je zavřeno“ je fyzika systému, ne prosba. (Viz [Transakce](#koncept-transakce).)

<a id="ferova-monetizace"></a>
### Férová monetizace a neaktivita

Paywall není past. Je to cedule u dveří: vidíš ji dřív, než do nich vejdeš.

Co držím:
- Platí se za hodnotu, ne za nátlak.
- Žádný gotcha momenty typu „nechám tě to skoro dodělat a pak ti to seberu“.
- Zrušení předplatnýho nesmí být labyrint ani psychologická válka. (Detaily patří do [Ekonomiky](#ekonomika).)
- Neaktivita je signál „už to teď nepoužívám“. Nechci někoho potichu cucat jen proto, že zapomněl.

<a id="no-p2w"></a>
### Žádné pay-to-win

Peníze u mě nesmí dělat z lidí „lepší občany“. Nechci trh, kde vyhrává ten, kdo nejvíc zaplatí, a ostatní jen čumí na zadek.

To znamená:
- Platíš za nástroje, pohodlí a signál. Ne za lež.
- Placený věci jsou pojmenovaný a viditelný. Žádný skrytý boosty.
- Neplatící nejsou potichu penalizovaný. Žádnej tajnej handicap.

<a id="respekt"></a>
### Respekt k uživateli

Uživatel není cíl pro optimalizaci metrik. Je to člověk, co si chce v klidu prodat nebo koupit věc.

Respekt v praxi:
- Neotravovat. Notifikace jsou informace, ne bič. (Viz [Notifikace](#koncept-notifikace).)
- Nemanipulovat. Žádný confirm-shaming, žádný dark patterns.
- Dát kontrolu. Filtry, ignor, citlivost, ukončení. (Viz [Citlivost](#koncept-citlivost-inzeratu), [Ignor](#koncept-ignorace-inzeratu).)
- Neznehodnocovat čas. Minimum kroků, žádný zbytečný potvrzování.
- Nebýt creepy. Data sbírám s jasným účelem pro produkt. Ne pro reklamní profilování. (Viz [Retence](#retence).)

<a id="otevrenost"></a>
### Otevřenost a odpovědnost

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

Nechci stavět „appku“. Chci postavit **trh**, kterej je čitelnej a předvídatelnej:

- **Ticho = úspěch.** Když uživatel nic neřeší, vyhrál jsem.
- **Známý mentální model, ale bez bordelu.** List → detail → zájem → domluva → konec.
- **Minimum psaní, maximum faktů.** Timeline událostí místo románů.
- **Lokální základ.** Poloha, vzdálenost, radius.
- **Definitivní konce.** „Zavřeno je zavřeno“ (viz [Transakce](#koncept-transakce)).
- **Žádný obcházení.** Brány jsou brány (viz [Citlivost](#koncept-citlivost-inzeratu)).

<a id="ux-principy"></a>
### UX principy

> **Když to potřebuje nápovědu, je to špatně navržený.**

Moje pravidla UX:
- **Konzistence > chytrost.** Výjimky zabíjejí důvěru.
- **Empty state není prázdno. Je to status.** Vzor: **status → krátký proč → jedno jasný CTA**.
- **Prázdno je záměr.** Méně šumu = méně nejistoty.
- **Emoce můžou být v textu. Akce musí být mechanická.**
- **UI je interaktivní hned.** Animace jsou luxus, ne blokace. Respektuju `prefers-reduced-motion`.

<a id="komunikace"></a>
### Komunikace a transparentnost

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
Metriky jsou signál trhu a nástroje pro férový mechaniky. Ne reklamní profilování.

8) **Měkká frikce místo manipulace**  
Jemný brzdy a struktura, aby se to nerozpadlo do bazarovýho pekla, ale bez moralizování a bez nátlaku.

9) **Minimalismus i v médiích**  
Nechci z feedu dělat video cirkus. Fotky stačí.

10) **Osobní data jen dočasně**  
Co je osobní a patří jen do domluvy, nesmí v systému hnít věčně. (Viz [Transakce](#koncept-transakce).)

<a id="slabina"></a>
### V čem je má slabina (a proč s tím počítám)

- **Network efekt:** Na startu tam nebude „všechno“. To je gravitace, ne bug. Řeším to sekvenčním startem (viz [Uvedení na trh](#uvedeni-na-trh)).
- **Míň impulsního prodeje přes chaos:** Míň šumu může krátkodobě vypadat pomaleji. Dlouhodobě je to zdravější trh.
- **Transparentnost je závazek:** Znamená míň kliček a víc práce. Správně.
- **Nejsem pro každýho:** Někoho tenhle styl odradí. Filtr je záměr.
- **Průhlednost přitahuje i hejtry:** Počítám s tím. Je to cena za důvěru.

<a id="co-nedelam"></a>
### Co vědomě nedělám

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
- návrat/back je vždycky bezpečnej (autosave),
- editor je otevřenej a ne-lineární: sekce jsou klikací karty (klik & edit),
- bottom nav je mentální kotva, žádnej horní křížek a žádnej produktovej sticky teatr,
- smazání draftu je dvoufázově inline, ne modalovej cirkus.

---

<a id="koncept-feed"></a>
### Feed

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

Nahlásit člověka bez kontextu je toxická zbraň. Proto to gateuju chováním systému.

Kontrakt:
- Je to tvrdá akce dostupná **jen v rámci transakce** a až po `open`.
- Není to toggle.
- Stejně jako u inzerátu: žádný auto-efekt, jen signál a metrika.

---

<a id="koncept-limit-poctu-feedu"></a>
### Limit počtu feedů

Limit není trest. Je to mantinel, aby se z toho nestal inventář nekonečna.

Kontrakt:
- Do limitu se počítají jen feedy typu `user` (uložený „moje seznamy“).
- `search` je mimo limity (nezabírá slot).
- Když jsi nad limitem, feedy nemažu. Jen ty nadlimitní v UI skryju/disable (existují, ale uživatel ví, že je má navíc).

---

<a id="koncept-limit-poctu-fotek"></a>
### Limit počtu fotek nad inzerátem

Fotky jsou primární obsah inzerátu. Limit fotek je brzda proti šumu a zároveň jasný místo, kam se dá férově navázat „komfort navíc“.

Kontrakt:
- Defaultně držím krátkou galerii (baseline je **3 fotky**).
- Navýšení je oprávnění přes [Ekonomiku](#ekonomika): typicky `Photo Count` ([Kupón](#koncept-kupon) → [Pass](#koncept-pass)) = **+2 fotky na 1 měsíc**.
- Po skončení [Passu](#koncept-pass) se už nahraný fotky nemažou. Zůstávají beze změny — jen znovu platí aktuální limit pro další přidávání.
- V balíčcích se to může projevit jako vyšší strop (např. **3 → 5**, u Pro i víc).

---

<a id="koncept-limit-aktivnich-inzeratu"></a>
### Limit aktivních inzerátů

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

Retence po ukončení transakce:
- Všechny typy **kromě** `message_text` a `message_gallery` se po ukončení transakce **mažou**.

Kontrakt:
- V `pending` se zprávy neposílají.
- Strukturovaný data ukládám odděleně, aby šla cíleně mazat hned po ukončení transakce.

---

<a id="koncept-notifikace"></a>
### Notifikace (Inbox)

Notifikace nejsou nástroj na otravování. Jsou to **zrcadlo reality**, aby člověk věděl, co se stalo, a nemusel paranoidně refreshovat appku.

Filosofie ticha:
- Defaultní stav je ticho. Žádný umělý FOMO.

Inbox First:
- Inbox je jediný zdroj pravdy pro „co se stalo“.

Email jako zrcadlo:
- Email není primární kanál. Je to volitelný forward/digest toho, co už je v Inboxu.

Kritické výjimky:
- Některý věci se neptají a na email jdou vždy (reset hesla, bezpečnostní alerty).

---

<a id="koncept-seznam-inzeratu"></a>
### Seznam inzerátů

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

Exclusive je zamčený oprávnění. Není to věc, kterou si „dokoupím tokenama“. Je to benefit balíčku / předplatnýho.

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
- Pokud něco **není v ceníku**, je to zamčený → [Exclusive](#koncept-exclusive) (benefit balíčku/předplatnýho).
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
