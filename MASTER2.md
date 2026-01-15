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

<a id="ui"></a>
## UI

<a id="zakladni-kameny"></a>
## Základní stavební kameny

<a id="mechaniky"></a>
## Mechaniky

<a id="predplatne"></a>
## Předplatné

<a id="goldiky"></a>
## Goldíky

<a id="tokeny-a-passy"></a>
## Tokeny & passy

<a id="uvedeni-na-trh"></a>
## Uvedení na trh

<a id="retence"></a>
## Retence a paměť trhu

<a id="odhady"></a>
## Odhady monetizace a růstu
