# MASTER

Tohle je finální „single source of truth“ pro Zbav-se.me. Je to moje produktová ústava: popisuje **co je pravda** (koncepty, pravidla, hranice) a **proč**. Neřeší, jak to technicky nakóduju.

Co tu najdeš:
- **Směr produktu**: postoj a zásady, který mi nedovolí udělat z toho další bazar.
- **Kodex**: tvrdý hranice férovosti (monetizace, pay-to-win, data, manipulace).
- **Koncepty**: „jak funguje X?“ na jednom místě (inzerát, draft, feed, transakce, citlivost, limity…).
- **Ekonomika**: model nabídky (tokeny/kupóny/passy/předplatné) a pravidla aktivace.

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
- **Ekonomika** je model nabídky (tokeny/kupóny/passy/předplatné/ceník): [`#ekonomika`](#ekonomika)
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
- Dát kontrolu. Filtry, ignor, citlivost, ukončení. (Viz [Citlivost](#koncept-citlivost), [Ignor](#koncept-ignor).)
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
- **Transparentnost jako design.** Žádný skrytý penalizace, žádný „nevíš proč se ti to nezobrazuje“ (viz [Viditelnost](#koncept-viditelnost)).
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
- **Žádný obcházení.** Brány jsou brány (viz [Citlivost](#koncept-citlivost)).

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
Pravidla jsou pojmenovaný. Když něco omezím, má to čitelnej důvod. (Viz [Viditelnost](#koncept-viditelnost), [Kodex](#kodex).)

7) **Data dělám pro uživatele, ne pro inzerenty**  
Metriky jsou signál trhu a nástroje pro férový mechaniky. Ne reklamní profilování.

8) **Měkká frikce místo manipulace**  
Jemný brzdy a struktura, aby se to nerozpadlo do bazarovýho pekla, ale bez moralizování a bez nátlaku.

9) **Minimalismus i v médiích**  
Nechci z feedu dělat video cirkus. Fotky stačí.

10) **Osobní data jen dočasně**  
Co je osobní a patří jen do domluvy, nesmí v systému hnít věčně. (Viz [Čistky transakcí](#koncept-cistky).)

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
- Křížový věci mají vlastní autoritu (typicky [Citlivost](#koncept-citlivost), [Viditelnost](#koncept-viditelnost), [Limity](#koncept-limity), [Ekonomika](#ekonomika)).

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
- hranice obsahu přes [Citlivost](#koncept-citlivost) a osobní úklid přes [Ignor](#koncept-ignor),
- aktivace a limity přes [Ekonomiku](#ekonomika) a [Limity](#koncept-limity).

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
  - transakce → přílohy žijí s transakcí a mizí při jejím hard delete (viz [Čistky](#koncept-cistky)).

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
- `sold` se **nepočítá** jako aktivní (viz [Limity](#koncept-limity)).

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
- když narazíš na limit aktivních inzerátů, draft tě místo editoru pošle do Statusu: vysvětlení + jedno CTA „Odemknout další inzerát“ (za Kupón, nebo za Tokeny v hodnotě toho kupónu). (Viz [Limity](#koncept-limity) a [Ekonomika](#ekonomika).)
- návrat/back je vždycky bezpečnej (autosave),
- editor je otevřenej a ne-lineární: sekce jsou klikací karty (klik & edit),
- bottom nav je mentální kotva, žádnej horní křížek a žádnej produktovej sticky teatr,
- smazání draftu je dvoufázově inline, ne modalovej cirkus.

---
