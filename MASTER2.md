# Master

Single source of truth projektu. _**Co tu není, neexistuje**_.

## Document Rules

- Tenhle Master drží **mé koncepty, pravidla a produktová rozhodnutí**.
- **Žádný kód, DB schémata ani implementační detaily.**
- Když něco doplňuji, doplňuji to jako **pravidlo** (co a proč), ne jako „jak to přesně nakóduji“.
- **Ich-forma:** Dokument píšu v **první osobě jednotného čísla**. Jsem autor a držím za projekt tvrdou osobní odpovědnost. Co slíbím, to platí.

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

- **Core myšlenka:** „**Prodávám, neojebávám.**“
- Nestavím další bazar. Tvořím **systém důvěry a komunity**.
- Mým cílem je: **klid, důvěra, kompetence uživatele**.
- Monetizaci stavím na **hodnotě** (nástroje), ne na tlaku (reklama).
- Stavím na důvěře mezi **mnou (platformou)** a **uživateli** pro zajištění mentálního komfortu.

### Tone of Voice

- Onboarding bez pozlátek: „**Klikej. Zkoumej. Není tu co posrat.**“
- Neučím, nekomentuji, neotravuji.
- **Předpokládám IQ uživatelů alespoň 80** (nadneseně – mé UI je tak jasné, že nepotřebuje vysvětlivky).
- **Mluvím přímo:**
  - Aplikace uživateli tyká.
  - Používám **mužský rod** jako neutrální default (např. „Odmítl jsi“, „Máš novou zprávu“).
  - Vyhýbám se pasivu a úředničině ("bylo odmítnuto"). Mluvím krátce a lidsky.

### Produktové cíle

- Chci vyvolat pocit **„teplého obýváku“** místo reklamního cirkusu.
- **Paměťová stopa:** bylo to klidné, rychlé, fungovalo to.
- Konzistence je pro mě víc než jedna killer funkce.
- **Kontrast s konkurencí** má být citelný (návrat ke konkurenci má „bolet“).

### UX principy

- **Nulová tolerance nápovědy:** „**Pokud to potřebuje hint, udělal jsem to špatně.**“
  - Žádné tooltipy, žádné `(?)` ikony, žádné vysvětlující bubliny.
  - UI musí být krystalicky jasné samo o sobě. Pokud uživatel neví, co má dělat, je chyba v mém designu, ne v absenci nápovědy.
- **Konzistence > chytrost.**
- **Empty state** = status → vysvětlení → **jedno** CTA.
- **Prázdno je záměr** (nižší kognitivní zátěž).
- Status může být emoční, CTA musí být mechanické a jasné.

### Komunikace a transparentnost

- **Source Available:** Zdrojové kódy zpřístupňuji veřejně k auditu bezpečnosti a fair-play, ale chráním je licencí proti komerčnímu zneužití či klonování.
- **Transparentní finance:** Na domovské stránce uvádím odkaz na transparentní bankovní účet projektu.
- **Vývoj:** Na domovské stránce ukazuji kalendář aktivity vývoje (Github-like) a dynamickou timeline (první skokani, milníky, hlášky o stavu trhu).
- **Soukromí (Tracking):**
  - **Žádné externí šmírování:** Nepoužívám UTM, cookies třetích stran, Google Analytics ani Facebook Pixel.
  - **Interní telemetrie:** Měřím a ukládám pouze to, co je nutné pro funkci produktu a výpočet reputačních metrik (User Event Log). Data neopouští mou infrastrukturu.
- **Podpora:**
  - Discord server (komunita) + e-mail.
  - Sekce **„Zpětná vazba“** přímo v aplikaci (interní mechanismus kontaktu).

---

<a id="konkurenceschopnost"></a>
## Konkurenceschopnost

> Mé subjektivní výhody a argumenty. Checklist, proč do toho jdu.

### Co umím líp

- **Klid místo cirkusu:** Minimum vizuálního šumu, žádné otravné UX. Aplikace pomáhá uzavřít obchod, ne krást čas.
- **Soukromí jako default:** Držím jen minimum dat (email). Nejsi pro mě produkt.
- **Anti-spam obchod:** Dokud prodávající nepřijme transakci (stav `pending` → `open`), nedovolím kupujícímu psát zprávy ani posílat data.
- **Důvěra z chování:** Reputaci počítám z tvrdých metrik (reakce, expirace, closer, resolved, flagy), ne z bio a „věř mi bro“ profilů.
- **Feed jako hlavní produkt:** Vyhledávání beru jen jako zkratku pro feed. Uživatel si definuje zájem a já mu ho servíruji.
- **Paměť trhu:** Expirované inzeráty nemažu (jsou dohledatelné). Tvořím historii cen a kontextu.
- **Férová ekonomika:** Neberu procenta z prodeje. Nechám si zaplatit za nástroje (rozšíření) a předplatné.
- **Bez pay-to-win:** Placené věci přiznávám a jsou vidět. Neplacený obsah můžu mírně potlačit (řazení), ale nikdy ho neskrývám.
- **Deterministické brány:** Citlivost obsahu přísně řídím nastavením uživatele.

### V čem je má slabina (a proč s tím počítám)

- **Prázdno na startu:** Bez obsahu je marketplace mrtvý. Řeším to fázovaným startem (komunity → region).
- **„Levný drobnosti“:** Prodej věcí za pár korun je u mě složitější (vyžaduji Draft, interakci). Mířím na situace, kde se vyplatí mít klid a filtr.

### Co vědomě nedělám

- **Agresivní paid reach:** Netlačím věci do obličeje jen proto, že někdo zaplatil. Priorita je pro mě čitelnost trhu.
- **Videa u inzerátů:** Ne. Nechci tu zbytečný šum, infra peklo a riziko zneužití.

---

<a id="kodex"></a>
## Kodex

> Má vědomá rozhodnutí a kontrakt mezi mnou a uživateli. Tyto principy držím veřejně dostupné.

### Důvěra jako výchozí stav

- Vycházím z předpokladu, že většina lidí chce hrát fér.
- Ochranné mechanismy přidávám až tehdy, když jsou nutné, ne preventivně.

### Férová monetizace a neaktivita

- Platby nejsou past. Předplatné umožňuji kdykoliv zrušit.
- **Automatické ukončení při neaktivitě:**
  - Pokud uživatel systém dlouhodobě nepoužívá, nechci jeho peníze za nic.
  - **Neaktivita** = žádný záznam v User Event Logu (uživatel aplikaci ani neotevřel).
  - Po **1. měsíci** neaktivity: Pošlu e-mail s připomínkou.
  - Po **2. měsíci** neaktivity: Okamžitě ruším předplatné (zastavím platby).
- Raději přijdu o platbu než o důvěru.

### Žádné pay-to-win

- Peníze nekupují nadvládu. Placený obsah zobrazuji viditelně.
- Trh nechávám čitelný pro všechny (neplatiče nelze skrýt, jen přeskočit v řazení).

### Respekt k uživateli

- Nepoužívám manipulativní notifikace ani dark patterns.
- Nesbírám data bez jasného účelu.

### Otevřenost a odpovědnost

- Pokud něco měním, dávám to vědět **předem a konkrétně**:
  - **Kanály:** E-mail, in-app notifikace, commit log ve veřejném repozitáři.
  - **Kurz CZK ↔ Goldík** měním nejdřív **kvartálně**.
  
<a id="terminologie"></a>
## Terminologie

> Slovníček pojmů, ať se u toho nehádáme jak idioti.

### Feed vs. Seznam
- **Feed (technicky):** Uložené nastavení filtru nad inzeráty (kategorie, lokace, cena...).
- **Seznam (UI):** Uživatelský název pro Feed. V aplikaci mluvím o „Mých seznamech“.
- **Inzeráty (UI tlačítko):** Chytrý odkaz, který uživatele hodí do posledního navštíveného seznamu (nebo defaultního).

### Typy Feedu
- `user` – **Uživatelský seznam**. Vědomá volba uživatele (uloženo v „Moje seznamy“). **Tento typ se počítá do limitu počtu feedů.**
- `search` – **Hledací kontext**. Interní stav pro stránku Hledat (v seznamu „Moje seznamy“ ho nezobrazuji). **Tento typ se nepočítá do limitu počtu feedů.**

### Typy obsahu (Citlivost)
- **Běžný:** Standardní inzerát pro všechny (kočárek, telefon).
- **Pro dospělé:** Legální, ale vyžaduje plnoletost (alkohol, vaping).
- **Citlivé:** Vyžaduje opatrnost a rozum (airsoft, nože).
- **Omezené:** Regulováno zákonem (skutečné zbraně).

### Stavy inzerátu
- **Live (Aktivní):** Inzerát je publikovaný, neexpirovaný a dostupný k prodeji. Počítá se do limitů.
- **Expired (Expirovaný):** Inzerát vypršel (`expiresAt`). Už ho nelze najít v běžném seznamu, interakce jsou zakázané (kromě flagování).
- **Sold (Prodaný):** Inzerát byl prodán a systémově uzavřen.

### Aktivita
- **Aktivita uživatele:** Jakýkoli záznam v **User Event Logu** (kliknutí, zobrazení, scroll).

---

<a id="ui"></a>
## UI

Tato sekce popisuje **hlavní části aplikace** a jejich smysl. Neřeším layout (od toho je Figma), ale logiku a pravidla chování.

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

### Tvorba inzerátu (Draft Gate)
- Vstup do editoru je **podmíněn limitem aktivních inzerátů**.
- **Tvrdá závora:** Pokud uživatel dosáhl limitu, **nepustím ho do editoru**.
  - Místo formuláře zobrazím **Status Screen**.
  - Obsah statusu: "Máš plno. Chceš další? Použít token nebo si dokup místo." (konkrétní text řeší copy).
  - **Žádné syslení draftů:** Pokud nemůžeš publikovat, nemůžeš ani psát.
- **Editor:**
  - Pokud je uživatel pod limitem, pustím ho do Draftu.
  - Editor je jedna kontinuální činnost (scroll).
  - Data se ukládají průběžně (autosave).

### Moje seznamy (Feedy)
- Seznam zobrazuje pouze feedy typu `user`.
- `search` (poslední hledání) sem nepletu.
- Uživatel zde může přepínat mezi svými kontexty (např. "Vaping" vs "Bazar aut").
- "Nový seznam" zakládá nový sledovací filtr.

### Rozšíření a Aktivace
- UI Rozšíření slouží jako **ovládací pult pro rozšíření a vylepšení**.
- **Sekce Aktivace Passů:**
  - Zobrazuji seznam dostupných vylepšení (Passů).
  - Tlačítko pro aktivaci je **chytré**:
    - Pokud má uživatel **token** (použití): Tlačítko říká "Aktivovat (1x)" -> Aktivace spotřebuje token.
    - Pokud uživatel **nemá token**: Tlačítko říká "Aktivovat (XX Gold)" -> Aktivace strhne goldíky.
  - Aktivace je okamžitá konverze (Token/Gold → Pass).
- **Sekce Ostatní tokeny:**
  - Odděleně pod passy zobrazuji tokeny, které nejsou přímo vázané na aktivaci passu (pokud takové existují).

### Zprávy (Transakce)
- UI pro komunikaci a obchod.
- Podpora **strukturovaných widgetů**: Kromě textu umím zobrazit balíčky (tracking), lokace a systémové stavy.

### Profil / Nastavení
- Preference uživatele (citlivost obsahu, notifikace).
- Zde se řeší "kdo jsem" a "co snesu vidět".

<a id="zakladni-kameny"></a>
## Základní stavební kameny

> Definice entit a dat, na kterých stavím vše ostatní.

### Uživatel
- Core entita.
- Držím absolutně minimální data – mám jen **email**, nic jiného neukládám.
- Respektuji anonymitu. Bezpečnost řeším sledováním chování (reputace), ne lustrováním občanky.

### Kategorie
- Organizační vrstva trhu. Kontext, ve kterém dává smysl jiný jazyk a filtry.
- Kategorie nese: **název**, **slug**, **locale**.
- **Category Spec (Parametry):**
  - Kategorie může definovat doplňující údaje (např. u aut „rok“, u vapingu „typ baterky“).
  - Tyto parametry řídí **UI tvorby inzerátu** (co vyplňuji) a **UI filtrování** (co hledám).
  - Parametr má typ (text, number, enum, bool) a režim filtru (equality nebo range).
  - **Range filtry jsou explicitní:** Parametr se nestane range filtrem sám od sebe, musí to být vědomé rozhodnutí v definici kategorie.

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

### Draft
- Kopie atributů inzerátu ve stavu zrodu.
- Vstupní bod tvorby. Inzerát nenechám vzniknout kliknutím, vzniká z Draftu.
- Umožňuje postupnou tvorbu (autosave) bez rizika ztráty dat.
- Spravuji seznam Draftů (možnost šablon/kopírování).

### Feed (Entita)
- Uložené nastavení filtru nad inzeráty.
- Není to jen seznam, je to **předpis**: "Co chci vidět" (kategorie, filtry, lokalita).
- Feed si pamatuje svou vlastní lokalitu (např. "Feed pro chatu" vs. "Feed pro práci").
- Defaultně zakládám uživateli obecný Feed bez filtrů.
- **Vyhledávání === Feed:** Systémově beru hledání jen jako speciální instanci Feedu.

### Transakce
- Most mezi prodejcem a kupujícím.
- Zastupuje interakci, v systému se prezentuje jako „Zprávy“.
- Každá transakce má **vlastní vlákno zpráv** (izolovaný kontext).
- Transakce nese stav (pending, open, sold...).

### Zprávy
- Obsah transakce.
- **Typy obsahu:**
  - Text.
  - Obrázky.
  - **Strukturovaná data:** Lokace, tracking balíčku, kontaktní údaje.
  - **Systémové zprávy:** Oznámení generovaná systémem (např. "Prodáno").
- Strukturovaná data ukládám odděleně, aby šla snadno a cíleně mazat (GDPR/Clean-up).

### Notifikace (Inbox)
- Jediný zdroj pravdy pro "co se stalo".
- Všechny události padají do **Inboxu**. Email je jen volitelný "forwarder".

### Lokace
- Autorita na polohu.
- Neukládám random stringy, odkazuji se na validní záznam ze služby vyhledávání adres.

### Upload
- Centrální správa souborů (fotek).
- Metadata k souborům na CDN.

### Hodnocení (Ranking)
- Pokud není řečeno jinak, používám školní stupnici **A-F** (A = nejlepší).
- Interně to mapuji na čísla 6 (A) až 1 (F).

<a id="mechaniky"></a>
## Mechaniky

> Mozek celé aplikace. Pravidla hry.

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

### Limity
- **Limit feedů:**
  - Počítám pouze feedy typu `user`.
  - `search` (poslední hledání) je mimo limity (nezabírá slot).
  - Při překročení limitu feedy nemažu. Jen ty nadlimitní v UI skryji (disable).
- **Limit aktivních inzerátů:**
  - Limituji pouze inzeráty ve stavu **Live**.
  - Při překročení limitu (vypršení passu): Existující inzeráty nechám doběhnout. Aktivuje se **Draft Gate** (nepustím uživatele tvořit nové).

### Notifikace a Inbox
- **Filosofie ticha:** Defaultní stav je neotravovat.
- **Inbox First:** Všechny události padají do in-app Inboxu.
- **Email jako zrcadlo:** Email je pouze volitelný "digest". Uživatel si nastavuje, co chce přeposílat (frekvence/typ).
- **Výjimka:** Reset hesla a bezpečnostní alerty chodí na email vždy.

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

### Payback
- Kompenzace pro prodávajícího, pokud byl jeho **Top** potlačen Anti-topperem.
- Týká se pouze **Top** (Mark nekompenzuji).
- Payback je **Pass (Exclusive)** = nárok na refund mají pouze předplatitelé.
- Vyhodnocuji po expiraci inzerátu.
- Sleduji poměr zobrazení (Visible vs. Anti-topper eventy). Pokud poměr překročí definované prahy, vracím poměrnou část ceny boostu v goldíkách.

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

### Čistky dat
- Po ukončení transakce (`closed`, `sold`, `expired`) běží dvoufázový úklid:
  1.  **Ihned:** Mažu strukturovaná data (adresy, telefony). Text a obrázky zůstávají pro kontext.
  2.  **Po 3 měsících:** Hard delete celé transakce.

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
  - **Score (A-F):** Agregovaná známka chování (počítám z reakční doby, fail rate, flagů).
  - Bez passu neukazuji nic (ani Score).
- **Ban:**
  - Ruční nástroj admina (já).
  - Banuji za podvody, spam nebo křížově špatně označený citlivý obsah.

<a id="predplatne"></a>
## Předplatné

> Oprávnění se vážou na účet (neexistuje trvalá role "prodejce/kupující").

### Zkušební Pro zdarma
- Každému novému uživateli dávám **1 měsíc Pro balíčku zdarma**.
- Trial aktivuji automaticky při registraci. Po vypršení se sám vypne.
- Cíl: Ať si uživatel vyzkouší aplikaci v plné síle.

### Balíčky předplatného
- **Balíček Kupující (119 Kč/měs):**
  - 300 Goldíků / měsíc.
  - Limit feedů: 5.
  - Limit aktivních inzerátů: 5.
  - Bonusy: 5× Early Access token, 5× Anti-topper token.
- **Balíček Prodejce (229 Kč/měs):**
  - 300 Goldíků / měsíc.
  - Limit aktivních inzerátů: 10.
  - Passy: Payback, Photo Count, Rozšířená data inzerátu.
  - Bonusy: 5× Early Delivery, 5× Mark, 3× Top, 1× Maxxi, 3× Multi-Category, 3× Kontinuální nabídka.
- **Balíček Pro (499 Kč/měs):**
  - Všechno z Kupující + Prodejce.
  - 600 Goldíků / měsíc.
  - Limit feedů: 10.
  - Limit aktivních inzerátů: 20.
  - Passy (Exclusive): Anti-topper, Early Access, Multi-Category, Detail protistrany.

<a id="goldiky"></a>
## Goldíky

- **Interní měna:** Definuji kurz **1 CZK ≈ 2 Goldíky**.
- **Získání:**
  - Součástí předplatného.
  - **Denní dropy:** V sekci Bonusy (cca 10 G/den).
  - **Nákup balíčků:**
    - Na zkoušku (300 G / 149 Kč).
    - Balík (600 G / 299 Kč).
    - Do zásoby (1200 G / 599 Kč).
- **Pravidlo:** Operace jsou atomické. Buď proběhne celá transakce (efekt + odečtení), nebo nic.

<a id="tokeny-a-passy"></a>
## Tokeny & passy

> Centrální ceník systému.

- **Token:** Jednorázové použití (neexpiruje).
- **Pass:** Stav oprávnění (běží po dobu platnosti). Token většinou slouží k aktivaci Passu.
- **Exclusive:** Položky dostupné pouze v rámci předplatného (nelze koupit samostatně).
- **Ceny:** Uvádím v Goldíkách.

| Co                  | Typ                | Efekt / Trvání                                   | Cena (Gold) |
| ------------------- | ------------------ | ------------------------------------------------ | ----------- |
| Early Access        | Token → Pass       | 7 dnů                                            | 80          |
| Early Delivery      | Token              | Zruší okno pro jeden inzerát                     | 40          |
| Anti-topper         | Token → Pass       | 7 dnů                                            | 40          |
| Mark                | Token → Pass       | 7 dnů                                            | 20          |
| Top                 | Token → Pass       | 7 dnů                                            | 50          |
| Top Maxxi           | Token → Pass       | 7 dnů                                            | 50          |
| Multi-Category      | Token              | 1 použití (1+2 kategorie)                        | 75          |
| Detail protistrany  | Token → Pass       | 7 dnů                                            | 50          |
| Photo Count         | Token → Pass       | 1 měsíc (+2 fotky)                               | 75          |
| Aktivní inzeráty 10 | Token → Pass       | 1 měsíc                                          | TBD         |
| Payback             | Pass               | Benefit předplatného                             | Exclusive   |
| Kontinuální nabídka | Token → Pass       | 1 měsíc (prodlouží život inzerátu)               | Exclusive   |

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

- **Konverzní cíl:** ~3 % MAU platí.
- **Odhad ARPU (Subscription):** ~7,68 Kč.
- **Odhad ARPU (Extras - Goldíky):** ~21,0 Kč (při 10% penetraci nákupů).
- **Model:** Konzervativní náběh. Prvních 6 měsíců je o plnění trhu, monetizace nabíhá až se saturací obsahu.
