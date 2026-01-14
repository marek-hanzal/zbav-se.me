# Master

Single source of truth projektu. _**Co tu není, neexistuje**_.

## Document Rules

- Tenhle Master drží **koncepty, pravidla a produktová rozhodnutí**.
- **Žádný kód, DB schémata ani implementační detaily**
- Když něco doplňujeme, doplňujeme to jako **pravidlo** (co a proč), ne jako „jak to přesně nakódujeme“.

## Obsah

- [Směr produktu](#smer-produktu)
- [Konkurenceschopnost](#konkurenceschopnost)
- [Kodex](#kodex)
- [Terminologie](#terminologie)
- [UI](#ui)
- [Základní stavební kameny](#zakladni-kameny)
- [Mechaniky](#mechaniky)
- [Předplatné](#predplatne)
- [Goldíky](#goldiky)
- [Tokeny & passy](#tokeny-a-passy)
- [Uvedení na trh](#uvedeni-na-trh)
- [Retence a paměť trhu](#retence)
- [Odhady monetizace a růstu](#odhady)

---

<a id="smer-produktu"></a>

## Směr produktu

### Identita

- **Core myšlenka:** „**Prodáváme, neojebáváme.**“
- Nejsme další bazar. Jsme **systém důvěry a komunity**
- Cíl: **klid, důvěra, kompetence uživatele**
- Monetizace stojí na **hodnotě**, ne na tlaku
- Předpoklad IQ uživatelů je alespoň 80 (nadnesené)
- Stavíme na důvěře mezi **platformou** a **uživateli** pro nastavení *mentálního komfortu*

### Tone of Voice

- Onboarding bez pozlátek: „**Klikej. Zkoumej. Není tu co posrat.**“
- Neučíme, nekomentujeme, neotravujeme.

### Produktové cíle

- Pocit „teplého obýváku“ místo reklamního cirkusu.
- Paměťová stopa: bylo to klidné, rychlé, fungovalo to.
- Konzistence je víc než jedna killer funkce.
- Kontrast s konkurencí má bolet při návratu.

### UX principy

- Konzistence > chytrost.
- Empty state = status → vysvětlení → **jedno** CTA.
- Prázdno je záměr (nižší kognitivní zátěž).
- Status může být emoční, CTA musí být mechanické.

### Komunikace

- Otevřená - **zdrojové kódy** jsou dostupné veřejně k auditu
- Na domovské stránce je odkaz na **transparentní bankovní účet**
- Zároveň je na domovské stránce **kalendář aktivity** vývoje (Github-like)
- Dále prezentujeme i jak se projektu daří pomocí **dynamické timeline** (první skokani, prvních xxx inzerátů, hlášky o tom, že dneska nic moc, že přibyly další inzeráty a pod)

---

<a id="konkurenceschopnost"></a>

## Konkurenceschopnost

> Subjektivní výhody a argumenty. Nejsou to sliby ani marketing. Je to checklist, proč má tenhle projekt existovat a čím se liší.

Nesnažíme se o čelní souboj v „kdo má víc všeho pro všechny“. Stavíme alternativu pro lidi, co chtějí **prodat/koupit rychle, v klidu a bez šmírování**.

### Co umíme líp

- **Klid místo cirkusu**: minimum vizuálního šumu, žádné otravné „zapoj se“ UX. Aplikace má pomoct uzavřít obchod, ne spolknout ti večer.
- **Soukromí jako default**: držíme jen minimum dat (prakticky email). Nejsi produkt.
- **Anti-spam obchod**: dokud prodávající nepřijme transakci, kupující nemůže psát ani posílat strukturovaná data. Konec „je to aktuální?“ spamu a hromadných výkřiků do tmy.
- **Důvěra z chování, ne z keců**: reputace stojí na metrikách (reakce, expirace, closer, resolved, flagy), ne na bio a „věř mi bro“ profilech.
- **Feed jako hlavní produkt**: uživatel si nastaví zájem a systém mu ho servíruje. Vyhledávání je jen UI zkratka pro feed, ne separátní svět.
- **Paměť trhu**: expirované inzeráty nezmizí. Vzniká historie a kontext (ceny, nabídka, „co tu běžně je“), což časem zvyšuje hodnotu platformy.
- **Férová ekonomika pro uživatele**: nebereme procenta z prodeje. Platí se za nástroje (rozšíření) a předplatné.
- **Bez pay-to-win dominance**: placené věci jsou viditelné a přiznané. Neplacený obsah se může mírně potlačit, ale nemizí v díře.
- **Deterministické brány**: citlivost je přísně řízená nastavením uživatele (u detailu klidně 404). Ignor je dobrovolný (přímý odkaz funguje).
- **Transparentnost projektu**: otevřené zdrojáky, transparentní účet, viditelná aktivita vývoje. Důvěra v praxi, ne PR.

### V čem je naše slabina (a proč s tím počítáme)

- **Prázdno na startu**: bez obsahu je každý marketplace mrtvý. Tohle je gravitace, ne bug.
- **„Levný drobnosti“ jsou těžší**: když někdo prodává věc za pár korun, často mu stačí nejjednodušší kanál bez přemýšlení. My míříme na situace, kde se vyplatí mít klid, filtr a kontext.
- **Uživatel musí pochopit feedy**: je to výhoda, ale i nárok na UX. Proto má být default jednoduchý a „zbytek si zapneš, když chceš“.

Jak to obcházíme:
- startujeme v úzké komunitě (vyšší důvěra, vyšší hustota kvality),
- teprve pak teprve jdeme do regionu,
- nové uživatele necháme 1 měsíc v plné síle (trial Pro), ať to ochutnají a poznají rozdíl.

### Co vědomě neděláme (a proč)

- **„protočím ti to, protože zaplatíš“**: agresivní paid reach a tlačení věcí do obličeje vytváří šum, scam prostor a únavu. Naše cesta je čitelnost trhu, kontrola uživatele a reputace.

---

<a id="kodex"></a>

## Kodex

Tento kodex popisuje **vědomá rozhodnutí a kontrakt** mezi platformou a jejími uživateli. Nejde o právní podmínky ani marketing. Jde o způsob, jakým se autor, systém chová - a proč.

> Tyto principy a závazky budou **veřejně dostupné** pro ty, kdo si je budou chtít přečíst - jsou součástí *celkové transparentnosti* projektu.

### Důvěra jako výchozí stav

- Vycházíme z předpokladu, že většina lidí chce hrát fér.
- Systém není postavený na hledání zneužití, ale na spolupráci.
- Ochranné mechanismy přidáváme až tehdy, když jsou nutné, ne preventivně.

### Férová monetizace

- Platby nejsou past ani trik.
- Předplatné lze kdykoliv zrušit.
- Pokud má uživatel aktivní předplatné, ale dlouhodobě systém nepoužívá, **dáme mu to vědět a předplatné sami ukončíme**.
- Raději přijdeme o platbu než o důvěru.

### Žádné pay-to-win

- Peníze nekupují nadvládu nad ostatními.
- Placený obsah je vždy viditelný.
- Neplacený obsah může být pouze mírně potlačen (bez vizuálního zvýraznění), nikdy skrytý.
- Trh zůstává čitelný pro všechny.

### Respekt k uživateli

- Nepoužíváme manipulativní notifikace ani dark patterns.
- Neprodáváme pozornost, ale hodnotu.
- Nesbíráme data bez jasného a srozumitelného účelu.

#### Otevřenost a odpovědnost

- Pokud něco měníme, děláme to vědomě a transparentně.
- Tento kodex je závazek vůči uživatelům i vůči sobě samým.

---

<a id="terminologie"></a>

## Terminologie

> Krátký slovníček pojmů, ať se u toho nehádáme jak idioti.

### Životní cyklus inzerátu

- **Aktivní inzerát**: inzerát, u kterého běží standardní životní cyklus. Všechny běžné interakce jsou povolené (např. otevření obchodu, zapnutí bonusů jako Mark/Top/Top Maxxi, apod.).
- **Expirovaný inzerát**: praktický opak aktivního. Inzerát je možné si prohlédnout (včetně přímého odkazu), ale **žádná interakce není dovolená**, **kromě flagování**.
- **`expiresAt` (inzerát)**: výchozí čas „úmrtí“ inzerátu (konec standardního životního cyklu).
- **Kontinuální nabídka**: nemění `expiresAt` inzerátu. Umožní expirovanému inzerátu vrátit se mezi „živé“ (tj. *Expirovaný inzerát + Kontinuální nabídka → Aktivní inzerát*).
- **Defaultně schovaný**: inzerát se nikdy nemaže; „schovaný“ znamená jen to, že spadá pod standardní pravidla viditelnosti. V seznamu inzerátů se typicky neobjeví, přímý odkaz funguje, a na něm se vyhodnocuje citlivost.
- **Interakce s expirovaným inzerátem**: povolené je pouze **flagování** (aby nezbedníkům jejich sračky neprocházely).



---

<a id="ui"></a>

## UI

Sekce pro **hlavní části aplikace** a jejich smysl. Neřeší layout, komponenty ani UI detaily. Řeší, **proč ta část existuje** a jak se váže na mechaniky.

### Primární sekce

- **Feedy**: uložené zájmy (filtry) a vstupní brána do seznamu inzerátů.
- **Hledat**: zkratka pro „hledací feed“ (viz Mechaniky → Vyhledávání).
- **Drafty / Přidat inzerát**: bezpečná tvorba inzerátu bez rizika ztráty.
- **Zprávy**: UI pro transakce (obchod) a komunikaci.
- **Rozšíření**: správa a aktivace placených „feature“ (viz níže).
- **Obchod / Bonusy**: nákup balíčků goldíků, správa předplatného (aktivace/obnova/cancel) + denní bonus / dropy.
- **Profil / Nastavení**: preference uživatele (lokace, citlivost, nastavení feedů, atd.).

### Rozšíření (Features)

Rozšíření nejsou entity. Jsou to **zapínatelné schopnosti**, které staví nad stavebními kameny (Feed, inzerát, transakce, metriky).

- Rozšíření jsou **primární místo**, kam uživatel jde, když chce „mít něco zapnuté“ nebo se podívat, co má aktivní.
- Rozšíření zároveň fungují jako **inventář**:
  - kolik mám goldíků,
  - jaké mám aktivní passy a kdy končí,
  - co je dostupné přes předplatné (a už běží automaticky),
  - kolik mám „použití“ (tokenů) z předplatného / bonusů, pokud je mechanika používá.
- Akce v Rozšířeních:
  - **Zapnout**: standardně **zaplatí goldíky** a vytvoří příslušný pass (okamžitě začne platit). Pokud má uživatel k dané věci dostupné použití (token) z předplatného, může ho místo goldíků spotřebovat.
  - **Prodloužit / znovu zapnout**: opět zaplatí goldíky (nebo spotřebuje použití), pokud to mechanika dovoluje.
  - **Dobít goldíky / Předplatné**: deeplink do Obchodu.
- Rozšíření **nenahrazují kontextové akce**:
  - některé věci se zapínají přímo tam, kde dávají smysl (např. „Detail protistrany“ z inzerátu / zpráv, Mark/Top z inzerátu),
  - Rozšíření jsou „centrální panel“, ne povinná překážka.

---

<a id="zakladni-kameny"></a>

## Základní stavební kameny

> Tuto sekci lze považovat za kombinaci entit a definic, na kterých se staví vše ostatní v tomto dokumentu.

Tato část popisuje vše, co systém obsahuje a s čím v dalších sekcích počítá, na čem staví.

### Uživatel

> Core entita, na uživatele je vázané prakticky všechno - žádná zvláštní magie se tu nekoná.

- Držíme absolutně minimální data - máme jen **email**, nic jiného neukládáme
- Respektujeme absolutní anonymitu uživatelů, bezpečnost je řešena sledováním chování

### Inzeráty

> Odsud začíná veškerá interakce mezi uživateli. Veškeré informace žijí přímo na inzerátu, přestože inzerát samotný vzniká z Draftu.

- Souhrn atributů a galerie fotek reprezentující věc, kterou uživatel nabízí
- Atributy inzerátu:
  - **Obsah inzerátu:** title, description, pros/cons.
  - **Galerie:** uploady + jejich pořadí (galerie / fotky).
  - **Cena:** price + priceType (pevná vs. otevřená), currency.
  - **Parametry věci:** condition (škála), age (škála), delivery (osobně / post / package / other), warranty (warranty / no-warranty / custom).
  - **Kategorizace:** categoryId + napojení na kategorii.
  - **Lokalita:** locationId + lat/lon; umíme spočítat **vzdálenost (km)**, pokud je k dotazu dodaná poloha uživatele.
  - **Čas:** createdAt / updatedAt / expiresAt (včetně filtrování podle expiresAtBefore/After).
  - **Vazby na uživatele:** isFavourite, isIgnored, hasFlag, feedback (like/dislike), transactionId (existuje obchod pro daného uživatele).
  - **Event log nad inzerátem:** impression, view, ignore/unignore, flag/unflag, transaction, favourite/unfavourite, like/dislike.
  - **Filtrování (feed):** fulltext, title, priceMin/priceMax, conditionMin/Max/In, ageMin/Max/In, deliveryIn, warrantyIn, categoryId/categoryIdIn, currency/currencyIn, feedId/feedIdIn, my/withOwn, withIgnored, isFavourite, transaction, range (km).
  - **Řazení:** price, condition, age, createdAt, updatedAt, expiresAt, geo (vzdálenost).
### Draft

> Další klíčová funkce, která umožňuje postupnou tvorbu inzerátu beze strachu, že se nějaké údaje ztratí, pokud v průběhu uživatel aplikaci opustí. Spolu s tím spravujeme seznam Draftů, tzn. uživatel může snadno vytvářet inzeráty z již existujících nastavení (včetně uložených obrázků).

- Kopíruje atributy inzerátu
- Slouží jako vstupní bod pro tvorbu nového inzerátu - prvně vzniká Draft, z něj se pak publikuje inzerát

### Feed

> Klíčová vychytávka, kde si uživatel může nastavit různé oblasti zájmů, které mu pak aplikace sleduje a nabízí. To se hodí např. pokud chci mít nastavené hledání věcí domů (jedna adresa) a hledání třeba na chalupu (jiná adresa).

- Feed je uložené nastavení filtru nad inzeráty
- Smyslem je místo běžného katalogového vyplivnutí inzerátů poskytnout nástroj, kde si uživatel sám přesně vybere, co chce vidět a jak to chce vidět
- Feed si umí uložit lokalitu, tzn. různé feedy můžou mít různé řazení podle polohy (např. práce, chalupa, atd.)
- Feed je základní vstup do seznamu inzerátů
- Ve výchozím stavu se uživateli založí defaultní Feed se základním řazením bez dalších vlastností (tzn. vidí všechny inzeráty)

### Vyhledávání

> Vyhledávání není samostatná entita. Je to jen UI zkratka pro jeden speciální Feed (hledací feed).

- Vyhledávání === Feed: systémově je to pořád jen Feed dotaz nad inzeráty.
- Hledací feed se vytvoří automaticky (při prvním použití) a pak už je to jen uložený feed jako každý jiný.
### Transakce

> Jelikož je systém tvrdě anonymní, toto slouží jako most mezi prodejcem a kupujícím - můžou navzájem získat systémové informace, co jsou zač, než se rozhodnou k interakci. Po otevření transakce (viz. Mechaniky) pak vše probíhá jako chytřejší standardní chat

- Zastupuje interakci mezi uživateli, v systému se prezentuje jako „Zprávy“
- Každá transakce zároveň vytváří i vlákno zpráv s účastníky (ve výchozím stavu prodejce a kupující), které tak udává, kdo smí do transakce zasahovat
- Lifecycle (zavření, expirace, mazání) je definovaný v **Mechaniky → Obchod (transakce)**.

### Zprávy

> Zprávy jsou implementované v rámci duchu aplikace a umožňují předávání jak textových zpráv, tak strukturovaných dat, které je pak snadné spravovat, například promazat, když už nejsou třeba. Základní předpoklad ovšem je, že uživatel strukturovaná data bude používat

- Zprávy existují jako samostatná entita
- Systémově držíme **pouze email**; ve zprávách se osobní údaje mohou objevit **dobrovolně a za přímým účelem**, nejsou to system-wide data
- Mají strukturovaná data pro sdílení
	- Lokace (pomocí služby na vyhledávání adres)
	- Osobních údajů (jméno, telefon, email) - ukládá se **jen ve zprávách** jako strukturovaná data
	- Trasování balíčků
	- Obrázky
	- A text (běžné zprávy)
- Strukturovaná data mají vlastní tabulku, aby šla **snadno a cíleně mazat**

### Lokace

> Smyslem je mít autoritu na polohu místo ukládání buď pseudo adresy nebo stringu s random textem.

- Všechno, co využívá polohu, se odkazuje na lokaci
- Záznam v lokaci vzniká přes službu vyhledávání adres, která tak slouží jako autorita
- Poloha používá locale, což aktuálně může být bota a zároveň předmět budoucí úpravy
	- Teď podporujeme pouze češtinu, takže tento příběh bude na jindy

### Upload

> Jedno centrální místo na správu nahraných obrázků - jsou to metadata k souborům uložených na UGC v CDN.

- Nahrané soubory, hlavně pak fotky
- Veškeré obrázky (v inzerátu, hero feedu, ve zprávách) se ukládají zde
- Pokud je někde více obrázků (inzerát), používat se **Gallery** (což je kolekce Uploadů)

### Preference uživatele

> Nic moc zvláštního - věci, které si o sobě uživatel chce nastavit sám.

- Zde ukládáme implicitní nebo explicitní preference uživatele

### Hodnocení (ranking)

> Tohle neexistuje jako samostatná entita, ale jako atribut. Toto je pouze definice pro ujasnění, jak se má ranking používat.

- Veškeré ranky (hodnocení), dokud není řečeno jinak, podléhají škále **A-F**:
  - **A** = nejlepší
  - **F** = nejhorší
- Na pozadí se používá reverzní číselná škála:
  - **1 = F**
  - **6 = A**

---

<a id="mechaniky"></a>

## Mechaniky

### Feed, vyhledávání a seznam inzerátů

- **Seznam inzerátů** neexistuje jako standalone stránka: vždy je to výsledek Feed dotazu.
- Seznam funguje jako pseudo-infinite scroll (podobně jako sociální feedy).
- Tvrdý limit je **200 inzerátů** na jeden dotaz (praktičnost + výkon).

---

### Inzerát - expirace a interakce

- Expirované inzeráty lze stále zobrazit ve feedu, ale jen pokud si to uživatel **vědomě zapne** (explicitní nastavení).
- Pokud jiná mechanika neřekne jinak, expirovaný inzerát už **nedovolí interakci**.
- Smysl: historický kontext trhu (co se prodávalo, za kolik, jaké věci se objevují).

---

### Feed - výjimky řazení

- Feed je filtr nad inzeráty.
- Výjimky v řazení: **Top** a **Top Maxxi** přeskakují běžné inzeráty (řazení definované feedem).

---

### Vyhledávání

- Vyhledávání === Feed: je to UI zkratka pro jeden speciální feed („hledací feed“).
- UI flow: **Hledat** → nastavení hledacího feedu → seznam inzerátů.
- Hledací feed se **vytvoří vždycky**, i když tím uživatel dočasně překročí limit uložených feedů.
- Hledací feed se zobrazuje v seznamu feedů a **počítá se do limitů** feedů v balíčcích.
- Brány viditelnosti jsou stejné jako u feedu (ignor, citlivost, expirace, release window, atd.).

---

### Viditelnost inzerátu (seznam vs. přímý odkaz)

- „Viditelnost“ inzerátu se řeší na dvou místech:
  - **Seznam inzerátů (listing)**: inzerát buď projde filtrem a dostane se do seznamu nebo vypadne úplně ven.
  - **Přímý odkaz (detail)**: uživatel může otevřít detail i mimo seznam; tvrdé pravidlo je pouze citlivost (viz níže).
- **Release window (Early Access / Early Delivery)** je jen pravidlo pro seznam inzerátů:
  - přímý odkaz na čerstvý inzerát je dostupný vždy (systém nikoho nešikanuje tím, že „to nejde otevřít“).
- **Ignorování** je vlastní volba uživatele:
  - ignorované inzeráty se standardně do seznamu nedostanou (pokud si uživatel vědomě nezapne zobrazování ignorovaných),
  - přímý odkaz na ignorovaný inzerát detail normálně otevře („OK, nezajímá mě“).
- **Citlivost** musí vždy respektovat nastavení uživatele:
  - pokud uživatel nemá povolenou potřebnou úroveň citlivosti, server vrátí pro přímý odkaz **404** (aby to nešlo obcházet sdílením odkazů).
- **Expirovaný inzerát** je přes přímý odkaz pořád dostupný (read-only):
  - není důvod ho skrývat, jen nad ním už neběží běžné interakce / bonusy.
- Pokud inzerát **už není k dispozici pro nový obchod** (např. je prodaný), detail se otevře, ale místo tlačítka „Mám zájem“ se zobrazí status typu **„Inzerát již není dostupný“**.

---

### Limity feedů (po doběhnutí passu)

- Pokud uživatel má uložených více feedů, než dovoluje jeho aktuální limit (typicky po doběhnutí předplatného), feedy se **nemažou**.
- UI jen část z nich **skryje/disable** (upgrade nebo smazání uvolní slot).

---

### Zprávy - soukromí a strukturovaná data

- Strukturovaná data (lokace, osobní údaje, tracking, atd.) mají vlastní tabulky, aby šla **cíleně mazat**.
- Platforma **nečte ani nehodnotí** obsah textových zpráv. Pokud si tam lidi pošlou osobní údaje mimo strukturované zprávy, je to jejich rozhodnutí.

---

### Uploady - životnost

- Uploady nemají vlastní TTL. Životnost řídí „rodič“ (inzerát, zpráva, atd.), který upload používá.

---

### Preference uživatele - automatické zápisy

- Systém může do preferencí ukládat některé volby automaticky (např. přepnutí mezi sekcemi kupující/prodejce nebo implicitní poloha).
- Jsou to pořád jen preference uživatele (ne system-wide data); uživatel je může kdykoliv přepsat.

### Thumbs

- Palce se rozdávají na inzerátech a zobrazují se v metrikách inzerátu pro prodejce (jako poměr)
- Toto máme aktuálně interně jako "feedback", tzn. v aplikaci bude potřeba toto přejmenovat

### Karma

- Po dokončení transakce uživatelé mohou jeden druhému (prodejce/kupující) dát zpětnou vazbu
- Karma se propisuje do metrik obou rolí (prodávající/kupující)
- Sbírá se **"like"** / **"ok"** / **"dislike"**
- Karmu lze udělit kdykoli (právě jednou) v rámci transakce, zobrazí se jako běžné tlačítko v rámci konverzace

### Systém nahlašování - Inzeráty

- Systém má mechaniku nahlašování inzerátů (flagy).
- Pokud už uživatel označí nějaký inzerát, je to považováno za silný signál nechuti (nebo trollení).
- Flagy **nemají systémový efekt**: aplikace na ně automaticky nereaguje (nic se automaticky neskrývá, nemaže, nebanuje).
- Flagy jsou ale **kritický reputační signál pro uživatele**:
  - promítají se do metrik prodávajícího,
  - uživatel si z toho může vyvodit, že „něco smrdí“ (např. 80 % flagnutých inzerátů).
- Flagy zároveň slouží jako signál pro admina, aby našel věci, které smrdí, a řešil je (zatím i formou SQL dotazu / logiky mimo UI).
- Výpočet metrik:
  - Flagy se počítají z **user event logu**.
  - Okno pro výpočet je **posledních 90 dnů** (stejně jako ostatní metriky).
  - Poměr se počítá jako: **flagované vs. publikované inzeráty** (v okně).

### Systém nahlašování - Uživatelé

- V rámci transakce (v detailu inzerátu dostupného v rámci komunikace) je dostupné tlačítko nahlášení.
- Toto je tvrdá akce, kterou nelze vzít zpět.
- Stejně jako u inzerátů, k uživateli se zapíše flag a toto se promítá do jeho metrik.
- Flag uživatele je gated chováním systému:
  - lze ho udělit **jen v kontextu transakce**,
  - do transakce se obchodník dostane tím, že ji **přijme** (tj. obchodník si sám vybírá, do jakých interakcí vstoupí),
  - tím se eliminuje „pomsta z ulice“ bez reálné interakce.
- V rámci administrace systému toto bude také sledované.
- Neprobíhá žádné automatické vyhodnocení systémem (žádné auto-ban / auto-hide).
- Výpočet metrik:
  - počítá se z **user event logu**,
  - okno pro výpočet je **posledních 90 dnů**.

### Ban

- Starý dobrý ban - jako timestamp s trváním (life-time bude jen daleká budoucnost).
- Přiřazený ručně adminem aplikace, pokud dojde k tomu, že se někdo chová jako prase.
- Neexistují zatím pevná pravidla (policy); dokud nejsou zapsaná jako pravidla, nejsou implementovaná jako automatika.
- Typický důvod (příklad, ne zákon): zjevně křížově špatně označený citlivý/omezený obsah (např. „bouchačka mezi kočárkama“) nebo opakované porušování pravidel.
- V rámci rozjetého projektu je pak možné jej případně generovat i systémově, do MVP zatím nepatří.

### Metriky inzerátu

- **Visible**: odpálí se při scrollu po **0,5 s**.
- **Anti-topper**: u uživatelů s aktivním anti-topperem nahrazuje `visible` ve chvíli, kdy by se v listingu ukázal inzerát s **Mark/Top** (boost je potlačen).
- **View**: uživatel otevřel detail inzerátu a čumí do něj cca **2,5 s**.
- **Impression**: uživatel se při scrollování feedem u inzerátu pozastavil cca **1,6 s**.
- **Feedback**: sbíráme palec **nahoru / dolů**.
- **Ignorované**: počet ignorování inzerátu (uživatel si ho skryl).
- **Transakce**: počet vzniklých transakcí z akce **„Mám zájem“** (kolik lidí otevřelo obchod).

### Rozšířená data u inzerátu

- Přístup je řízen **passsem**: dokud má prodávající aktivní pass, vidí rozšířená data u **svých** inzerátů.
- Zobrazujeme jednoduchý dump čísel za dobu existence inzerátu (do expirace).
- Obsah rozšířených dat: **impression**, **view**, **feedback**, **ignorované**, **transakce**.
- **Anti-topper** se ukazuje jako poměr z celkového počtu: anti-topper / (visible + anti-topper).
- Data jsou **privátní**: vidí je jen vlastník inzerátu a jen jako placený benefit (Seller/Pro).

### Citlivost inzerátu

- Systém implementuje možnost označit inzerát jako **"běžný"** (default)/ **"pro dospělé"** / **"citlivé"** / **"omezené"**
- Označení je odstupňované podle závažnosti a navazuje na sebe
- Pointa je mít možnost schovat obsah, který není vhodný pro všechny a nastavit nástroje, jak se k takovému obsahu dostat

#### Přístup k citlivému obsahu (gating)

- Defaultně uživatel vidí pouze obsah úrovně **běžný**.
- Uživatel musí aktivně povolit, jakou úroveň citlivosti chce vidět:
  - vleze do **uživatelského profilu**,
  - potvrdí, že chce vidět (jakou) úroveň citlivosti (default je **běžný**).
  - volba se nastavuje **jednou** a drží se, dokud ji uživatel vědomě nezmění.
- Následně vleze do **nastavení feedu**, kde se mu podle zvolené úrovně zpřístupní filtr citlivosti.
- Teprve po tom má uživatel k obsahu volný přístup (žádný blur):
  - citlivost se v listingu i detailu zobrazuje jako **badge**,
  - jinak se obsah chová standardně.
- Pravidla citlivosti platí pro všechny formy získání inzerátu (Feed, Vyhledávání i přímý odkaz):
  - **běžný (common)** se zobrazí vždy
  - cokoliv nad běžný se zobrazí jen pokud to sedí na nastavení uživatele
  - ve feedu se citlivě nekompatibilní obsah **vůbec neobjeví**
  - při přímém linku / detailu se citlivost vyhodnotí a server vrací data **jen pokud sedí**, jinak **404**

#### Příklady úrovní

- **Běžný:**
	- Standardní inzerát, není v něm nic, co by veřejnost mělo nějak pobouřit nebo rozladit (třeba kočárek pro děti)
- **Pro dospělé:**
	- Běžný obsah vyžadující plnoletost, např. elektronické cigarety, opět nic, co by mělo někoho rozladit
	- Obecně sem může přijít i legální erotický obsah a jiné takové věci
- **Citlivé:**
	- Tady přituhuje - věci, které můžou někoho znervóznit nebo je potřeba používat hlavu, ale zákon stále nevyžaduje zvláštní oprávnění danou věc získat/používat - např. airsoftové zbraně/repliky
- **Omezené:**
	- Tady platí už omezení z hlediska zákona - např. skutečné zbraně
	- Systém explicitně nebude provádět kontrolu, nicméně pokud bude inzerát zjevně špatně označený, může následovat ruční ban
	- Uživatelé, kteří budou chtít obsah inzerátu získat už musí disponovat patřičnými oprávněními (např. zbrojní průkaz)

### Ignorování inzerátu

- V detailu inzerátu je dostupná akce **„Ignorovat“** (toggle).
- Cíl: uživatel si může explicitně odstranit inzerát z feedu (nechce, aby mu „lezl do feedu“).
- Ignor je **vázaný na konkrétní inzerát**:
  - Jakmile uživatel inzerát jednou ignoruje, **neuvidí ho v žádném seznamu** (Feed, Vyhledávání, listingy), dokud ignor nezruší.
  - Výjimka je vědomá volba uživatele: pokud si ve feedu zapne filtr `withIgnored`, ignorované inzeráty se můžou znovu zobrazit.
  - Pokud se uživatel k ignorovanému inzerátu dostane **přímým linkem**, zobrazí se normálně (uživatel jen ví, že ho ignoruje: „OK, nezajímá mě“).
- Ignor je toggle:
  - **Ignorovat** i **zrušit ignor** generuje event do **user event logu** (append-only).
- Metriky:
  - Ignorované eventy se počítají z event logu.
  - Prodávající to uvidí v placených metrikách inzerátu jako hodnota **„Ignorované“**.
  - Počítá se z **user event logu**.
- Vliv na skóre:
  - Aktuálně se **ignorování nepromítá do Score**.
- Do budoucna lze ignorování použít jako:
  - signál pro znevýhodnění inzerátu (pokud ho masově ignorují),
  - nebo signál na úrovni prodávajícího („asi prodává méně zajímavé věci“).

### Zvýraznění - Mark

> Pointa - **Mám něco, co bys měl vidět!**

- Nejlevnější a nejjednodušší forma označení inzerátu
- Zvýraznění platí jen do **expirace inzerátu** (po expiraci se vypne).
- Pouze zobrazí v seznamu inzerátů badge
- Anti-Topper potlačuje Mark
### Zvýraznění - Top

> Pointa - **Hej, tohle ti fakt chci ukázat dřív, než ostatní!**

- Přeskakuje běžné inzeráty (řazení)
- Zvýraznění platí jen do **expirace inzerátu** (po expiraci se vypne).
- Obsahuje badge v seznamu inzerátů
- Anti-Topper potlačuje Top
- Střední cena
### Zvýraznění - Top Maxxi

> Pointa - **Tohle fakt chci prodat a nezajímá mě, co si myslíš!**

- Přeskakuje běžné inzeráty (řazení)
- Zvýraznění platí jen do **expirace inzerátu** (po expiraci se vypne).
- Obsahuje badge v seznamu inzerátů
- Je imunní vůči Anti-Topperu
- Je nejdražší variantou zvýraznění 
### Anti-topper

- Premium uživatel platí za **klid** (redukci šumu v seznamu inzerátů), ne za dominanci.
- Platí pro **seznam inzerátů** (listing) bez ohledu na to, jak byl získán (Feed / Vyhledávání / uložený feed) – řeší prostě to, co se má v listingu ukázat.
- Potlačuje efekt **Mark** a **Top**, **Top Maxxi není ovlivněné**.
- Pokud má uživatel aktivní anti-topper a v listingu “jde kolem” inzerátu se zvýrazněním (Mark/Top), pošle se event **anti-topper** (nahrazuje `visible`), aby bylo vidět, kolikrát byl boost potlačen.
- Anti-topper neblokuje přímý přístup k inzerátu (např. přes odkaz) – jen ho nenechá protlačit v listingu.
- Plátci (prodávající) vidí u inzerátu rozšířená data: např. **palce**, **visible**, **anti-topper**, atd.

### Payback

- Payback je kompenzace prodávajícímu za to, že jeho **Mark/Top** byl potlačen uživateli s anti-topperem.
- Payback je samostatné oprávnění: **Payback = pass (exclusive)**, dostupný jen v balíčcích **Seller / Pro** (nelze zapnout za goldíky).
- Vyhodnocuje se **po expiraci inzerátu** (zvýraznění ani bonusy se po expiraci už neřeší).
- Výpočet:
  - počítá se poměr **anti-topper** vs. (**visible + anti-topper**) na úrovni **unikátních uživatelů** dle event logu,
  - vyplácí se krokově **25/50/75 %**.
- Refund se počítá z **aktuální jednotkové ceny v ceníku** v době vyhodnocení.
- Platí pro **Mark** a **Top**. **Top Maxxi** je imunní vůči anti-topperu → payback pro něj nevzniká.
- Payback vzniká jen pokud má prodávající v době vyhodnocení aktivní **Payback pass**.


### Early Access

- Nově publikovaný inzerát má **release window**: uživatelům bez Early Access se zobrazí až **+8h** po publikaci.
- Kupující s aktivním Early Access inzeráty vidí **hned**.
- Výhoda se **nestackuje**: maximum je vždy **+8h**.

### Early Delivery

- Early Delivery pro konkrétní inzerát **ruší release window** (zobrazí se hned i lidem bez Early Access).
- Early Delivery a Early Access se doplňují tak, aby se systém nikdy „neposouval“ víc než o **8h**.

### Multi-Category

- Multi-Category je **distribuce**: inzerát se zobrazí lidem, kteří sledují některou z vybraných kategorií.
- Inzerát se uživateli zobrazuje **právě jednou**, i když spadá do více kategorií.
- Vedle samotné kategorie přímo na inzerátu je možné uložit další dvě v rámci **Multi-Category**

---

### Detail protistrany

- Detail protistrany je placené oprávnění (pass) nad metrikami chování uživatelů.
- Vždy se vztahuje na protistranu:
  - kupující si může zobrazit detail prodávajícího,
  - prodávající si může zobrazit detail kupujícího,
  - uživatel se tímto nástrojem nikdy nedívá „sám na sebe“.
- Vstupní místa v UI:
  - v detailu inzerátu je dostupné tlačítko „Detail prodejce“ (rozhodnutí ještě před založením transakce),
  - v transakci (Zprávy) jsou dostupná tlačítka „Detail prodejce“ a „Detail kupujícího“ (podle role uživatele v transakci).
- Bez aktivního passu se **nezobrazují žádné metriky ani Score**.
  - po kliknutí se zobrazí status placeholder a jedno CTA na odemčení (zaplatit goldíky / spotřebovat použití, čímž vznikne pass),
  - s aktivním passem se zobrazí kompletní metriky včetně interního Score (A - F) (viz níže).
- Pass odemyká metriky globálně po dobu platnosti: uživatel může zobrazit detail kohokoliv (kromě sebe) bez dalších limitů.
- Token „Detail protistrany“ se spotřebuje a vytvoří stejnojmenný pass.

### Metriky - Prodávající

- Dostupnost:
  - metriky (včetně interního Score A - F) jsou dostupné pouze přes „Detail protistrany“,
  - bez aktivního passu se zobrazí jen status placeholder (žádná čísla, žádné Score).

- **Stáří účtu:** kdy je uživatel registrovaný (relativně).
- **Počet inzerátů:** kolik vytvořil inzerátů (context k aktivitě prodávajícího).
- **Reakce na nový obchod (pending -> open/rejected):**
  - reakční míra (kolik obchodů dostane reakci vs. kolik jich „dojede“ jinak),
  - rychlost reakce (median + p90).
- **Odmítání bez interakce:**
  - podíl obchodů, které prodávající odmítne bez konverzace,
  - rychlost odmítnutí (median + p90).
- **Resolved (vyřešeno):**
  - podíl obchodů, které prodávající označí jako resolved,
  - rychlost do resolved (median + p90).
- **Expirace:** podíl obchodů, které expirují bez zpráv / interakce.
- **Load (vytížení):** bucket low / medium / high (maskuje přesný počet obchodů; jen říká, jak je prodávající „busy“).
- **Activity (aktivita):** bucket low / medium / high (hrubý signál aktivity v systému).
- **Score (souhrnný rank):**
  - Score je agregovaný rank (A-F / 1-6), který shrnuje výše uvedené chování.
  - Score **nezohledňuje aktivní předplatné ani žádné jiné placené věci** (placení nemá vliv na výsledek).
  - Metriky se počítají za posledních **90 dnů**.
  - Nováček nemusí mít score (UI to přizná: „zatím nemáme dost dat“).
- **Flagy (inzeráty):**
  - Poměr publikovaných a flagnutých inzerátů (okno: **90 dnů**, z **user event logu**).
  - Zobrazení v detailu prodávajícího:
    - pokud je poměr flagnutých inzerátů **< 10 %** → zobrazí se text **„V pořádku“**
    - pokud je poměr flagnutých inzerátů **>= 10 %** → zobrazí se **procentuální hodnota**

### Metriky - Kupující

- Dostupnost:
  - metriky (včetně interního Score A - F) jsou dostupné pouze přes „Detail protistrany“,
  - bez aktivního passu se zobrazí jen status placeholder (žádná čísla, žádné Score).

- **Stáří účtu:** kdy je uživatel registrovaný (relativně).
- **Reaction (reakce na otevřený obchod):**
  - reakční míra,
  - rychlost reakce (median + p90).
- **Closer (instant closed):**
  - podíl obchodů, které kupující rychle zavře (otevře a hned „killne“ bez interakce),
  - rychlost zavření (median + p90).
- **Decision (success/closed):** podíl obchodů, kde kupující dává finální rozhodnutí (success/closed).
- **Expired:** podíl obchodů, které expirují bez zpráv / interakce.
- **Load (vytížení):** bucket low / medium / high.
- **Activity (aktivita):** bucket low / medium / high.
- **Score (souhrnný rank):**
  - Score je agregovaný rank (A-F / 1-6), který shrnuje výše uvedené chování.
  - Score **nezohledňuje aktivní předplatné ani žádné jiné placené věci** (placení nemá vliv na výsledek).
  - Metriky se počítají za posledních **90 dnů**.
  - Nováček nemusí mít score (UI to přizná: „zatím nemáme dost dat“).

### Obchod (transakce)

- Obchod vzniká, když kupující v detailu inzerátu klikne **„Mám zájem“** – tím vznikne nová transakce ve stavu **pending**.
- Z pohledu uživatelů se transakce prezentuje jako **„Zprávy“**.
- **Anti-spam core hodnota:** dokud prodávající transakci nepřijme, **neexistuje žádná uživatelská interakce** (žádné zprávy, žádná strukturovaná data, žádné „je to aktuální?“).
  - Zprávy se otevřou až ve chvíli, kdy prodávající obchod přijme (**open**).
- Stavový flow:
  - **pending**: kupující otevřel obchod („Mám zájem“).
  - **open**: prodávající obchod přijme.
  - **rejected**: prodávající obchod odmítne.
  - **resolved**: prodávající označí obchod jako vyřešený (z jeho pohledu hotovo – např. předáno/odesláno).
  - **sold**: systémový finální stav pro ostatní transakce na stejný inzerát (viz níže).
  - **expired**: systémový stav po vypršení bez aktivity (viz níže).
  - **closed / success**: finální stavy po akci kupujícího (viz níže).
- Akce kupujícího (kdykoliv během aktivní transakce):
  - **close** → stav **closed** (neutrální „zavřeno“).
  - **success** → stav **success** (pozitivní „yupí“).
  - `closed` **není neúspěch** – v obou případech chceme, aby to kupující odklikával (kvůli metrikám a uzavření běhu).
  - Pokud kupující zavírá okamžitě bez interakce (typicky hned po `open`), promítá se to negativně do jeho metrik jako **Closer**.
- Akce prodávajícího:
  - Prodávající může transakci **přijmout (open)**, **odmítnout (rejected)** a po průběhu označit jako **resolved**.
  - Prodávající transakci **nikdy neukončuje** do `closed/success` – finální slovo má vždy kupující.
- Pozn.: `close/success` je dostupné kdykoliv během běhu transakce, dokud není transakce v **systémově finálním** stavu (`rejected/expired/sold`).
- Sold (automatické ukončení ostatních zájemců):
  - Jakmile prodávající u jedné transakce klikne **resolved**, systém na pozadí:
    - ponechá tuto transakci běžet dál standardně (kupující následně dá **success/close**),
    - **všechny ostatní transakce** na stejný inzerát přepne do stavu **sold** a vloží jim **systémovou zprávu**, že je prodáno.
  - `sold` je **finální** stav (read-only). Nelze nad ním spouštět `dispute` ani dělat další uživatelské akce.
- Expirace (časový úklid + dopad do metrik):
  - Transakce expiruje po **3 dnech bez aktivity**.
  - `expireAt` posouvá **jakákoli akce** v transakci (včetně `dispute` a jakýchkoli zpráv / structured messages po otevření).
  - Po expiraci se transakce přepne do stavu **expired** automaticky (běží pravidelný systémový úklid).
  - Po zavření transakce (user `closed/success`, `rejected`, `sold`, `expired`) se odstraní veškerá **strukturovaná data** ze zpráv (polohy, osobní údaje, apod.); **text a obrázky zůstávají**.
  - Po **3 měsících** se transakce smaže kompletně z databáze (hard delete)

### Dispute

- Dispute je **hint**, že „něco nesedí a ještě nekončíme“. Není to eskalace ani arbitráž systému.
- Dispute může vzniknout **až po `resolved`**.
- Otevřít dispute může **kupující i prodávající**.
- Dispute:
  - promítá se do metrik **obou stran** (protože ho může otevřít kdokoliv),
  - **nemá vliv na karmu** (karma je čistě volba uživatele),
  - je to běžná akce v rámci transakce, takže **posouvá `expireAt`** dle standardních pravidel.
- Otevření dispute vrací transakci do „běžného režimu“: pokračuje se v konverzaci a řešení, dokud kupující neodklikne finální **success/close**.

### Systémová policie

- Aplikace dává nástroje uživatelům k rozhodování
- Systém sám o sobě aktivně nic nehodnotí ani nespouští autonomní akce
- Dostupná je pouze základní ochrana rate-limit a DDoS na úrovni hostingu

### Kontinuální nabídka

- Kontinuální nabídka je mechanika, která umožní **prodloužit život inzerátu** a vrátit ho zpět do běžného režimu (typicky pro kontinuální prodej / dotazy typu „kdy bude další várka/vrh?“).
- Kontinuální nabídka funguje přes **token → pass**:
  - **Token** pouze **vygeneruje stejnojmenný pass**.
  - **Pass** je to, co aktivuje chování mechaniky.
- Aktivace:
  - Aktivuje ji **vlastník inzerátu**.
  - Lze ji aktivovat **kdykoliv**:
    - Pokud je inzerát ještě aktivní (neexpirovaný), prodloužení se **naváže na jeho expiraci** (uživatel nepřichází o čas).
    - Pokud je inzerát už expirovaný, prodloužení začne **okamžitě**.
- Trvání:
  - Pass trvá **1 měsíc**.
  - Prodloužení se **nestackuje** (nenasčítává se dopředu).
  - Prodávající může prodlužovat opakovaně (vždy spotřebuje token a vytvoří nový pass na 1 měsíc).
- Chování inzerátu během aktivního passu:
  - Inzerát funguje **jako běžný aktivní inzerát** (vrací se do standardního feedu, žádné speciální filtry nejsou potřeba).
  - Obchody/transakce fungují **stejně jako u běžného inzerátu**.
  - Po vypršení passu se inzerát vrací zpět do režimu **expirovaný** (defaultně schovaný), pokud není znovu prodloužen.
- Metriky:
  - Inzerát se chová normálně, takže metriky (včetně **Transakce**) se počítají standardně.

---

<a id="predplatne"></a>

## Předplatné

### Zkušební Pro zdarma pro nové uživatele

- Každý nový uživatel dostane při registraci **Pro balíček zdarma na 1 měsíc** (plná funkcionalita).
- Trial je **automaticky aktivní** (uživatel nic nezapíná) a po doběhnutí se **sám vypne**.
- Trial je **jen jednou na účet** (neřešíme tu „jak“; je to pravidlo produktu).
- Smysl: uživatel si vyzkouší aplikaci v plné síle. Po vypršení to bolí, takže má motivaci si věci koupit.

---

### Bonusy předplatného (měsíční příděly)

- Každé předplatné při měsíčním renew přidělí své bonusy **vždy**, bez ohledu na to, kolik už jich uživatel má.
- Cíl: uživatel si předplatné platí, takže systém se nesnaží “šetřit” tím, že by příděly zastavoval kvůli tomu, že má uživatel zásobu.
- Tokeny jsou skladovatelné a neexpirují; expiruje jen pass (viz **Tokeny & passy**).
- Neexistuje downgrade: jediná změna předplatného je **cancel**.
- Cancel znamená: předplatné se jen **neobnoví**. Všechny passy, které vznikly, **doběhnou do konce zaplaceného období** a pak zaniknou.
- Pass je samostatný záznam v tabulce pass a běží čistě podle svého `expiresAt` (nic se „neruší“ předčasně).
- Po vypršení passů se systém vrátí do defaultního režimu (např. anti-topper přestane platit, feed limit se sníží, atd.).

### Balíček Kupující (119 Kč / měsíc)

> **Co kupuju:** Nástroje pro kupujícího. Typicky chci dřív vidět, rychleji kupovat a méně se brodit v odpadu.

- **Přidělené goldíky:** 300 / měsíc.
- **Early Access (token, 5×)**
- **Limit uložených feedů (pass):** default 3 → Buyer 5.
- **Anti-topper (token, 5×)**

### Balíček Prodejce (229 Kč / měsíc)

> **Co kupuju:** Celkový toolset pro efektivní distribuci a zviditelnění inzerátu (bez pay-to-win), plus privátní metriky.

- **Přidělené goldíky:** 300 / měsíc.
- **Early Delivery (token, 5×)**
- **Photo Count (pass):** navýšení počtu fotek z default 3 → 5.
- **Mark (token, 5×)**
- **Top (token, 3×)**
- **Top Maxxi (token, 1×)**
- **Multi-Category (token, 3×)**
- **Payback (pass)**
- **Rozšířená data u inzerátu (pass)**
- **Kontinuální nabídka (token, 3×)**

### Balíček Pro (499 Kč / měsíc)

> **Co kupuju:** Všechno (Buyer + Seller) a navíc „plný klid“ a nejvyšší komfort. Jsem na obou stranách a chci dostat z aplikace maximum s minimem šumu.

- Obsahuje **Buyer Package + Seller Package**.
- **Přidělené goldíky:** 600 / měsíc.
- **Anti-topper (pass)**
- **Early Access (pass)**
- **Limit uložených feedů (pass):** 10.
- **Photo count (pass):** 10.
- **Multi-Category (pass)**
- **Detail protistrany (pass)**
- **Payback (pass)**
- **Rozšířená data u inzerátu (pass)**
- **Kontinuální nabídka (token, 5×)**

<a id="goldiky"></a>

## Goldíky

- Goldík je **trvalá interní měna** (interpretace kreditu / reálných peněz).
- Nelze jít do mínusu.
- Veškeré „peněžní“ operace jsou transakční: **nikdy se nesmí stát, že se hodnota odečte bez dodání protihodnoty**.
- **Interní kurz:** **1 CZK ≈ 2 goldíky** (může se v čase měnit).
- Goldíky lze získat:
  - skrze předplatné (všechny balíčky je obsahují),
  - skrze používání aplikace (bonusy),
  - **nákupem balíčků goldíků**.
- Goldíky jsou vidět hlavně ve dvou místech:
  - **Rozšíření** (rychlý přehled + aktivní passy / tokeny)
  - **Obchod / Bonusy** (nákup balíčků goldíků a správa předplatného)
- Uživatel má k dispozici **historii transakcí** (přírůstky/úbytky).
- Všechny pohyby nad inventářem probíhají **atomicky a transakčně** (fail = rollback)
- Aktivace tokenu i nákup/spotřeba je vždy jedna DB transakce: buď proběhne celý efekt (např. Top se opravdu nasadí), nebo se nestane nic (token/goldíky se nespálí).
- Refundy za „málo shlédnutí“ zatím neděláme. Pokud se někdy přidá kompenzace za slabý výkon, bude to samostatná mechanika s jasně definovaným prahem (až bude potřeba).

### Nákupní balíčky goldíků

| Balíček    | Množství goldíků | Cena (CZK) |
| ---------- | ---------------- | ---------- |
| Na zkoušku | 300              | 149        |
| Balík      | 600              | 299        |
| Do zásoby  | 1200             | 599        |

### Bonusy za používání

> **Proč máme bonusy?** Chceme uživatele odměnit za drobnou práci, kterou mají s dobrovolnou interakcí s aplikací, jelikož data, která uživatelé pak generují, se nabízejí dál a bez nich hodně systémových metrik nedává úplně smysl.
> 
> Dalším důvodem pak je trošku oživit a podpořit retenci uživatelů, přestože nic moc vysloveně nechtějí, dojdou si pro svůj goldík.

- Bonusy nejsou „odměna za aktivitu“ ani za hygienu inzerátů. Hygiena je základní očekávané chování.
- Bonusy se dávají **jen po odkliknutí `resolved` prodávajícím**.
  - Dokud prodávající nedá `resolved`, žádný bonus za transakci nevzniká.
  - Tím je minimalizovaný abuse (otevírání a zavírání obchodů bez reálného průběhu).
- Bonusy se dropují i ve feedu: **náhodně (RNG)** s relativně nízkým dropem „mezi inzeráty“ (má to být příjemné překvapení, ne ekonomický model).
- V „Bonusy“ (obchod) je **denní drop** (aktuálně: 10 goldíků).
- Bonusy se nemusí vyplatit, pokud systém vyhodnotí zjevné zneužití nebo anomální chování.

<a id="tokeny-a-passy"></a>

## Tokeny & passy

> **K čemu je máme?** Centrální systém řízení oprávnění jak nad uživateli (např. aktivní pass), tak i jinými objekty systému (např. listing) a možnost přidělit dočasné vlastnosti (zpravidla passem, jelikož může mít časové omezení).

- **Token** = jednorázová akce (spotřebuje se). **Token nikdy neexpiruje** (můžeš ho držet neomezeně dlouho).
- **Pass** = stav oprávnění (může mít konec platnosti, nebo být bez konce).
- Když někde mluvíme o **platnosti**, myslíme tím vždycky **platnost passu**, ne tokenu.
- Pokud je **pass uveden bez doby**, dědí dobu z běhu předplatného (vznik/renew subu = nový pass na dobu trvání subu).
- V UI se to nepředvádí jako „token/pass“: uživatel vidí akce typu **„Odemknout +2 fotky?“** apod.; detail (včetně pasů) je v **Rozšířeních**.
- **Obchod** nabízí jen **balíčky goldíků** a **hlavní předplatné**.
- Rozšíření se standardně **zapínají za goldíky** (vytvoří se pass). Pokud má uživatel dostupné použití (token) z předplatného / bonusů, může ho místo goldíků spotřebovat.
- Při zámcích placených věcí používáme pattern: **Status** (proč to stojí) → **jedno CTA** (zapnout za goldíky / spotřebovat použití).
- Goldíky slouží primárně k **zapínání Rozšíření** (aktivace / prodloužení) a dalším věcem v systému.
- Některá rozšíření:
  - jsou **zapnutelná za goldíky**,
  - nebo jsou **exclusive pro předplatné**.
- Tabulka níž popisuje položky (primárně) pro **Rozšíření**; pokud něco zapnout nejde, má v ceně **exclusive**.
- Řádky typu **Pass** v tabulce jsou buď **exclusive** (jen benefit předplatného), nebo popisují **co token vytvoří** po aktivaci.
- `exclusive` = dostupné jen přes předplatné / benefit, nelze zapnout za goldíky.
- Cenotvorba (pravidlo): goldíky jsou „univerzální klíč“ pro zapnutí rozšíření. Tokeny jsou hlavně **použití z předplatného / bonusů** (výhoda pro platící).
- Cena v tabulce je cena **zapnutí v Rozšířeních** (za goldíky), pokud uživatel nemá dostupné použití z předplatného.
- `exclusive` je v MVP opravdu exclusive: **nejde dokoupit** ani za goldíky.
- Předplatné může dávat:
  - přímé passy,
  - usage tokeny,
  - pravidelný přísun goldíků.

Pozn.: **Token** = jednorázové použití (typicky z předplatného / bonusů) a **neexpiruje**. **Pass** = okamžitý stav (zapne se hned) a může mít platnost.

Pozn.: **Jednotková cena** u balíčků (např. „5× za 20“) znamená cenu za jedno použití (20 / 5 = 4).

| Co                  | Typ (token / pass) | Kolik / na jak dlouho                                            | Cena      |
| ------------------- | ------------------ | ---------------------------------------------------------------- | --------- |
| Early Access        | Token              | 1× použití (vygeneruje pass: +8h náskok na **7 dnů**)            | 80        |
| Early Delivery      | Token              | 1× použití (ruší release window pro konkrétní inzerát)           | 40        |
| Anti-topper         | Token              | 1× použití (vygeneruje pass na **7 dnů**)                        | 40        |
| Mark                | Token              | 5× použití (každé vygeneruje pass na **7 dnů**)                  | 20        |
| Top                 | Token              | 3× použití (každé vygeneruje pass; bump při aktivaci)            | 50        |
| Top Maxxi           | Token              | 1× použití (vygeneruje pass na **7 dnů**)                        | 50        |
| Multi-Category      | Token              | 1× použití (1 + 2 kategorie)                                     | 75        |
| Detail protistrany  | Token              | 5× použití (každé vygeneruje pass na **7 dnů**)                  | 50        |
| Photo Count         | Token              | 1× použití (vygeneruje pass: **1 měsíc**, +2 fotky)              | 75        |
| Payback             | Pass               | po dobu předplatného                                             | exclusive |
| Multi-Category      | Pass               | po dobu předplatného                                             | exclusive |
| Detail protistrany  | Pass               | po dobu předplatného (balíček Pro)                               | exclusive |
| Rozšířená data u inzerátu | Pass         | po dobu předplatného                                             | exclusive |
| Kontinuální nabídka | Token              | 1× použití (vygeneruje pass)                                     | exclusive |
| Kontinuální nabídka | Pass               | 1 měsíc (inzerát funguje jako běžný aktivní)                     | exclusive |



<a id="uvedeni-na-trh"></a>

## Uvedení na trh (Go-to-market)

### Fázování startu

Start projektu je **vědomě rozdělen do dvou paralelních, ale sekvenčních fází**, s cílem snížit riziko prázdna a zvýšit šanci na první smysluplné transakce.

### Fáze 1: Online komunitní start (Discord)

> **Proč?** První vlna na Discordu nám má zajistit relativně snadný nástup úvodních uživatelů, včetně určité validace produktu a jeho včasné otestování.

**Primární starting-ground.**

- První spuštění proběhne **v uzavřených tematických komunitách (vapování)**.
- Jasně definovaná kategorie produktů.
- Vysoká tematická shoda → **nižší tření při startu**.
- Vyšší pravděpodobnost:
  - prvních inzerátů,
  - prvních transakcí,
  - prvních referencí.
- Komunitní efekt:
  - lidé jsou **více tolerantní k nedokonalostem**,
  - vyšší ochota být „u zrodu“ a dávat feedback.

Účel této fáze:

- Ověřit chování uživatelů v prostředí s vysokou důvěrou.
- Otestovat monetizaci **bez regionálního šumu**.
- Vytvořit první **reálnou paměť trhu**.

### Fáze 2: Regionální expanze (Karlovy Vary + Ostrov + Sokolov)

> **Proč?** Tohle je náš cílový trh - jedná se o už docela tuhý start, kde nabereme hlavní část uživatelů a když bude vše v pořádku, bude to také finální (monetizační) fáze, jelikož zasponzoruje vývoj.

- Navazuje na stabilní základ z online komunity.
- Billboardy už **nevedou do prázdna**, ale do živého systému.
- Komunikace může být přímější a sebevědomější.

**Distribuce:**

- Billboardy: bílé pozadí, žádné obrázky, krátký tvrdý text + URL.
- Word-of-mouth jako hlavní akcelerační kanál.

<a id="retence"></a>

## Retence a paměť trhu

Zbav-se.me **nepracuje s krátkodobou pozorností**, ale s pamětí trhu. Inzeráty po expiraci **nezmizí**, ale jsou **defaultně schované** a lze je zobrazit filtrem. Díky tomu tvoří historický kontext: ceny, neúspěšné nabídky, chování účastníků.

Důsledky tohoto přístupu:

- Hodnota platformy **roste v čase**, i bez přísunu nového obsahu.
- Uživatelé se vracejí nejen kvůli novým inzerátům, ale kvůli **orientaci v trhu**.
- MAU může růst rychleji než nové registrace.

**Očekávaný vývoj poměru registrace → MAU:**

- Měsíc 1-2: ~20-30 % (zvědavost, nízký kontext)
- Měsíc 3-4: ~35-45 % (vznikající historie)
- Měsíc 5-7: ~50-60 % (paměť trhu má hodnotu)
- Po saturaci regionu: **60-70 %** (platforma jako referenční bod)

> Retence zde není tlačena notifikacemi ani návykovostí, ale **užitkem z kontextu**. To vytváří menší, ale stabilnější a důvěryhodnější MAU.

<a id="odhady"></a>

## Odhady monetizace a růstu

### Odhad monetizace - baseline předplatného (konzervativní)

**Předpoklad:** start z nuly, konzervativní očekávání trhu.
**Celková konverze:** ~**3 % MAU**.

| Balíček        | Podíl MAU | Cena (Kč / měsíc) | ARPU příspěvek   |
| -------------- | --------- | ----------------- | ---------------- |
| Buyer Package  | 0,5 %     | 119               | 0,60 Kč          |
| Seller Package | 2,0 %     | 229               | 4,58 Kč          |
| Pro Package    | 0,5 %     | 499               | 2,50 Kč          |
| **Celkem**     | **3,0 %** |                   | **7,68 Kč ARPU** |

### Odhad monetizace - extras baseline (cash-in model)

Tento scénář modeluje **jednorázové nákupy extras** skrze **balíčky goldíků**.

**Předpoklady:**

- MAU: **10 000**
- Podíl uživatelů, kteří si koupí goldíky: **10 % MAU**

| Metrika             | Hodnota          |
| ------------------- | ---------------- |
| Počet nakupujících  | 1 000            |
| Průměrná útrata     | ~210 Kč         |
| **Měsíční revenue** | **~210 000 Kč** |
| **ARPU (cash-in)**  | **~21,0 Kč**    |

### Odhad monetizace - kombinovaný scénář (konzervativní)

| Zdroj        | ARPU (Kč) | Měsíční revenue  |
| ------------ | --------- | ---------------- |
| Předplatné   | 7,68      | ~76 800 Kč      |
| Extras       | 21,0      | ~210 000 Kč     |
| **Celkem**   | **28,68** | **~286 800 Kč** |

### Odhad náběhu MAU a revenue (sekvenční start)

| Měsíc | Zdroj MAU        | Odhad MAU | Odhad revenue |
| ----- | ---------------- | --------- | ------------- |
| 1     | Discord          | 60        | ~1 700 Kč    |
| 2     | Discord          | 90        | ~2 600 Kč    |
| 3     | Discord          | 120       | ~3 400 Kč    |
| 4     | Discord + region | 700       | ~20 100 Kč   |
| 5     | Discord + region | 1 600     | ~45 900 Kč   |
| 6     | Discord + region | 3 200     | ~91 800 Kč   |
| 7     | Discord + region | 5 000     | ~143 400 Kč  |
| 8     | Discord + region | 7 500     | ~215 100 Kč  |
| 9     | Discord + region | 9 500     | ~272 500 Kč  |
| 10    | Discord + region | 10 500    | ~301 100 Kč  |
| 11+   | Discord + region | 11-12k    | ~315-345k Kč |

### Odhad monetizace - online komunitní kanál (Discord)

| Metrika         | Hodnota          |
| --------------- | ---------------- |
| Odhad MAU       | 90-120           |
| Podíl platících | 15-20 %          |
| Měsíční revenue | ~2 200-3 700 Kč |
| ARPU            | ~20-30 Kč       |
