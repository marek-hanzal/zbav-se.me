# Master

Single source of truth projektu. _**Co tu není, neexistuje**_.

## Document Rules

- Tenhle Master drží **koncepty, pravidla a produktová rozhodnutí**.
- **Žádný kód, DB schémata ani implementační detaily.**
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
- Nejsme další bazar. Jsme **systém důvěry a komunity**.
- Cíl: **klid, důvěra, kompetence uživatele**.
- Monetizace stojí na **hodnotě** (nástroje), ne na tlaku (reklama).
- Stavíme na důvěře mezi **platformou** a **uživateli** pro zajištění mentálního komfortu.

### Tone of Voice

- Onboarding bez pozlátek: „**Klikej. Zkoumej. Není tu co posrat.**“
- Neučíme, nekomentujeme, neotravujeme.
- **Předpoklad IQ uživatelů je alespoň 80** (nadneseně – UI je tak jasné, že nepotřebuje vysvětlivky).
- **Přímá komunikace:**
  - Aplikace uživateli tyká.
  - Používáme **mužský rod** jako neutrální default (např. „Odmítl jsi“, „Máš novou zprávu“).
  - Vyhýbáme se pasivu a úředničině ("bylo odmítnuto"). Mluvíme krátce a lidsky.

### Produktové cíle

- Pocit **„teplého obýváku“** místo reklamního cirkusu.
- **Paměťová stopa:** bylo to klidné, rychlé, fungovalo to.
- Konzistence je víc než jedna killer funkce.
- **Kontrast s konkurencí** má být citelný (návrat ke konkurenci má „bolet“).

### UX principy

- **Nulová tolerance nápovědy:** „**Pokud to potřebuje hint, je to špatně.**“
  - Žádné tooltipy, žádné `(?)` ikony, žádné vysvětlující bubliny.
  - UI musí být krystalicky jasné samo o sobě. Pokud uživatel neví, co má dělat, je chyba v designu, ne v absenci nápovědy.
- **Konzistence > chytrost.**
- **Empty state** = status → vysvětlení → **jedno** CTA.
- **Prázdno je záměr** (nižší kognitivní zátěž).
- Status může být emoční, CTA musí být mechanické a jasné.

### Komunikace a transparentnost

- **Source Available:** Zdrojové kódy jsou dostupné veřejně k auditu bezpečnosti a fair-play, ale chráněné licencí proti komerčnímu zneužití či klonování.
- **Transparentní finance:** Na domovské stránce je odkaz na transparentní bankovní účet projektu.
- **Vývoj:** Na domovské stránce je viditelný kalendář aktivity vývoje (Github-like) a dynamická timeline (první skokani, milníky, hlášky o stavu trhu).
- **Soukromí (Tracking):**
  - **Žádné externí šmírování:** Žádné UTM, žádné cookies třetích stran, žádné Google Analytics / Facebook Pixel.
  - **Interní telemetrie:** Měříme a ukládáme pouze to, co je nutné pro funkci produktu a výpočet reputačních metrik (User Event Log). Data neopouští naši infrastrukturu.
- **Podpora:**
  - Discord server (komunita) + e-mail.
  - Sekce **„Zpětná vazba“** přímo v aplikaci (interní mechanismus kontaktu).

---

<a id="konkurenceschopnost"></a>
## Konkurenceschopnost

> Subjektivní výhody a argumenty. Checklist existence projektu.

### Co umíme líp

- **Klid místo cirkusu:** Minimum vizuálního šumu, žádné otravné UX. Aplikace pomáhá uzavřít obchod, ne krást čas.
- **Soukromí jako default:** Držíme jen minimum dat (email). Nejsi produkt.
- **Anti-spam obchod:** Dokud prodávající nepřijme transakci (stav `pending` → `open`), kupující nemůže psát zprávy ani posílat strukturovaná data.
- **Důvěra z chování:** Reputace stojí na tvrdých metrikách (reakce, expirace, closer, resolved, flagy), ne na bio a „věř mi bro“ profilech.
- **Feed jako hlavní produkt:** Vyhledávání je jen zkratka pro feed. Uživatel si definuje zájem a systém mu ho servíruje.
- **Paměť trhu:** Expirované inzeráty nezmizí (jsou dohledatelné). Vzniká historie cen a kontextu.
- **Férová ekonomika:** Nebereme procenta z prodeje. Platí se za nástroje (rozšíření) a předplatné.
- **Bez pay-to-win:** Placené věci jsou viditelné a přiznané. Neplacený obsah se může mírně potlačit (řazení), ale nikdy se neskrývá.
- **Deterministické brány:** Citlivost obsahu je přísně řízená nastavením uživatele.

### V čem je naše slabina (a proč s tím počítáme)

- **Prázdno na startu:** Bez obsahu je marketplace mrtvý. Řešíme fázovaným startem (komunity → region).
- **„Levný drobnosti“:** Prodej věcí za pár korun je u nás složitější než jinde (vyžadujeme Draft, interakci). Míříme na situace, kde se vyplatí mít klid a filtr.
- **Přirozené učení feedů:** Uživatelům necpeme slovo "Feed". V menu je "Seznam inzerátů" (default). Pokud uživateli obsah nesedí (má v tom bordel), hledá nastavení (ozubené kolo). Učí se používat filtry/feedy organicky z potřeby, ne z manuálu.

### Co vědomě neděláme

- **Agresivní paid reach:** Netlačíme věci do obličeje jen proto, že někdo zaplatil. Priorita je čitelnost trhu.
- **Videa u inzerátů:** Ne. Zbytečný šum, infra peklo a riziko zneužití.

---

<a id="kodex"></a>
## Kodex

> Vědomá rozhodnutí a kontrakt mezi platformou a uživateli. Tyto principy jsou veřejně dostupné.

### Důvěra jako výchozí stav

- Vycházíme z předpokladu, že většina lidí chce hrát fér.
- Ochranné mechanismy přidáváme až tehdy, když jsou nutné, ne preventivně.

### Férová monetizace a neaktivita

- Platby nejsou past. Předplatné lze kdykoliv zrušit.
- **Automatické ukončení při neaktivitě:**
  - Pokud uživatel systém dlouhodobě nepoužívá, nechceme jeho peníze za nic.
  - **Neaktivita** = žádný záznam v User Event Logu (uživatel aplikaci ani neotevřel).
  - Po **1. měsíci** neaktivity: E-mail s připomínkou.
  - Po **2. měsíci** neaktivity: Okamžité zrušení předplatného (zastavení plateb).
- Raději přijdeme o platbu než o důvěru.

### Žádné pay-to-win

- Peníze nekupují nadvládu. Placený obsah je viditelný.
- Trh zůstává čitelný pro všechny (neplatiče nelze skrýt, jen přeskočit v řazení).

### Respekt k uživateli

- Nepoužíváme manipulativní notifikace ani dark patterns.
- Nesbíráme data bez jasného účelu.

### Otevřenost a odpovědnost

- Pokud něco měníme, děláme to transparentně.
- **Kurz CZK ↔ Goldík** měníme nejdřív **kvartálně**.

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
