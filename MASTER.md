# Master - zbav-se.me

Single source of truth projektu. Co je tady, platí. Co je jinde a není tady, neexistuje.

---

# Document Rules

* Tenhle Master drží **koncepty, pravidla a produktová rozhodnutí**.
* **Žádný kód, DB schémata ani implementační detaily**, dokud o ně explicitně nepožádáš.
* Když něco doplňujeme, doplňujeme to jako **pravidlo** (co a proč), ne jako „jak to přesně nakódujeme“.

---

# Ústava

## Směr produktu

### Identita

* **Core myšlenka:** „**Prodáváme, neojebáváme.**“
* Nejsme další bazar. Jsme **systém důvěry a důsledků**.
* Cíl: **klid, důvěra, kompetence uživatele**.
* Monetizace stojí na **hodnotě**, ne na tlaku.

### Tone of Voice

* Onboarding bez vodění: „**Klikej. Zkoumej. Není tu co posrat.**“
* Neučíme, nekomentujeme, neotravujeme. UI má uklidňovat a pustit do akce.

---

## Produktové cíle

* Pocit „teplého obýváku“ místo reklamního cirkusu.
* Paměťová stopa: bylo to klidné, rychlé, fungovalo to.
* Konzistence je víc než jedna killer funkce.
* Kontrast s konkurencí má bolet při návratu.

### UX principy

* Konzistence > chytrost.
* Empty state = status → vysvětlení → **jedno** CTA.
* Prázdno je záměr (nižší kognitivní zátěž).
* Status může být emoční, CTA musí být mechanické.

---

## Kodex

Tento kodex popisuje **vědomá rozhodnutí a kontrakt** mezi platformou a jejími uživateli. Nejde o právní podmínky ani marketing. Jde o způsob, jakým se systém chová a proč.

### Důvěra jako výchozí stav

* Vycházíme z předpokladu, že většina lidí chce hrát fér.
* Systém není postavený na hledání zneužití, ale na spolupráci.
* Ochranné mechanismy přidáváme až tehdy, když jsou nutné, ne preventivně.

### Férová monetizace

* Platby nejsou past ani trik.
* Předplatné lze kdykoliv zrušit.
* Pokud má uživatel aktivní předplatné, ale dlouhodobě systém nepoužívá, **dáme mu to vědět a předplatné sami ukončíme**.

  * 1 měsíc bez aktivity (plovoucí) -> e-mail.
  * 2 měsíce bez aktivity -> ukončení subscription.
* Raději přijdeme o platbu než o důvěru.

### Žádné pay-to-win

* Peníze nekupují nadvládu nad ostatními.
* Placený obsah je vždy viditelný.
* Neplacený obsah může být pouze mírně potlačen (bez vizuálního zvýraznění), nikdy skrytý.
* Trh zůstává čitelný pro všechny.

### Respekt k uživateli

* Nepoužíváme manipulativní notifikace ani dark patterns.
* Neprodáváme pozornost, ale hodnotu.
* Nesbíráme data bez jasného a srozumitelného účelu.

### Otevřenost a odpovědnost

* Pokud něco měníme, děláme to vědomě a transparentně.
* Tento kodex je závazek vůči uživatelům i vůči sobě samým.

---

# Systém

## Mechaniky

### Feed (filtry)

* Feed je uživatelův uložený filtr (co se mu má zobrazovat).
* Uživatel může mít omezený počet uložených feedů; subscriptions mohou tenhle limit zvyšovat.
* Cíl: uživatel může paralelně sledovat víc oblastí (např. dětské věci, auto, domácnost, počítač).

### Anti-topper

* Premium uživatel platí za **klid**, ne za dominanci.
* Anti-topper má **relativně malý efekt** - u `mark` a `top` schová grafické zvýraznění; u `top` navíc ruší posun v řazení. **Top Maxxi** neovlivňuje.
* Záměrně je **cenově níž** než nástroje zvyšující dosah, protože neslouží k růstu reach, ale k redukci šumu.
* Distribuce pozornosti je řízená v čase.
* Pro uživatele s aktivním anti-topperem se u `mark` / `top` inzerátů **skryje grafické zvýraznění** (vypadají jako běžné).
* U `top` se pro něj v řazení **ignoruje posun**; `mark` je čistě vizuální. **Top Maxxi** zůstává viditelný.
* Anti-topper je **filtr v nastavení feedu**. Pokud má uživatel anti-topper aktivní (pass), je **defaultně zapnutý**; v nastavení je tedy přepínač, který anti-topper **vypne**.
* `Top Maxxi` je **vždy viditelný** a **vizuálně jasně označený**; systém explicitně komunikuje, že **tohle potlačit nejde**.
* Payback

  * Vyhodnocuje se **až po skončení platnosti inzerátu**.
  * Počítá se poměr **běžných vs. potlačených views** (na úrovni **unikátních uživatelů** dle event logu).
  * Pokud podíl **potlačených views > 20 %**, prodávající dostane zpět **20 % jednotkové ceny** použitého zvýraznění (`mark` / `top`).
  * Funguje **jen pro platící prodávající** - a jen pokud má prodávající v době vyhodnocení (konec platnosti inzerátu) stále aktivní subscription. Pokud mu mezitím vyprší, payback nevzniká.
* Plátci (prodávající) vidí u inzerátu rozšířená data: např. **palce**, **běžné views**, **potlačené views** (anti-topper), atd.

### Zvýraznění (Mark / Top / Top Maxxi)

* **Mark**: jen grafické označení (např. malá badge).
* **Top**: grafické označení + měkký posun před ostatní (lze potlačit anti-topperem). Posun je **jednorázový bump v řazení** (u stejně starých inzerátů bude výš).
* **Top Maxxi**: jako Top, ale **nelze potlačit** (chová se jako „klasický TOP“ na jiných platformách). Po dobu platnosti Top Maxxi **přeskakuje běžné řazení**; po vypršení se **vrátí na své místo** (běžné řazení).

### Early Access

* Nově publikovaný inzerát má **release window**: uživatelům bez Early Access se zobrazí až **+8h** po publikaci.
* Kupující s aktivním Early Access inzeráty vidí **hned**.
* Výhoda se **nestackuje**: maximum je vždy **+8h**.

### Early Delivery

* Early Delivery pro konkrétní inzerát **ruší release window** (zobrazí se hned i lidem bez Early Access).
* Early Delivery a Early Access se doplňují tak, aby se systém nikdy „neposouval“ víc než o **8h**.

### Multi-Category

* Multi-Category je **distribuce**: inzerát se zobrazí lidem, kteří sledují některou z vybraných kategorií.
* Inzerát se uživateli zobrazuje **právě jednou**, i když spadá do více kategorií.

### Detail protistrany

* Rozšířený detail je sada **neutrálních signálů** chování uživatele (bez emocionality a bez „score“ manipulace):

  * kolik obchodů uzavřel,
  * kolik jich zavřel hned,
  * reakční čas,
  * jak často potvrzuje success/close,
  * jak často otevírá dispute,
  * celková aktivita a stáří účtu.

### Inzeráty

* Inzerát po expiraci je **defaultně schovaný**.
* Expirované inzeráty lze zobrazit filtrem ve feedu:

  * mix aktivních + expirovaných,
  * nebo jen expirované.

### Kontinuální nabídka

* Umožňuje u expirovaného inzerátu znovu otevřít obchody/transakce (typicky pro dotazy typu „kdy bude další várka/vrh?“).
* Aktivuje se **explicitně** nad konkrétním (expirovaným) inzerátem.
* Kontinuální nabídka existuje jako **token** i jako **pass** (subscription-exclusive); konkrétní rozdělení je definované v sekci Subscriptions.

---

## Monetizace

### Základní model

* Monetizace stojí na **subscriptions** a **interní měně (goldíky)**.
* Cílem není maximalizace výběru, ale dlouhodobý klid a férové použití systému.

### Subscriptions

**Cenový model (měsíčně, CZK):**

* **Buyer Package:** 119 Kč

* **Seller Package:** 229 Kč

* **Pro Package:** 499 Kč

* **Buyer Package** - nástroje pro kupující:

  * **Přidělené goldíky:** 300 / měsíc.
  * **Early Access (token, 5×)**
  * **Limit uložených feedů (pass):** default 3 → Buyer 5.
  * **Anti-topper (token, 5×)**

* **Seller Package** - nástroje pro prodávající:

  * **Přidělené goldíky:** 300 / měsíc.
  * **Early Delivery (token, 5×)**
  * **Photo Count (pass):** navýšení počtu fotek z default 3 → 5.
  * **Mark (token, 5×)**
  * **Top (token, 3×)**
  * **Top Maxxi (token, 1×)**
  * **Multi-Category (token, 3×)**
  * **Kompenzace za anti-topper (pass)**
  * **Rozšířená data u inzerátu**
  * **Kontinuální nabídka (token, 3×)**

* **Pro Package** - plná kontrola nad trhem (kupující + prodávající):

  * **Přidělené goldíky:** 600 / měsíc.

  * Obsahuje **Buyer Package + Seller Package**.

  * **Anti-topper (pass)**

  * **Early Access (pass)**

  * **Limit uložených feedů:** 10.

  * **Photo count:** 10.

  * **Multi-Category (pass)**

  * **Kompenzace za anti-topper (pass)**

  * **Rozšířená data u inzerátu**

  * **Kontinuální nabídka (pass)**

  > Účel: dát uživateli, který systém aktivně používá na obou stranách trhu, **plynulost bez mikromanagementu a větší kontrolu bez agresivní dominance**.

---

### Goldíky (interní měna)

* Goldík je **trvalá interní měna** (interpretace kreditu / reálných peněz).

* Nelze jít do mínusu.

* Veškeré „peněžní“ operace jsou transakční: **nikdy se nesmí stát, že se hodnota odečte bez dodání protihodnoty**.

* **Interní kurz:** **1 CZK ≈ 2 goldíky** (může se v čase měnit).

* Goldíky lze získat:

  * skrze subscription (všechny balíčky je obsahují),
  * skrze používání aplikace (bonusy),
  * **nákupem balíčků goldíků**.

* Goldíky jsou vidět na dvou místech:

  * **Inventář** (consumables + aktivní passy)
  * **Obchod / Bonusy** (nákup goldíků a tokenů)

* Uživatel má k dispozici **historii transakcí** (přírůstky/úbytky).

* Všechny pohyby nad inventářem běží **atomicky v DB transakci** (fail = rollback).

#### Nákupní balíčky goldíků

| Balíček    | Množství goldíků | Cena (CZK) |
| ---------- | ---------------- | ---------- |
| Na zkoušku | 300              | 149        |
| Balík      | 600              | 299        |
| Do zásoby  | 1200             | 599        |

---

### Bonusy za používání

* Bonusy jsou odměny v goldících za používání produktu (bez dark patterns a bez nátlaku).
* Cíl: podpořit návrat a „paměť trhu“ skrze užitek, ne notifikace.
* Konkrétní pravidla (za co, kolik, limity) jsou **TBD**.

---

### Tokeny & passy

* **Token** = jednorázová akce (spotřebuje se).

* **Pass** = stav oprávnění (může mít konec platnosti, nebo být bez konce).

* V UI se to nepředvádí jako „token/pass“: uživatel vidí akce typu **„Odemknout +2 fotky?“** apod.; detail (včetně pasů) je v **Inventáři**.

* Tokeny jde **nakoupit dopředu** a aktivovat později; přímý pass je **okamžitá aktivace** (levnější, ale bez odkladu).

* Při zámcích placených věcí používáme pattern: **Status** (proč to stojí) → **jedno CTA** (spotřebovat token / zaplatit goldíky).

* Goldíky slouží k nákupu **tokenů** (spotřební oprávnění) a dalších věcí v systému.

* Některé tokeny/passy:

  * nemusí být koupitelné,
  * mohou být **subscription-exclusive**.

* Subscription může dávat:

  * přímé passy,
  * usage tokeny,
  * pravidelný přísun goldíků.

Pozn.: **Token** = skladovatelný (koupíš teď, aktivuješ kdy chceš). **Pass** = okamžitý stav (zapne se hned).

Pozn.: **Jednotková cena** u balíčků (např. „5× za 20“) znamená cenu za jedno použití (20 / 5 = 4).

| Co                 | Typ (token / pass) | Kolik / na jak dlouho                         | Cena |
| ------------------ | ------------------ | --------------------------------------------- | ---- |
| Early Access       | Token              | 1× použití (vygeneruje pass)                  | 80   |
| Early Access       | Pass               | +8h náskok po dobu 7 dnů                      | 70   |
| Early Delivery     | Token              | 1× použití (ruší release window pro inzerát)  | 40   |
| Anti-topper        | Token              | 1× použití (vygeneruje pass)                  | 40   |
| Anti-topper        | Pass               | 7 dnů                                         | 30   |
| Mark               | Token              | 5× zvýraznění (platnost 7 dní)                | 20   |
| Top                | Token              | 3× jednorázový bump v řazení (platnost 7 dní) | 50   |
| Top Maxxi          | Token              | 1× aktivace (priorita v řazení po dobu 7 dnů) | 50   |
| Multi-Category     | Token              | 1× použití (1 + 2 kategorie)                  | 75   |
| Detail protistrany | Token              | 5× použití (platnost 7 dnů)                   | 50   |
| Detail protistrany | Pass               | 7 dnů                                         | 75   |
| Photo Count        | Pass               | 1 měsíc (+2 fotky)                            | 75   |

---

# Modely

## Go-to-market

### Fázování startu

Start projektu je **vědomě rozdělen do dvou paralelních, ale sekvenčních fází**, s cílem snížit riziko prázdna a zvýšit šanci na první smysluplné transakce.

---

### Fáze 1: Online komunitní start (Discord)

**Primární starting-ground.**

* První spuštění proběhne **v uzavřených tematických komunitách (vapování)**.
* Jasně definovaná kategorie produktů.
* Vysoká tematická shoda → **nižší tření při startu**.
* Vyšší pravděpodobnost:

  * prvních inzerátů,
  * prvních transakcí,
  * prvních referencí.
* Komunitní efekt:

  * lidé jsou **více tolerantní k nedokonalostem**,
  * vyšší ochota být „u zrodu“ a dávat feedback.

Účel této fáze:

* Ověřit chování uživatelů v prostředí s vysokou důvěrou.
* Otestovat monetizaci **bez regionálního šumu**.
* Vytvořit první **reálnou paměť trhu**.

---

### Fáze 2: Regionální expanze (Karlovy Vary + Ostrov + Sokolov)

* Navazuje na stabilní základ z online komunity.
* Billboardy už **nevedou do prázdna**, ale do živého systému.
* Komunikace může být přímější a sebevědomější.

**Distribuce:**

* Billboardy: bílé pozadí, žádné obrázky, krátký tvrdý text + URL.
* Word-of-mouth jako hlavní akcelerační kanál.

---

### Badge a narativ

* **„První skokani“**: první ~100 aktivních uživatelů napříč kanály.
* Komunikace přiznává prázdno, ale je **akční**, ne omluvná.

---

## Retence a paměť trhu

Zbav-se.me **nepracuje s krátkodobou pozorností**, ale s pamětí trhu. Inzeráty po expiraci **nezmizí**, ale jsou **defaultně schované** a lze je zobrazit filtrem. Díky tomu tvoří historický kontext: ceny, neúspěšné nabídky, chování účastníků.

Důsledky tohoto přístupu:

* Hodnota platformy **roste v čase**, i bez přísunu nového obsahu.
* Uživatelé se vracejí nejen kvůli novým inzerátům, ale kvůli **orientaci v trhu**.
* MAU může růst rychleji než nové registrace.

**Očekávaný vývoj poměru registrace → MAU:**

* Měsíc 1-2: ~20-30 % (zvědavost, nízký kontext)
* Měsíc 3-4: ~35-45 % (vznikající historie)
* Měsíc 5-7: ~50-60 % (paměť trhu má hodnotu)
* Po saturaci regionu: **60-70 %** (platforma jako referenční bod)

> Retence zde není tlačena notifikacemi ani návykovostí, ale **užitkem z kontextu**. To vytváří menší, ale stabilnější a důvěryhodnější MAU.

---

## Odhady monetizace a růstu

### Odhad monetizace - subscription baseline (konzervativní)

**Předpoklad:** start z nuly, konzervativní očekávání trhu.
**Celková konverze:** ~**3 % MAU**.

| Balíček        | Podíl MAU | Cena (Kč / měsíc) | ARPU příspěvek   |
| -------------- | --------- | ----------------- | ---------------- |
| Buyer Package  | 0,5 %     | 119               | 0,60 Kč          |
| Seller Package | 2,0 %     | 229               | 4,58 Kč          |
| Pro Package    | 0,5 %     | 499               | 2,50 Kč          |
| **Celkem**     | **3,0 %** |                   | **7,68 Kč ARPU** |

---

### Odhad monetizace - extras baseline (cash-in model)

Tento scénář modeluje **jednorázové nákupy extras** skrze **balíčky goldíků**.

**Předpoklady:**

* MAU: **10 000**
* Podíl uživatelů, kteří si koupí goldíky: **10 % MAU**

| Metrika             | Hodnota         |
| ------------------- | --------------- |
| Počet nakupujících  | 1 000           |
| Průměrná útrata     | ~210 Kč         |
| **Měsíční revenue** | **~210 000 Kč** |
| **ARPU (cash-in)**  | **~21,0 Kč**    |

---

### Odhad monetizace - kombinovaný scénář (konzervativní)

| Zdroj        | ARPU (Kč) | Měsíční revenue |
| ------------ | --------- | --------------- |
| Subscription | 7,68      | ~76 800 Kč      |
| Extras       | 21,0      | ~210 000 Kč     |
| **Celkem**   | **28,68** | **~286 800 Kč** |

---

### Odhad náběhu MAU a revenue (sekvenční start)

| Měsíc | Zdroj MAU        | Odhad MAU | Odhad revenue |
| ----- | ---------------- | --------- | ------------- |
| 1     | Discord          | 60        | ~1 700 Kč     |
| 2     | Discord          | 90        | ~2 600 Kč     |
| 3     | Discord          | 120       | ~3 400 Kč     |
| 4     | Discord + region | 700       | ~20 100 Kč    |
| 5     | Discord + region | 1 600     | ~45 900 Kč    |
| 6     | Discord + region | 3 200     | ~91 800 Kč    |
| 7     | Discord + region | 5 000     | ~143 400 Kč   |
| 8     | Discord + region | 7 500     | ~215 100 Kč   |
| 9     | Discord + region | 9 500     | ~272 500 Kč   |
| 10    | Discord + region | 10 500    | ~301 100 Kč   |
| 11+   | Discord + region | 11-12k    | ~315-345k Kč  |

---

### Odhad monetizace - online komunitní kanál (Discord)

| Metrika         | Hodnota         |
| --------------- | --------------- |
| Odhad MAU       | 90-120          |
| Podíl platících | 15-20 %         |
| Měsíční revenue | ~2 200-3 700 Kč |
| ARPU            | ~20-30 Kč       |
