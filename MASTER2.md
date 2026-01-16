# Master

Single source of truth projektu. _**Co tu není, neexistuje**_.

## Document Rules

- Tenhle Master drží **mé koncepty, pravidla a produktová rozhodnutí**.
- **Žádný kód, DB schémata ani implementační detaily.**
- Když něco doplňuji, doplňuji to jako **pravidlo** (co a proč), ne jako „jak to přesně nakóduji“.
- **Ich-forma:** Dokument píšu v **první osobě jednotného čísla**. Jsem autor a držím za projekt tvrdou osobní odpovědnost. Co slíbím, to platí.

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

<a id="identita"></a>
### Identita

- **Core myšlenka:** „**Prodávám, neojebávám.**“
- Nestavím další bazar. Tvořím **systém důvěry a komunity**.
- Mým cílem je: **klid, důvěra, kompetence uživatele**.
- Monetizaci stavím na **hodnotě** (nástroje), ne na tlaku (reklama).
- Stavím na důvěře mezi **mnou (platformou)** a **uživateli** pro zajištění mentálního komfortu.

<a id="tov"></a>
### Tone of Voice

- Onboarding bez pozlátek: „**Klikej. Zkoumej. Není tu co posrat.**“
- Neučím, nekomentuji, neotravuji.
- **Předpokládám IQ uživatelů alespoň 80** (nadneseně – mé UI je tak jasné, že nepotřebuje vysvětlivky).
- **Mluvím přímo:**
  - Aplikace uživateli tyká.
  - Používám **mužský rod** jako neutrální default (např. „Odmítl jsi“, „Máš novou zprávu“).
  - Vyhýbám se pasivu a úředničině ("bylo odmítnuto"). Mluvím krátce a lidsky.

<a id="produktove-cile"></a>
### Produktové cíle

- Chci vyvolat pocit **„teplého obýváku“** místo reklamního cirkusu.
- **Paměťová stopa:** bylo to klidné, rychlé, fungovalo to.
- Konzistence je pro mě víc než jedna killer funkce.
- **Kontrast s konkurencí** má být citelný (návrat ke konkurenci má „bolet“).

<a id="ux-principy"></a>
### UX principy

- **Nulová tolerance nápovědy:** „**Pokud to potřebuje hint, udělal jsem to špatně.**“
  - Žádné tooltipy, žádné `(?)` ikony, žádné vysvětlující bubliny.
  - UI musí být krystalicky jasné samo o sobě. Pokud uživatel neví, co má dělat, je chyba v mém designu, ne v absenci nápovědy.
- **Konzistence > chytrost.**
- **Empty state** = status → vysvětlení → **jedno** CTA.
- **Prázdno je záměr** (nižší kognitivní zátěž).
- Status může být emoční, CTA musí být mechanické a jasné.

<a id="komunikace"></a>
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

<a id="co-umim-lip"></a>
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

<a id="slabina"></a>
### V čem je má slabina (a proč s tím počítám)

- **Prázdno na startu:** Bez obsahu je marketplace mrtvý. Řeším to fázovaným startem (komunity → region).
- **„Levný drobnosti“:** Prodej věcí za pár korun je u mě složitější (vyžaduji Draft, interakci). Mířím na situace, kde se vyplatí mít klid a filtr.

<a id="co-nedelam"></a>
### Co vědomě nedělám

- **Agresivní paid reach:** Netlačím věci do obličeje jen proto, že někdo zaplatil. Priorita je pro mě čitelnost trhu.
- **Videa u inzerátů:** Ne. Nechci tu zbytečný šum, infra peklo a riziko zneužití.

---

<a id="kodex"></a>
## Kodex

> Má vědomá rozhodnutí a kontrakt mezi mnou a uživateli. Tyto principy držím veřejně dostupné.

<a id="duvera-default"></a>
### Důvěra jako výchozí stav

- Vycházím z předpokladu, že většina lidí chce hrát fér.
- Ochranné mechanismy přidávám až tehdy, když jsou nutné, ne preventivně.

<a id="ferova-monetizace"></a>
### Férová monetizace a neaktivita

- Platby nejsou past. Předplatné umožňuji kdykoliv zrušit.
- **Automatické ukončení při neaktivitě:**
  - Pokud uživatel systém dlouhodobě nepoužívá, nechci jeho peníze za nic.
  - **Neaktivita** = žádný záznam v User Event Logu (uživatel aplikaci ani neotevřel).
  - Po **1. měsíci** neaktivity: Pošlu e-mail s připomínkou.
  - Po **2. měsíci** neaktivity: Okamžitě ruším předplatné (zastavím platby).
- Raději přijdu o platbu než o důvěru.

<a id="no-p2w"></a>
### Žádné pay-to-win

- Peníze nekupují nadvládu. Placený obsah zobrazuji viditelně.
- Trh nechávám čitelný pro všechny (neplatiče nelze skrýt, jen přeskočit v řazení).

<a id="respekt"></a>
### Respekt k uživateli

- Nepoužívám manipulativní notifikace ani dark patterns.
- Nesbírám data bez jasného účelu.

<a id="otevrenost"></a>
### Otevřenost a odpovědnost

- Pokud něco měním, dávám to vědět **předem a konkrétně**:
  - **Kanály:** E-mail, in-app notifikace, commit log ve veřejném repozitáři.
  - **Kurz CZK ↔ Token** měním nejdřív **kvartálně**.

---

<a id="terminologie"></a>
## Terminologie

> Slovníček pojmů, ať se u toho nehádáme jak idioti.

<a id="kupon-token-term"></a>
### Kupón vs. Token
- **Token (Měna):** Interní platidlo (žeton/kamínek). Kurz 1 CZK ≈ 2 Tokeny. Používá se k nákupu Passů, pokud nemám Kupón.
- **Kupón (Ticket):** Jednorázová položka (lístek), kterou lze směnit za Pass. Získává se z balíčků nebo jako bonus.

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
