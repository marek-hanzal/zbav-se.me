---
key: MASTER
title: Draft — Produkt, pravidla a otevřená rozhodnutí
summary: Zkrácená produktová specifikace; rozpory a chybějící rozhodnutí jsou uvedené na začátku.
status: draft
---

# MASTER — Draft

**Pracovní verze. Než dokument prohlásím za schválený kontrakt produktu, musím projít, opravit a doplnit body níže.** Text zachovává dosavadní produktový záměr; nepotvrzuje, co už je implementované. Rozpory zůstávají přiznané, dokud o nich nerozhodnu.

<a id="draft-review"></a>

## Co prověřit, opravit a doplnit

Nezaškrtnutý bod je otevřený. ID jsou stabilní, abych se k nim mohl vracet postupně. Při uzavření bodu upravím příslušné pravidlo, nabídku i odvozená čísla; samotné zaškrtnutí nestačí.

<a id="draft-01"></a>

- [ ] **D01 — Cena Kupujícího a odhady.** Balíček stojí podle nabídky 149 Kč/měsíc, odhady používají 119 Kč. Potvrdit cenu a přepočítat ARPU předplatného i kombinovaný výnos. Původní odhady zůstávají označené jako historický scénář v [Odhadech](#odhady).

<a id="draft-02"></a>

- [ ] **D02 — Detail protistrany zdarma / placený.** Původní text označuje vypsané základní metriky za bezplatné, zároveň podmiňuje Score a sadu metrik passem. Vypsat přesně bezplatná pole a placený rozpad v [Metrikách protistrany](#koncept-detail-protistrany).

<a id="draft-03"></a>

- [ ] **D03 — Prodlužování a skládání passů.** Kupón nejde použít při aktivním passu, aktivace ale slibuje i prodloužení. Určit pravidla pro tokeny, kupóny, benefity předplatného, cílový účet/inzerát a začátek dalšího období. Vyjasnit označení „trvalé passy“ v balíčcích vůči pravidlu, že každý pass expiruje. Viz [Aktivace](#koncept-aktivace).

<a id="draft-04"></a>

- [ ] **D04 — Vyúčtování Paybacku.** Payback bere `expired` jako definitivní konec, Kontinuální nabídka dovoluje `expired → live`. Určit identitu a období vyúčtování, opakované expirace, započítanou cenu boostu, boosty z kupónů, měnu vrácení, nulový jmenovatel, zaokrouhlení poměru a zacházení s `banned`. Viz [Payback](#koncept-payback).

<a id="draft-05"></a>

- [ ] **D05 — Anti-topper, Mark a měření.** Mark dává jen badge; Anti-topper výslovně ruší prioritu Topu a badge ponechává. Určit, co potlačuje u Marku, než to započítám do metrik a kompenzací. Sladit současný zápis `anti-topper` + `visible` s podmínkou 0,5 s ve viewportu. Viz [Distribuce](#koncept-mark) a [Metriky inzerátu](#koncept-metrika-inzeratu-visible).

<a id="draft-06"></a>

- [ ] **D06 — Multi-Category.** Koncept popisuje časový pass, ceník jedno použití kupónu a balíčky obsahují kupóny i průběžný benefit. Určit rozsah, trvání a práva editace každého režimu. Doplnit definici `group` kategorie, kterou pravidlo vyžaduje. Viz [Multi-Category](#koncept-multi-category).

<a id="draft-07"></a>

- [ ] **D07 — Brand v ceníku.** Brand je benefit balíčků, ale chyběl v úplném katalogu rozšíření. Potvrdit samostatnou koupitelnost / Exclusive, dobu trvání a začátek měsíční lhůty pro uvolnění slugu. Viz [Brand](#koncept-inzerat-brand).

<a id="draft-08"></a>

- [ ] **D08 — Definice metrik a XP.** Doplnit jmenovatele, započítané události/stavy, období, přiřazení rolím, chování bez dat / s malým vzorkem a váhy i pásma Score. Určit převod XP na level a konkrétní pravidla proti farmení. Dosavadní text popisuje záměr, ne úplné výpočty. Viz [Metriky](#koncept-metriky-prodavaciho).

<a id="draft-09"></a>

- [ ] **D09 — Limity a souběžné nároky.** Free má v tabulce 3 aktivní inzeráty, starší příklad říká 10. U Prodejce je limit feedů „−“; určit, zda dědí základ, nebo znamená něco jiného. Sladit stropy fotek 3/5/10 s dalším passem +2. Určit výběr nadlimitních feedů a dopad Draft Gate na editaci existujícího inzerátu. Viz [Limity](#koncept-limit-aktivnich-inzeratu).

<a id="draft-10"></a>

- [ ] **D10 — Stavy a oprávnění.** Doplnit přechody a povolené zápisy podle role/stavu, hlavně `resolved`, `dispute`, zavření kupujícím, editaci/obnovení inzerátu a dopad banu na rozjednané obchody. Sladit obecné „mimo live je read-only“ s výjimkami flag / zrušit ignor. Přesně vyjmenovat záznamy mazané hned po konci transakce. Viz [Inzerát](#koncept-inzerat) a [Transakce](#koncept-transakce).

<a id="draft-11"></a>

- [ ] **D11 — Publikace a časovače.** Draft se publikuje, text Release window ale říká „neexistuje publish/republish“. Vyjasnit terminologii a vztah `createdAt`, `availableAt`, `expiresAt`. Určit kalendářní měsíc versus pevnou délku, průběh cooldownů a počátek/konec passu Kontinuální nabídky při nákupu před expirací inzerátu. Viz [Expirace](#koncept-automaticke-ukonceni-inzeratu) a [Release window](#koncept-release-window).

<a id="draft-12"></a>

- [ ] **D12 — Eventy a retence.** Definice `source` uváděla `listing`/`transaction`, přehled používá i `user`. Doplnit pokrytí dispute, flagů a karmy; ověřit názvy `transaction.create` / `transaction.created` ve dvou různých logách a agregaci aktuálních palců/ignorů vůči historii změn. Určit životnost eventů/Activity a agregací po smazání transakce i hranici mezi ponechanými texty/fotkami a okamžitě mazanými osobními údaji. Viz [Eventy](#koncept-user-eventy) a [Retence](#retence).

<a id="draft-13"></a>

- [ ] **D13 — Zásady versus pobídky.** Prověřit vědomé kompromisy: placenou prioritu / dřívější přístup, placený Anti-topper s imunním Top Maxxi a denní/RNG dropy vůči slibu klidu, kontroly a absence nátlaku. Doplnit konkrétní částky, pravděpodobnosti a anti-abuse bonusů. Přesnější hranice reputace/distribuce níže nahrazuje široký slogan „žádné pay-to-win“; mechaniky tím neruším.

<a id="draft-14"></a>

- [ ] **D14 — Úplnost UI a startu.** Landing sliboval pět bloků, vyjmenoval čtyři; chybějící blok rozhodnout. Ověřit pokrytí navigace, přidělení/obnovování/konec Founders a vztah k ukončení pro neaktivitu. Vyjasnit povinnost připomínkového emailu vůči volitelnému přeposílání Activity. Viz [UI](#koncept-landing) a [Uvedení na trh](#uvedeni-na-trh).

<a id="obsah-nahore"></a>
<a id="obsah"></a>

## Obsah

- [Otevřené body](#draft-review)
- [Pravidla dokumentu](#pravidla-dokumentu)
- [Zásady a zkušenost](#kodex)
- [Účet, katalog a inzeráty](#koncepty)
- [Objevování a přístup](#koncept-feed)
- [Transakce a komunikace](#koncept-transakce)
- [Metriky a eventy](#koncept-metriky-prodavaciho)
- [Ekonomika](#ekonomika)
- [Produktové kontexty](#koncept-landing)
- [Uvedení na trh, komunikace a odhady](#uvedeni-na-trh)

<a id="pravidla-dokumentu"></a>

## Pravidla dokumentu

Tady popisuju produkt: koncepty, chování, hranice a důvody důležité pro rozhodování. Implementační pravidla patří do `AGENTS.md`; kód, DB schémata a technické plány jinam.

Původní „co tu není, neexistuje“ je cíl schváleného dokumentu, ne tvrzení o úplnosti tohoto draftu. Po schválení řeším nesoulad produktu a dokumentu explicitní opravou jednoho z nich. Žádné tiché výjimky.

Každé pravidlo má jedno místo. Jinde na něj odkazuju. Zachovávám významné enumy/eventy, produktové texty a stabilní kotvy. Hypotézy označuju; chybějící výpočty a rozpory jsou otevřená rozhodnutí. Důvod ponechávám tam, kde pomůže rozhodnout budoucí spor.

<a id="kodex"></a>
<a id="smer-produktu"></a>
<a id="identita"></a>
<a id="produktove-cile"></a>

## Zásady a zkušenost

**Prodávám, neojebávám.** Stavím klidný, předvídatelný lokální trh. Základní cesta je inzerát → detail → zájem → domluva → konec. Úspěch je, když člověk nakoupí/prodá a nemusí řešit chaos kolem.

<a id="duvera-default"></a>
<a id="ferova-monetizace"></a>
<a id="no-p2w"></a>
<a id="respekt"></a>
<a id="otevrenost"></a>
<a id="komunikace"></a>

### Tvrdé hranice

- Důvěru vytváří konzistentní, vymahatelná pravidla. Žádné běžné honění přes občanky. Odpovědnost začíná obchodem přijatým prodejcem, ne projevením zájmu.
- **Reputaci nelze koupit. Placená distribuce je přiznaná.** Prodávám nástroje, kapacitu, čas, prezentaci a popsanou prioritu inzerátu. Peníze nezlepší Score ani reputační metriky. Žádné skryté boosty nebo handicap neplatících.
- Placenou podmínku ukazuju předem. Žádné překvapivé paywally, dark patterns, confirm-shaming, labyrint rušení ani nekonečné účtování zapomenutého předplatného.
- Uživatel ovládá filtry, citlivost, ignor a ukončení. Notifikace vycházejí ze skutečných událostí, nevyrábějí urgenci. Ukončená transakce se neotevírá znovu.
- Data mají konkrétní produktový účel, osobních údajů držím minimum a nic neprodávám třetím stranám. Cookies jen pro autentizaci: žádné marketingové/trackovací cookies, UTM ani externí analytické skripty. Interní doménové eventy slouží chování produktu.
- Jsem vidět jako autor a beru odpovědnost. Zdroják je veřejný k nahlédnutí (source-available, ne OSS pro komerční využití). Umím vysvětlit brány, řazení i omezení; zásadní změny oznamuju.
- Preferuju prevenci a mechaniky před ručním admin cirkusem. Žádná automatická moderace obsahu, shadow penalizace ani „AI vyřeší důvěru“. Explicitní rate-limit, ochrana ekonomiky a ruční zásah proti konkrétnímu zneužití mají místo.

<a id="tov"></a>
<a id="ux-principy"></a>
<a id="koncept-ui-ramec"></a>

### Jazyk a UX

- Tykám, mužský rod používám jako konzistentní default. Aktivní formulace: „Odmítl jsi“, „Prodejce tě odmítl“. Běžná práce je klidná; ostřejší tón patří na onboarding a bezpečnostní hranice.
- Onboarding může říct **„Klikej. Zkoumej. Není tu co posrat.“** Pak má práci nést UI. Žádné tooltipy, „(?)“, hinty nebo školení nahrazující srozumitelný návrh.
- Mobile-first. Konzistence, fakta, strukturované akce, minimum psaní. Normální text zůstává pro domluvu, není jejím jediným nástrojem.
- Empty state = **status → krátké proč → jedno jasné CTA**. Záměrné prázdno snižuje šum. Primární akce je jasná, destruktivní opatrná.
- UI reaguje hned; animace neblokuje interakci. Respektuju `prefers-reduced-motion`. Emoce můžou být v textu, akce jsou předvídatelné.

<a id="konkurenceschopnost"></a>
<a id="co-umim-lip"></a>
<a id="slabina"></a>
<a id="co-nedelam"></a>

### Pozice produktu

Výhoda proti běžným bazarům je kombinace: lokální objevování, strukturovaná fakta vedle normální komunikace, ochrana prodejce před nevyžádaným obsahem zpráv, definitivní konce, užitečné privátní metriky, dočasná data domluvy a čitelná ekonomika. Fotky drží pozornost; release window, Anti-topper, Payback a automatická expirace dávají distribuci i úklidu pravidla.

Největší slabina na startu je network efekt: příjemný prázdný trh je pořád prázdný. Startuju postupně. Méně šumu může znamenat méně impulzivních prodejů; transparentnost stojí práci a přitahuje kritiku; část lidí tenhle styl záměrně odfiltruje. Rozdíl se má projevit používáním, ne školením o konkurenci.

<a id="koncepty"></a>
<a id="koncept-uzivatel"></a>

## Účet, katalog a inzeráty

Účet je nástroj, ne sociální profil. Minimum identity (typicky email) doplňují data nutná pro feedy, drafty, inzeráty, transakce, Activity, preference, eventy, metriky a reporty. Nastavení má přednost před profilovkou a bio. Uživatel řídí hranice obsahu, ticho/přeposílání i ekonomická oprávnění.

<a id="koncept-kategorie"></a>
<a id="koncept-category"></a>
<a id="koncept-category-spec"></a>
<a id="koncept-seasons"></a>

### Kategorie a Seasons

Kategorie nese název, slug, locale a discovery režim:

| Režim | Nalezitelnost |
| --- | --- |
| `implicit` | Může do obecného feedu/hledání bez výběru kategorie. |
| `explicit` | Jen při vědomém filtru kategorie. Hygiena feedu, nikoli označení 18+. |

Category Spec určuje parametry editoru a filtry. Parametr má identifikátor, typ (text, enum, number, bool, date…) a režim: nefiltrovatelný / equality / range. Range je vědomý závazek vůči UX i výkonu. Primární kategorie určuje jazyk a Spec inzerátu. Definici skupin kategorií doplním v [D06](#draft-06).

Seasons jsou předdefinované kategorie, nikoli další taxonomie nebo reklama/tracking. Vybírám je u inzerátu i feedu normálně; v sezóně je zvýrazním, mimo ni mohou zůstat běžnou kategorií. Příklady: Vánoce, Valentýn, Velikonoce, Halloween; Zima/Jaro/Léto/Podzim; Začátek školy, Maturita.

<a id="koncept-lokace"></a>
<a id="koncept-uploady"></a>
<a id="koncept-galerie"></a>

### Lokace a média

Vstup lokace vždy prochází geolokační službou, která vrátí konkrétní autoritativní záznam a ověří existenci vstupu; náhodný text není identita místa. Lokace slouží poloze inzerátu, radiusu/vzdálenosti feedu (domov versus chalupa) a strukturovanému předání v transakci. Veřejná poloha může vést k fyzické návštěvě; uživatele nenutím dávat pin na dveře. Přesnou hranici soukromí transakčních lokací řeší [D12](#draft-12).

Upload nese identitu souboru a metadata; UGC soubory žijí na externí CDN. Galerie je uspořádaná sada referencí na uploady, první fotka je cover. Ani jedno nemá vlastní TTL. Média inzerátu žijí s inzerátem; přílohy transakce mizí při jejím hard delete, případně dřív s citlivým záznamem.

<a id="koncept-inzerat"></a>

### Inzerát a jeho stavy

Inzerát je veřejná nabídka prodejce v kategorii a lokaci, s médii, cenou a podmínkami. Základy musí být čitelné bez doptávání ve zprávách. Co prodejce slíbí, za tím stojí. Vznik i editace procházejí samostatným draftem.

| Stav | Význam | Defaultní seznam | Detail a akce |
| --- | --- | --- | --- |
| `live` | Dostupný pro nový obchod. | Způsobilý. | Relevantní akce: zájem, ignor, oblíbené, flag… |
| `expired` | Uplynul `expiresAt`. | Jen vědomý historický filtr. | Read-only, výjimka flag. |
| `closed` | Prodejce nabídku ručně ukončil. | Jen vědomý historický filtr. | Read-only, výjimka flag. |
| `sold` | Už není k dispozici. | Ne. | Bez zájmu; bezpečné akce typu flag / zrušit ignor zůstávají. |
| `banned` | Admin hard removal. | Ne. | 404, akce zakázané. |

Přístup k detailu dál omezuje [Citlivost](#koncept-citlivost-inzeratu). Úplnou matici akcí řeší [D10](#draft-10).

Draft není stav inzerátu; `deleted` neexistuje. Inzeráty zůstávají jako paměť trhu. `sold` vznikne přes `resolved` transakce nebo ručně po externím prodeji. Ostatní rozjeté transakce nad inzerátem se přepnou do `sold`; vyřešená transakce pokračuje k finále kupujícího. Do aktivního limitu se počítá pouze `live`.

<a id="koncept-inzerat-titulek"></a>
<a id="koncept-inzerat-cena"></a>
<a id="koncept-inzerat-delivery"></a>
<a id="koncept-inzerat-warranty"></a>
<a id="koncept-inzerat-stav"></a>
<a id="koncept-inzerat-stari"></a>
<a id="koncept-inzerat-popis"></a>
<a id="koncept-inzerat-pros-cons"></a>
<a id="koncept-inzerat-video"></a>

### Atributy inzerátu

| Pole | Pravidlo |
| --- | --- |
| Titulek | Jedna věc = jeden krátký, jasný a pravdivý titulek; žádný keyword spam. Jediný volný text pro vyhledávání. |
| Cena | Konkrétní částka vždy povinná. `closed` = pevná; `open` = výchozí pro domluvu; `offer` = představa prodejce a výzva k nabídce. `offer` musí být jasně označené v UI/seznamu, nikdy neznamená „bez ceny“. |
| Předání | Dobrovolná preference a filtr: `personal` (default), `post`, `package`, `other`. Lokace neurčuje způsob předání. Platforma nevynucuje logistiku ani negarantuje doručení. |
| Záruka | Dobrovolné tvrzení prodejce a filtr: `no-warranty` (nenabízím), `custom` (vlastní podmínky, např. 7 dní na vyzkoušení), `warranty` (deklarovaná zákonná záruka, typicky doklad o nákupu). Platforma neověřuje, negarantuje ani nesoudí. |
| Stav věci | Self-report a filtr: A top, B velmi dobrý, C průměr, D slabší, E špatný, F nejhorší. |
| Stáří věci | Self-report a filtr: A nový/skoro nový, B málo používaný, C běžně používaný, D starší, E hodně starý, F konec životnosti. Ne stáří účtu. |
| Popis | Dobrovolný Markdown pro fakta mimo strukturu. Neindexuje se pro textové hledání. Krátké konkrétní body mají přednost. |
| Pozitiva / limity | Dobrovolné „Co chci vyzdvihnout“ a „Chci být upřímný“, každé max. 5 stručných konkrétních položek. Podpora upřímnosti; žádné měření, odměny ani tresty za vyplnění. |
| Video | Upload nepodporuju: úzký přínos, šum ve feedu a nepřiměřené náklady na zpracování/ukládání. |

<a id="koncept-inzerat-brand"></a>

### Brand

Dobrovolný unikátní slug účtu, sdílitelný odkazem a použitelný jako filtr. U inzerátu/detailu ho ukazuju jen s aktivním Brand passem. Po expiraci mizí zobrazení i přímé vyhledání Brandu; po měsíci bez obnovy se slug uvolní. Platí běžné brány listingu. Koupitelnost, trvání a začátek lhůty řeší [D07](#draft-07).

<a id="koncept-draft"></a>

### Draft

Samostatná rozpracovaná kopie atributů budoucího/editovaného inzerátu s autosave; publikací vznikne inzerát. Drafty tvoří seznam rozpracované práce. Šablony/kopírování jsou budoucí možnost, dosud bez specifikovaného chování.

- Jeden souvislý nelineární editor, žádný wizard. Návrat/back je díky povinnému autosave bezpečný.
- Klikací karty sekcí: stav + editace. Nehotové přitahuje pozornost, vyplněné přejde do neutrálu.
- Tři bloky: nutné pro zveřejnění / podle kategorie / další volby.
- Smazání je dvoufázové inline.
- Draft Gate ukáže místo editoru status a odemknutí příslušného limitu. Dopad na existující práci doplním v [D09](#draft-09).

<a id="koncept-limit-poctu-feedu"></a>
<a id="koncept-limit-poctu-fotek"></a>
<a id="koncept-limit-aktivnich-inzeratu"></a>
<a id="koncept-pass-aktivni-inzeraty-20"></a>

### Limity

| Zdroj | Počítání a nárok | Po poklesu limitu |
| --- | --- | --- |
| Uložené feedy | Jen typ `user`; `search` slot nezabírá. Stropy jsou v [Balíčcích](#ekonomika-balicky). | Nadlimitní nemažu, ale skryju/disable s vysvětlením. Výběr nadlimitních není určený. |
| Fotky inzerátu | Základ 3; Photo Count přidá +2 na měsíc. Balíčky mají i stropy 3/5/10; skládání nároků není určené. | Nahrané nemažu, pro přidávání platí aktuální limit. |
| Aktivní inzeráty | Jen `live`. Jeden základ podle balíčku, základní tiery se nesčítají. Aktivní inzeráty +20 přidá 20 na měsíc za 140 T. | Existující běží, tvorba/publikace dalších `live` se blokuje přes Draft Gate do dostupné kapacity. |

Odemknutí probíhá odpovídajícím kupónem/passem nebo za jeho tokenovou cenu. Starší text zmiňuje i tiery „10/20“ a příklad „10 pro Free“, zatímco tabulka balíčků má Free = 3. Zůstává to bodem [D09](#draft-09), nikoli druhým platným základním limitem.

<a id="koncept-automaticke-ukonceni-inzeratu"></a>
<a id="koncept-pass-delsi-expirace-inzeratu"></a>

### Expirace inzerátu

Při tvorbě volím konec a UI ukazuje konkrétní datum. `expiresAt` se počítá od `createdAt` inzerátu, ne od práce v draftu. Bez Kontinuální nabídky se po jeho uplynutí stav změní na `expired`.

| Volba | Dostupnost a záměr |
| --- | --- |
| Za týden | Default pro rychlé uvolnění / test zájmu. |
| Za dva týdny | Delší běžná nabídka. |
| Za měsíc | Jen s aktivním časovým passem Delší expirace; bez něj se ve výběru nenabízí. |

Delší expirace pouze odemyká měsíční volbu. Nemění `createdAt`, release window ani prioritu. Zpoplatnění delšího života je vědomý závazek a brání kanibalizaci Kontinuální nabídky. Ta přidává životnost samostatně: týden/dva týdny + prodloužení; měsíc + prodloužení má dát dva měsíce v kuse. Přesné časování řeší [D11](#draft-11).

<a id="koncept-kontinualni-nabidka"></a>

### Kontinuální nabídka

Pass inzerátu pro průběžnou nabídku nad rámec jednorázového kusu. Aktivuje vlastník. U `live` přidaný měsíc naváže na expiraci bez ztráty zbývajícího času; u `expired` začne hned a vrátí nabídku do `live`. Během účinku platí běžná nalezitelnost, nové obchody i metriky. Po konci se vrátí do `expired`.

Neresetuje `createdAt` ani release window a nejde aktivovat nad `sold`. Při návratu do `live` se dosud aktivní Mark/Top projeví znovu, doběhlý nikoli. Naplánování passu a vztah k vyúčtování Paybacku zůstávají [D11](#draft-11) a [D04](#draft-04).

<a id="koncept-feed"></a>
<a id="koncept-hledat"></a>

## Objevování a přístup

Feed je uložený předpis dotazu, ne jeho výsledný seznam: filtry (kategorie/parametry, cena…), vlastní lokace, radius a řazení. Defaultně vznikne jeden obecný uživatelský feed bez filtrů jako bezpečný návrat.

| Typ | Chování |
| --- | --- |
| `user` | Vědomě uložený feed v „Moje seznamy“, počítá se do limitu. |
| `search` | Systémový singleton, max. 1 na účet; není v „Moje seznamy“ ani v limitu. Pamatuje poslední dotaz, filtry, lokaci, radius a řazení. |

Hledat je samostatný primární UX kontext nad stejnými filtry, list UI a pravidly. „Uložit jako feed“ vytvoří `user` a zabere slot; na limitu se blokuje uložení s důvodem, hledání dál funguje. Reset je rychlý, bez modalu: smaže starý `search`, vytvoří nový neutrální a zachová singleton.

<a id="koncept-seznam-inzeratu"></a>
<a id="koncept-citlivost-inzeratu"></a>

### Seznam, detail a citlivost

Seznam je výsledek dotazu; detail musí fungovat i přes sdílený/historický odkaz. **Detail smí vrátit 404 kvůli citlivosti nebo admin hard removal (`banned`).** Ostatní omezení ovlivňují seznam, dostupné akce nebo prioritu. Tvrdý limit je **200 inzerátů na dotaz**; pro další výsledky zúžím filtr.

Citlivost je hard gate, ne doporučení. Pořadí: `none < adult-relaxed < adult < sensitive < restricted`.

| Úroveň | Význam | Cooldown při zapnutí |
| --- | --- | --- |
| `none` | Běžný obsah, default. | — |
| `adult-relaxed` | Soft adult: vědomé odkliknutí varování, jen pro 18+. | Neuvedený. |
| `adult` | Kontext 18+. | 1 h |
| `sensitive` | Obsah na hraně, který nechci ukazovat všem. | 2 h |
| `restricted` | Zákonná omezení / oprávnění; systém je neověřuje. Součást ochrany je cooldown a vědomá volba. | 24 h |

Profil určuje maximum, co smím/jsem ochotný vidět. Feed/Hledat v jeho rámci vědomě zapíná, co chci vidět. Citlivost primárně označuje prodejce; opakované zjevné maskování je důvod zásahu.

| Pravidlo | Seznam | Přímý detail / akce |
| --- | --- | --- |
| Citlivost nad maximem | Vůbec není ve výsledcích. | Detail 404; nová omezená akce zakázaná (včetně zájmu, reakce či metriky viditelnosti). |
| Veřejný seznam | Pevný strop `adult-relaxed`: jen `none` / `adult-relaxed`. Žádný filtr ho nezvýší. | Chování citlivosti detailu se řídí vlastním hard gate. |
| Ignor | Ze všech seznamů skrytý při `withIgnored=false` (default); `withIgnored=true` jej zahrne. | Neblokuje otevření; „Ignoruješ“ + „Zrušit ignor“. |
| `expired` / `closed` | Jen vědomý historický filtr. | Stav a akce podle tabulky inzerátu. |
| `sold` | Mimo defaultní nabídku. | Stav a akce podle tabulky inzerátu. |
| Kategorie `explicit` | Jen s konkrétní kategorií / seznamem kategorií v dotazu. Prázdný seznam je bez filtru. | Kategorie sama detail neschovává. |
| Release window | Časové omezení nalezitelnosti níže. | Odkaz neblokuje. |
| Boosty / Anti-topper | Mění prezentaci/prioritu v rámci způsobilých výsledků. | Detail neblokují. |
| `banned` | Vyloučený. | 404 a zákaz akcí. |

Historický přístup je měkčí: dříve legálně získaný kontext (existující transakce, seller info v otevřené interakci) může zůstat potřebný i po snížení maxima. Není to nové oprávnění k omezené akci. Konkrétní rozsah doplním v [D10](#draft-10).

Tato pravidla platí napříč feedem, hledáním, Brandem, sekundárními kategoriemi a placenými rozšířeními. Pass ani aktivace neobchází brány; distribuce rozhoduje až nad způsobilým inzerátem.

<a id="koncept-release-window"></a>
<a id="koncept-early-discovery"></a>
<a id="koncept-early-delivery"></a>

### Release window

Běžná nalezitelnost začíná **12 hodin od `availableAt`**. Inzerát mezitím existuje a přímý odkaz funguje. Okno se svévolně neresetuje, neposouvá `expiresAt` a není samostatný perk.

| Režim | Účinek |
| --- | --- |
| Bez rozšíření | Nalezení až po release window. |
| Early Discovery kupujícího | Ignoruje okno; vidí způsobilé nové nabídky hned. |
| Early Delivery inzerátu | Ruší okno všem, včetně lidí bez Early Discovery. |

Maximum rozdílu je 12 hodin; nic se nesčítá a jiné brány platí pořád. S aktivním Early Discovery je ve feedu filtr „Jen Early Discovery“; po konci se změní na „Zaplatit si Early Discovery“. Rozpor v odkazu původního textu na Feed/Hledat a přesné umístění filtru patří do [D14](#draft-14). Význam „bez publish/republish“ vůči tvorbě z draftu do [D11](#draft-11).

<a id="koncept-razeni-inzeratu"></a>
<a id="koncept-mark"></a>
<a id="koncept-top"></a>
<a id="koncept-top-maxxi"></a>
<a id="koncept-anti-topper"></a>

### Řazení a distribuce

Uživatel volí řazení (typicky nejnovější / nejblíž). Výjimkou jsou přiznané prioritní vrstvy; v rámci Topu i Top Maxxi vyhrává novější aktivace. Ostatní brány vybírají kandidáty, nemění potichu uživatelské řazení.

| Nástroj | Účinek | S Anti-topperem |
| --- | --- | --- |
| Mark | Jen vizuální badge „Zvýrazněno“, bez záruky pozice. | Potlačení není definované; viz D05. |
| Top | Prioritní vrstva pod Top Maxxi. | Ztratí prioritu, zůstane badge; řadí se s běžnými podle volby uživatele. |
| Top Maxxi | Nejvyšší prioritní vrstva; max. 1 aktivní na účet. | Imunní, zůstává nahoře; nevzniká `anti-topper` ani Payback. |

Mark/Top/Top Maxxi běží jako pass konkrétního inzerátu. Ani nejvyšší priorita neobchází filtry, radius, release window, ignor, citlivost nebo životní cyklus. Anti-topper je placený klid kupujícího, mění jen seznam. Měření potlačení je v [Metrikách inzerátu](#koncept-metrika-inzeratu-anti-topper).

<a id="koncept-multi-category"></a>

### Multi-Category

Jeden inzerát, jedna primární a nejvýš dvě sekundární kategorie. Primární určuje UI, jazyk a Spec; sekundární rozšiřují distribuci, nevytvářejí kopie ani neumožňují výhodnější atributy. Všechny musí být ve stejné `group`.

Kategorie ve Feed/Hledat matchuje primární nebo sekundární. V jednom renderovaném seznamu je inzerát právě jednou, při změně kontextu může být znovu. Po zániku časového oprávnění sekundární kategorie zůstávají, nové přidání/změna se blokuje. Vztah tohoto režimu k jednorázovému kupónu řeší [D06](#draft-06).

<a id="koncept-oblibene"></a>
<a id="koncept-ignorace-inzeratu"></a>
<a id="koncept-palce"></a>

### Osobní výběr a reakce

| Funkce | Pravidlo |
| --- | --- |
| Oblíbené | Konkrétní uložené inzeráty, nezávislé na předpisu feedu. Při snížení citlivosti nabídky nad maximum zmizí z výběru. |
| Ignor | Osobní úklid per-user napříč zařízeními, bez globální penalizace prodejce nebo upozornění ostatním. Stav je doménový, nikoli anonymní analytika; promítá se do metrik inzerátu. Chování seznamu/detailu je výše. |
| Palce | Like / Dislike / žádný, kdykoli přepnutelný signál atraktivity konkrétní nabídky. Data pro produkt a prodejce, nikoli veřejné ego-lajky. |

<a id="koncept-flag-inzeratu"></a>
<a id="koncept-flag-uzivatele"></a>
<a id="koncept-ban"></a>

### Reporty a ban

Flag znamená problém s pravidly/podvodem/nebezpečím, ne nezájem. Bez automatického smazání, banu či shadowbanu; je to metrika a podklad ručního rozhodnutí.

| Akce | Dostupnost a změna |
| --- | --- |
| Flag inzerátu | Jen z detailu, toggle nahlásit/vzít zpět. Bez formuláře a důvodů. |
| Flag uživatele | Jen v kontextu transakce po `trade`, není toggle. |
| Ban | Ruční zásah admina s konkrétním důvodem (podvod, spam, zneužití). Účet nemůže vytvářet nové inzeráty, transakce ani zprávy; všechny jeho inzeráty přejdou do `banned`. |
| Admin hard removal | Výjimečná stopka pro nelegální/škodlivý obsah, stav `banned`, detail 404. |

<a id="koncept-transakce"></a>
<a id="koncept-zpravy"></a>
<a id="koncept-dispute"></a>
<a id="koncept-automaticke-ukonceni-transakce"></a>

## Transakce a komunikace

Transakce drží jeden inzerát, konkrétního kupujícího/prodejce, stav a timeline. Textové zprávy jsou jeden typ záznamu timeline, ne samostatný paralelní svět. Domluva kombinuje běžný text se strukturovanými fakty.

| Stav | Vznik a povolené chování |
| --- | --- |
| `interest` | Kupující projeví zájem. Může vytvářet vlastní komunikaci, vidí ji jen sám. Prodejce může přijmout do `trade`, odmítnout nebo ignorovat bez postihu; kupující může couvnout do `rejected`. |
| `trade` | Prodejce otevře obchod. Odkryje se dosavadní komunikace kupujícího; obě strany mají zprávy a strukturované zápisy podle role. |
| `resolved` | Prodejce označí vyřešeno, inzerát je `sold`. Tato transakce pokračuje k finále kupujícího; strukturované zápisy se omezí na dotažení konce (přesný výčet chybí). |
| `dispute` | Kupující nebo prodejce otevře spor až po `resolved`. Běžná domluva a strukturované zápisy pokračují do finále kupujícího. Signál v metrikách obou, bez vlivu na karmu; není arbitráž ani eskalace platformě. |
| `rejected` | Odmítnutí / couvnutí na začátku, bez povinného vysvětlování; hint „OK, tady cesta nevede“, read-only. |
| `sold` | Systémová stopka ostatních rozjetých transakcí, když se nabídka prodá; read-only. |
| `expired` | 3 dny bez aktivity; read-only. |
| `success` | Kupující potvrdí dobrý výsledek; read-only. |
| `closed` | Kupující ukončí z vlastní vůle; read-only. |

Terminální stavy jsou `rejected`, `sold`, `expired`, `success`, `closed`: bez re-open. Další kontakt vyžaduje novou transakci, pokud je vůbec povolená. Úplný přehled přechodů a akcí doplním v [D10](#draft-10).

### Ochrana prodejce a timeline

Do `trade` prodejce nevidí obsah, náhledy ani počet buyer-side zpráv a nedostává z nich notifikace. `interest` je buffer kupujícího, ne inbox prodejce. Odpovědnost začíná přijetím obchodu. Couvnutí kupujícího je přesto signál pro Closer rate.

Timeline nese text, galerie (důkaz/doplnění), lokaci, balík/tracking, dočasné osobní údaje a automatické systémové/status události. Tracking je fakt pro domluvu, ne bezpečnostní garance; číslo zásilky je volitelné a bez něj nic navíc nepíšu.

Časovač transakce posouvá jakákoli aktivita nad ní, včetně user-authored komunikace a systémových/status událostí. Dispute je běžná aktivita. Po třech dnech neaktivity systém zapíše `transaction.expired` a nastaví `expired`.

<a id="retence"></a>

### Retence dat a paměť trhu

Retence znamená paměť trhu, nikoli návykovost. Historie nabídky/cen dává kontext; osobní domluva je dočasná.

| Data | Životnost |
| --- | --- |
| Inzerát a jeho média | Zůstávají s inzerátem jako paměť trhu, i mimo defaultní seznam. |
| Citlivé a strukturované zápisy transakce | Při terminálním stavu hned mažu to, co už nemá účel. Přesný seznam chybí. |
| Celá transakce včetně zbývajících textů/fotek | Hard delete 3 měsíce po terminálním stavu. |
| Upload/galerie | Životnost rodiče, případně dřívější smazání citlivého záznamu; žádný vlastní TTL. |

Životnost eventů/Activity a osobní údaje uvnitř textu/fotek musí dořešit [D12](#draft-12).

<a id="koncept-notifikace"></a>

### Notifikace (Activity)

Default je ticho. Notifikace vzniká ze skutečné události, typicky zprávy či změny transakce. **Activity je autorita pro „co se stalo“; push/email jsou její zrcadla.** Email je volitelný forward/digest, jeho nedoručením se informace neztratí.

Událost rozlišuje původ `buyer` / `seller` / `transaction` / `system`; `unknown` je nouzový fallback. Activity umí lidskou zprávu, transaction událost i čistě systémovou událost. Deduplikuju stejné fakty, nepíšu jiná produktová pravidla do emailu/pushe. Kritické zprávy (reset hesla, bezpečnostní alerty) jdou vždy. Režim připomínky neaktivity řeší [D14](#draft-14).

<a id="koncept-metriky-prodavaciho"></a>
<a id="koncept-metriky-kupujiciho"></a>
<a id="koncept-detail-protistrany"></a>

## Metriky a eventy

Metriky protistrany pomáhají odhadnout reakci, dotažení a vytížení; nejsou automatický trest. Kupující vidí prodejce, prodejce kupujícího. Detail protistrany je tento pohled, nikoli další entita. Přesné výpočty chybí v [D08](#draft-08), bezplatný/placený rozsah v [D02](#draft-02).

Bezplatně jsou výslovně uvedené datum registrace (obě role) a počet všech inzerátů (prodejce). Původní tvrzení „vypsané základní metriky zdarma“ současně koliduje s odemknutím Score a sady metrik passem. Do rozhodnutí nelze z dalších řádků odvozovat schválený paywall.

<a id="koncept-metrika-reakcni-doba"></a>
<a id="koncept-metrika-odmitnuti-bez-interakce"></a>
<a id="koncept-metrika-resolved-rate"></a>
<a id="koncept-metrika-expirace"></a>
<a id="koncept-metrika-vytizeni"></a>
<a id="koncept-metrika-aktivita"></a>
<a id="koncept-metrika-flag-rate"></a>
<a id="koncept-karma"></a>
<a id="koncept-metrika-karma"></a>
<a id="koncept-metrika-closer-rate"></a>
<a id="koncept-metrika-decision-rate"></a>
<a id="koncept-metrika-score"></a>

### Metriky protistrany

| Metrika | Role hodnoceného | Záměr / zachované pravidlo |
| --- | --- | --- |
| Reakční doba | Obě | Reakce na zprávu / změnu stavu transakce. |
| Odmítnutí bez interakce | Prodejce | Odmítnutí bez reálné interakce v `trade`; legitimní volba, ne morální soud. |
| Resolved rate | Prodejce | Dotažení do vyřešeno; jen transakce, které dosáhly `trade` a dál. |
| Expirace | Obě | Kolik transakcí skončí `expired`; není automatický spouštěč banu. |
| Vytížení | Obě | Počet paralelně rozjednaných věcí. |
| Aktivita | Obě | Přítomnost podle `user.active`; scroll/view ani jiné listing eventy se nepočítají. |
| Flag rate | Prodejce | Agregace nahlášení; podklad ručního rozhodnutí, ne rozsudek. |
| Karma | Prodejce | Agregace zkušeností v transakci po `trade`: Like (Dobrý) / Dislike (Špatný). Nehlasování = neutrál, není flag uživatele. |
| Closer rate | Kupující | Rychlé ukončování bez smysluplné interakce. Legitimní odmítnutí prodejce s tím nesplývá; couvnutí kupujícího v `interest` přes `rejected` se počítá. |
| Decision rate | Kupující | Rozhodnutí/uzavření namísto vyhnití. |
| Score | Obě | Souhrn A–F z metrik příslušné role, vysvětlitelný konkrétními čísly. Privátní signál v Detailu protistrany; peníze ani XP ho nezlepšují. |

Karma hodnotí člověka v konkrétní transakci až po `trade`, palce hodnotí atraktivitu inzerátu. Přípustné změny karmy vůči terminálním stavům vyžadují [D10](#draft-10).

<a id="koncept-xp"></a>

### XP

Interní body za používání, bez vlivu na Score/důvěru, nátlaku, FOMO nebo nákupní páky. XP se přičítá uživateli, level se z něj odvozuje; záměr nemá horní hranici levelů. Vytvoření feedu = **5 XP**, publikace inzerátu = **25 XP**. Farmení některých akcí zatím vědomě toleruju; převod levelů a skutečné anti-farm podmínky doplním v [D08](#draft-08).

<a id="koncept-user-eventy"></a>

### User Eventy

Append-only doménová stopa chování pro metriky/Score, nikoli externí analytika. Zachované pojmy z původního kontraktu:

| Pole | Význam |
| --- | --- |
| `userId` | Komu se událost/metrika počítá. |
| `scope` | `user` = vlastní akce; `foreign` = akce protistrany dopadající na mě. |
| `source` | Kontext; původní výčet `listing` / `transaction` je neúplný vůči řádku `user` níže. |
| `group` | Sekvence, typicky `listingId` nebo `transactionId`. |
| `event` | Typ události. |
| `isTerminal` | Ukončení sekvence. |
| `createdAt` | Čas události. |

Interakci dvou lidí zapisuju oběma: autorovi jako `scope=user`, protistraně jako `scope=foreign`.

| Kontext | Zachované názvy eventů |
| --- | --- |
| `listing` | `listing.create`, `listing.sold` |
| `user` | `user.active`: heartbeat 1× za hodinu při pobytu v appce, počítáno od prvního otevření. |
| `transaction` | `transaction.create`, `transaction.trade`, `transaction.message`, `transaction.resolved`, `transaction.sold`, `transaction.success`, `transaction.rejected`, `transaction.closed`, `transaction.expired` |

Přehled není úplná schválená specifikace zdrojových dat; rozpory a chybějící události řeší [D12](#draft-12).

<a id="koncept-rozsirena-data-inzeratu"></a>
<a id="koncept-metrika-inzeratu-visible"></a>
<a id="koncept-metrika-inzeratu-impression"></a>
<a id="koncept-metrika-inzeratu-view"></a>
<a id="koncept-metrika-inzeratu-anti-topper"></a>
<a id="koncept-metrika-inzeratu-thumbs"></a>
<a id="koncept-metrika-inzeratu-ignored"></a>
<a id="koncept-metrika-inzeratu-transactions"></a>

### Metriky inzerátu a Rozšířená data

Privátní data mých inzerátů jsou vidět pouze s aktivním passem Rozšířená data; bez něj žádný bezplatný pseudo-score. Zobrazuju `impression`, `view`, palce, ignor, `transactions` (počet transakcí) a poměr `anti-topper / visible`.

Zdroj má být append-only `listing_event`; zachované definice:

| Event / signál | Vznik / význam | Deduplikace |
| --- | --- | --- |
| `visible` | Karta ve viewportu ≥ 0,5 s; reálné zobrazení. | Max. 1× na inzerát při jednom zobrazení seznamu. |
| `impression` | Karta ve viewportu ≥ 1,6 s; zaujetí/zpomalení. | Stejně jako `visible`. |
| `view` | Detail otevřený ≥ 2,5 s; zájem o detail. | Max. 1× na otevření detailu. |
| `thumbs` | Like/Dislike jako atraktivita nabídky. Původní text současně odkazuje na reálné entity palců. | Agregace změn versus aktuální stav není určená. |
| `ignored` | Uživatel dá ignor; osobní úklid a signál pro prodejce. | Agregace změn versus aktuální stav není určená. |
| `transaction.created` | Vznik transakce; počet vláken zájmu, nikoli úspěch/kvalita. | Neuvedená. |
| `listing.sold` | Přepnutí do `sold`, ručně nebo přes `resolved`. | Neuvedená. |
| `anti-topper` | Potlačení Mark/Top uživateli s Anti-topperem; současně zápis `visible` ve stejném čase. Top Maxxi je vyjmutý. | Zamýšleně jako `visible`, přesná podmínka otevřená. |

Vznik transakce zapisuje událost do `listing_event` i `user_event`, každý pro vlastní účel. Prodej zapisuje `listing.sold` do listing logu a `transaction.sold` u dotčených transakcí do user logu. Názvy a úplnost logů řeší [D12](#draft-12); měření potlačení a jeho časový práh [D05](#draft-05).

<a id="ekonomika"></a>
<a id="koncept-tokeny"></a>
<a id="koncept-kupon"></a>
<a id="koncept-pass"></a>
<a id="koncept-exclusive"></a>
<a id="koncept-cenik"></a>

## Ekonomika

Kupující kupuje klid, čas a lepší signál pro rozhodnutí; prodejce distribuci, privátní data a kapacitu. Hranice monetizace jsou v [Zásadách](#kodex). Ceník musí obsahovat všechny aktivovatelné věci včetně těch, které nejdou samostatně koupit.

| Pojem | Pravidlo |
| --- | --- |
| Tokeny | Interní měna z přídělu/bonusu/nákupu. Skladovatelná, neexpiruje. |
| Kupón | Konkrétní poukázka na jedno použití; není měna. Expiruje nejpozději za 3 měsíce od získání, zůstává i po konci předplatného. Nekonečné hromadění není cílem. |
| Pass | Časově omezený stav/oprávnění s expirací. Běží, nebo neběží; není spotřební item. Podle typu patří účtu (např. Anti-topper) nebo inzerátu (Mark/Top/Top Maxxi). |
| Exclusive | Věc z balíčku/předplatného, nekoupitelná za Tokeny; v ceníku musí být viditelně označená. |

Původní věta „expirovat může jen Pass“ neplatí pro celý model: expiruje i kupón. Závazek Tokenů je pouze jejich vlastní neexpirace.

<a id="koncept-aktivace"></a>

### Aktivace

1. Mám-li použitelný kupón pro danou věc, spotřebuju ho přednostně.
2. Jinak strhnu Tokeny podle ceníku; Exclusive takto neaktivuju.
3. Výsledkem je jednorázová akce nebo vznik/prodloužení passu podle typu věci.

CTA ukazuje rozdíl: `Aktivovat (1× Kupón)` / `Aktivovat (XX Tokenů)`. Uživatel ví, co spotřebuje a co zapíná na čas. Původní zákaz použití kupónu při aktivním stejném passu zůstává v rozporu s obecným prodlužováním; řeší [D03](#draft-03). Aktivace nikdy neobchází brány.

<a id="koncept-predplatne"></a>
<a id="koncept-automaticke-ukonceni-predplatneho"></a>

### Předplatné a neaktivita

Balíčky jsou měsíční oprávnění/limity a příděly, ne role uživatele. Při každém renew se připíšou Tokeny/kupóny balíčku. Jediná uživatelská změna běžícího předplatného je Cancel: zaplacené období doběhne, další se neobnoví.

Po **1 měsíci neaktivity** pošlu email připomínku; po **2 měsících** zastavím obnovování na konci aktuálního období. Aktivita znamená přítomnost `user.active` v `user_event` se `scope=user`, nikoli listing scroll/view. Časová definice měsíce patří do [D11](#draft-11), režim připomínky a Founders do [D14](#draft-14).

<a id="ekonomika-balicky"></a>

### Balíčky

**Draft nabídky.** Cenu Kupujícího ověřit v D01, limity v D09 a lifetime průběžných passů v D03. „−“ zachovává původní údaj; u limitu feedů Prodejce není jeho význam rozhodnutý. ✓ značí průběžný benefit; „Pass“ v kupónech odkazuje na tento benefit, nikoli další měsíční kupón.

| Položka | Free | Founders | Kupující (149 Kč) | Prodejce (229 Kč) | Pro (499 Kč) |
| --- | --- | --- | --- | --- | --- |
| Tokeny / měsíc | − | 100 T | 100 T | 200 T | 300 T |
| **Limity** | | | | | |
| Uložené feedy | 3 | 10 | 5 | − | 10 |
| Aktivní inzeráty | 3 | 20 | 5 | 10 | 20 |
| Fotky inzerátu | 3 | 10 | 3 | 5 | 10 |
| **Průběžné passy / benefity (D03)** | | | | | |
| Payback | − | ✓ | − | ✓ | ✓ |
| Photo Count | − | − | − | ✓ | ✓ |
| Delší expirace | − | ✓ | − | ✓ | ✓ |
| Rozšířená data | − | ✓ | − | ✓ | ✓ |
| Brand | − | ✓ | − | ✓ | ✓ |
| Detail protistrany | − | ✓ | − | − | ✓ |
| Anti-topper | − | ✓ | − | − | ✓ |
| Early Discovery | − | ✓ | − | − | ✓ |
| Multi-Category | − | ✓ | − | − | ✓ |
| **Kupóny / měsíc** | | | | | |
| Early Discovery | − | − | 3× | − | Pass |
| Anti-topper | − | − | 3× | − | Pass |
| Early Delivery | − | − | − | 3× | 3× |
| Mark | − | 10× | − | 3× | 3× |
| Top | − | 5× | − | 3× | 3× |
| Top Maxxi | − | 3× | − | 3× | 3× |
| Multi-Category | − | − | − | 3× | Pass |
| Kontinuální nabídka | − | 5× | − | 3× | 5× |

<a id="ekonomika-tokeny-ceny"></a>

### Nákup Tokenů

Orientační kurz **1 Kč ≈ 2 T**. Nákupní nabídka:

| Balíček | Cena | Tokeny | Bonus dle původní nabídky |
| --- | --- | --- | --- |
| Na zkoušku | 149 Kč | 300 T | Standard |
| Balík | 299 Kč | 650 T | +50 T |
| Do zásoby | 599 Kč | 1 400 T | +200 T |

<a id="ekonomika-cenik-rozsireni"></a>

### Katalog rozšíření

Kupón → Pass znamená spotřebovat kupón a spustit časový účinek; pravidla obnovy jsou D03. Ceny jsou v Tokenech. Brand je doplněný jako **nerozhodnutý záznam**, nikoli nově naceněná funkce.

| Co | Model | Účinek / trvání | Cena |
| --- | --- | --- | --- |
| Early Discovery | Kupón → Pass | 7 dní; dřívější nalezitelnost pro kupujícího. | 75 T |
| Early Delivery | Kupón | Jeden inzerát dostupný všem hned. | 20 T |
| Anti-topper | Kupón → Pass | 7 dní. | Exclusive |
| Mark | Kupón → Pass | 7 dní, konkrétní inzerát. | 20 T |
| Top | Kupón → Pass | 7 dní, konkrétní inzerát. | 40 T |
| Top Maxxi | Kupón → Pass | 3 dny, konkrétní inzerát. | 50 T |
| Multi-Category | Kupón; benefit/pass je D06 | 1 použití: 1 + 2 kategorie. | 50 T |
| Detail protistrany | Kupón → Pass | 7 dní. | 50 T |
| Photo Count | Kupón → Pass | 1 měsíc, +2 fotky. | 75 T |
| Aktivní inzeráty +20 | Kupón → Pass | 1 měsíc. | 140 T |
| Delší expirace | Kupón → Pass | 1 měsíc; odemkne volbu „Za měsíc“. | 60 T |
| Payback | Pass | Benefit předplatného. | Exclusive |
| Kontinuální nabídka | Kupón → Pass | 1 měsíc života inzerátu navíc. | Exclusive |
| Brand | Pass | Doba a koupitelnost otevřené, D07. | K určení |

<a id="koncept-tokeny-ziskavani"></a>

### Bonusy a získávání Tokenů

Tokeny přicházejí z měsíčního přídělu předplatného, nákupu a bonusů:

| Bonus | Podmínka / účel |
| --- | --- |
| Za `resolved` | Prodejce přepne transakci do `resolved`; bez toho bonus nevzniká. Motivace k pravdivému konci/úklidu. Výše není určená. |
| Denní drop | Vědomé vyzvednutí 1× denně, orientačně kolem 10 T; drobná pobídka k návratu. |
| RNG drop ve feedu | Občas při scrollu, nízká pravděpodobnost, malé překvapení. |

Dropy nejsou nosný ekonomický model. Při zjevném zneužití se bonus nemusí vyplatit; konkrétní ochranu proti farmení musím doplnit. Pobídky vůči slibu klidu řeší [D13](#draft-13).

<a id="koncept-payback"></a>

### Payback

Kompenzace ceny Mark/Top za potlačení Anti-topperem; Top Maxxi je imunní a kompenzaci nemá. Nárok vzniká jen s aktivním Payback passem **v době vyhodnocení** (Exclusive, typicky Prodejce/Pro).

Vyhodnocení má proběhnout při `expired`, `sold` nebo `closed`, i po ručním zavření a i s výsledkem 0. Poměr je `anti-topper / visible`:

| Potlačení | Vrácená část ceny |
| --- | --- |
| < 25 % | 0 % |
| 25–49 % | 25 % |
| 50–74 % | 50 % |
| ≥ 75 % | 75 % |

Maximum vrácení je 75 %. Pásma zachovávají původní formulaci; desetinné hranice/zaokrouhlení nejsou rozhodnuté. Opakovanou expiraci, základ ceny, kupónové boosty a měnu vrácení řeší [D04](#draft-04), skutečné potlačení Marku a vznik měření [D05](#draft-05).

<a id="koncept-landing"></a>
<a id="koncept-navigace"></a>
<a id="koncept-muj-ucet"></a>
<a id="koncept-ui-dashboard"></a>
<a id="koncept-ui-seller"></a>
<a id="koncept-ui-buyer"></a>
<a id="koncept-ui-rozsireni"></a>
<a id="koncept-ui-bonusy"></a>

## Produktové kontexty

Navigace drží stabilní vstupy do přehledu, prodeje, nákupu, účtu a ekonomiky. Role jsou vstupy do činností, ne identita nebo povinný přepínač seller/buyer. Konkrétní rozložení navigace a obrazovek není produktový kontrakt.

| Kontext | Odpovědnost |
| --- | --- |
| Dashboard | Co je nového, co čeká na reakci, kam pokračovat. Přehled/rozcestník, ne další feed nebo vlastní logika ostatních funkcí. |
| Chci prodávat | Tvorba, rozpracované věci, nabídky a rozjednané obchody. Začít / navázat / spravovat / dotáhnout. |
| Chci nakupovat | Návrat do seznamu, feedy, oblíbené a rozjednané nákupy. Zachovat rozkoukaný kontext. |
| Hledat | Samostatný primární kontext hledání podle pravidel feedu. |
| Můj účet | Minimum identity/email, maximum citlivosti, ticho a forwarding/digest Activity. Bez sociálního profilu. |
| Rozšíření | Úplný katalog aktivací včetně Exclusive; aktuální stav, účinek, požadavky a jedno jasné „Aktivovat“. |
| Bonusy | Vědomé vyzvednutí odměn (ne automaticky), pořízení předplatného a balíčků Tokenů. Navazuje na Rozšíření; nenazývám to obchodem. |

Landing je stručná vizitka postoje, bez popupů, urgencí a školení. Čtyři skutečně popsané bloky (původně tvrzených pět řeší D14):

| Blok | Obsah |
| --- | --- |
| Hero | „Nakupuješ nebo prodáváš?“; rovnocenná CTA „Už se známe“ (Login), „Přidej se!“ (Register). |
| Autor | Fotka, jméno, GitHub, „Bez keců. Bez ojebů.“; osobní odpovědnost. |
| Aktivita vývoje | GitHub-like heatmap jako důkaz práce. |
| Live Pulse | Timeline registrací, nových inzerátů a transakcí jako signál živosti trhu. |

<a id="uvedeni-na-trh"></a>

## Uvedení na trh, komunikace a odhady

Největší nepřítel startu je prázdno. Trh rozjíždím sekvenčně:

1. **Komunitní start na Discordu**, úzké téma (typicky vapování), shoda a tolerance k nedokonalostem. Cíl: první nabídky, transakce a paměť trhu.
2. **Regionální expanze: Karlovy Vary, Ostrov, Sokolov.** Billboard/word-of-mouth až nad živým produktem, ne prázdnou stránkou.

Prvních **300 registrovaných** získá systémové předplatné Founders na **6 měsíců od registrace**. Přidělení je jednorázové poděkování na startu; nejde koupit. Benefity jsou v tabulce balíčků, kde má vlastní sloupec; ve výběru k nákupu není. Průběh přídělů, konec a neaktivitu upřesním v D14.

Komunikace ukazuje fungující produkt, nevysvětluje konkurenci a nespamuje. Slogan startu: **„Hoď to sem taky.“**

<a id="verejne-vystupovani"></a>

### Veřejné vystupování

Ukazuju, že produkt existuje a žije; nepředstírám anonymní marketingový tým.

**Billboardy (Karlovy Vary):** povědomí a šok, který si lidé pošlou; filtr publika je záměr. Dva řádky: tagline na jediném řádku + povinné `https://zbav-se.me`. Bílé pozadí, minimum barev, bez QR, dalších textů a ikon. Čitelnost z auta při cca 40–50 km/h. Tagline má největší váhu; `https://` je slabší, doména barevně i velikostí dominantní.

Zachovaný shortlist: „Prodávám. Neojebávám.“; „Prodej bez sraní.“; „Bez keců. Bez ojebů.“; „Bazary? Ne.“; „Beze sraní. Tečka.“; „Prodávej. Neojebávej.“; „Kupuj. Bez ojebů.“; „Prodej. Neojebávej.“; „Bez keců. Bez sraní.“

**YouTube Shorts:** mluvím já, ich-formou. Ukazuju funkci nebo změnu a důvod, bez náboru, „stáhni teď“ a CTA nátlaku. Tón „tohle tu je, cuc na to“. Formáty: 10–30 s feature drop (jedna věc/kontrakt); 30–60 s change log; 30–60 s princip a jeho projev v produktu.

<a id="odhady"></a>

### Odhady — historický scénář k přepočtu

**Hypotézy, nikoli ověřená čísla nebo produktová pravidla.** Původně označené jako konzervativní. Scénář zachovává starou cenu Kupujícího 119 Kč, a proto není sladěný s nabídkou 149 Kč. Nepoužívat jako aktuální forecast před vyřešením D01.

| Balíček | Podíl MAU | Cena / měsíc ve scénáři | Zaokrouhlený příspěvek ARPU |
| --- | --- | --- | --- |
| Kupující | 0,5 % | 119 Kč | 0,60 Kč |
| Prodejce | 2,0 % | 229 Kč | 4,58 Kč |
| Pro | 0,5 % | 499 Kč | 2,50 Kč |
| Celkem | 3,0 % | | 7,68 Kč |

Extras předpokládají **10 000 MAU**, **10 %** nakupujících Tokeny (1 000 lidí), průměr **210 Kč/měsíc**: příjem kolem **210 000 Kč**, cash-in ARPU **21 Kč**.

| Zdroj při 10 000 MAU | Původní ARPU | Původní měsíční příjem |
| --- | --- | --- |
| Předplatné | 7,68 Kč | ~76 800 Kč |
| Extras | 21,00 Kč | ~210 000 Kč |
| Celkem | 28,68 Kč | ~286 800 Kč |
