# Zásady ochrany osobních údajů
## **zbav-se.me**

*Účinné od: **12. 10. 2025***  
*Verze: **1.0‑alfa***  
*Správce: **Marek Hanzal, IČ 87911418**, kontakt: **marek.hanzal@icloud.com***

> Tohle je lidsky napsaná politika soukromí. Vysvětluje, **jaké údaje o tobě máme, proč, na jak dlouho a kdo je vidí**. Neskrýváme marketingové háčky ani zbytečné sledování. Pokud něco není jasné, napiš nám – odpovíme.

---

## 1) Jaké údaje zpracováváme
Záměrně držíme rozsah dat **co nejmenší**.

- **Účet**: e‑mail a heslo (hesla **neukládáme v čitelné podobě**, nikdo je nemůže přečíst – ani my)  
- **Obsah**: fotky a popisy u inzerátů (fotky jsou doručované přes CDN)  
- **Lokalita inzerátu**: držíme **jen lokálně** u tebe v zařízení; na náš server se **neposílá**  
- **Platby (kredit)**: platby zpracovává **[Stripe](https://stripe.com/)** – **číslo karty u nás neukládáme**; můžeme vidět technické údaje o transakci (částka, měna, status, anonymní identifikátory) kvůli účetnictví a řešení problémů  
- **E‑maily**: posíláme **jen transakční** (registrace, reset hesla, souhrny, bezpečnostní upozornění); žádný přímý marketing bez tvého souhlasu  
- **Nápověda adres**: při vyhledávání adres tvůj dotaz zpracuje **[Geoapify](https://www.geoapify.com/)** (může krátce zpracovat technická metadata jako IP kvůli doručení služby)  
- **Cookies**: pouze **nezbytné** pro přihlášení a běh aplikace (žádná analytika třetích stran)
- **Technické logy**: provozní záznamy zajišťuje poskytovatel hostingu **Vercel** (např. IP adresa, čas, URL); používáme je jen pro diagnostiku, bezpečnost a provoz, sami si je **neukládáme** mimo účet poskytovatele

---

## 2) K čemu data používáme (účely) a na jakém základě (právní základy)
- **Poskytnutí služby** (registrace, přihlášení, vedení účtu, inzerce, dobití kreditu) – **plnění smlouvy**  
- **Bezpečnost a prevence zneužití** (např. ochrana proti útokům, řešení incidentů) – **oprávněný zájem**  
- **Účetnictví a daně** (transakční záznamy o kreditu) – **právní povinnost**  
- **Souhlas** – pouze pro volitelné věci, které dnes **nepoužíváme** (např. marketingové e‑maily nebo analytika); pokud bychom je přidali, vyžádáme si souhlas předem

---

## 3) Kdo nám s tím pomáhá (příjemci / zpracovatelé)
- **Hosting aplikace**: [Vercel](https://vercel.com/) – [DPA](https://vercel.com/legal/dpa), [Security & Compliance](https://vercel.com/docs/security/compliance)  
- **Databáze**: [Neon](https://neon.tech/) *(EU – Frankfurt, preferováno)* – [DPA](https://neon.com/dpa)  
- **CDN a úložiště fotek**: [Bunny.net](https://bunny.net/) *(EU – Frankfurt, preferováno)* – [GDPR info](https://bunny.net/gdpr/), [Privacy](https://bunny.net/privacy/)  
- **Platby**: [Stripe](https://stripe.com/) *(údaje o kartě jdou Stripe; my číslo karty nevidíme)* – [DPA](https://stripe.com/legal/dpa), [Data Transfers Addendum](https://stripe.com/legal/dta), [Privacy Center](https://stripe.com/legal/privacy-center)  
- **Nápověda adres**: [Geoapify](https://www.geoapify.com/) – [Privacy Policy](https://www.geoapify.com/privacy-policy/)  
- **E‑mailový odesílatel**: *(doplníme název, až vybereme poskytovatele)*

Všem partnerům dáváme jen to **nezbytné minimum** a vážeme je **smlouvami o zpracování** a bezpečnostními požadavky.


*Poznámka:* U poskytovatelů, kde může dojít k přeshraničnímu přenosu (např. Stripe, Vercel), se opíráme o jejich **DPA/DTA** a **SCC**. Vždy předáváme jen **nezbytné minimum** údajů.

---

## 4) Kde se data zpracovávají (lokality a přenosy)
Cílíme na **EU** a preferujeme **Frankfurt (DE)**. Některé části infrastruktury ale mohou být dočasně v **jiném EU regionu**; ve výjimečných případech může být malá část provozu směrována do **USA** (např. CDN, telemetrie/logy u poskytovatele). Tyto přenosy **minimalizujeme**.

**Přeshraniční přenosy a SCC.** Pokud dojde k přenosu mimo EHP, opíráme se o **Standardní smluvní doložky (SCC)** a doplňková opatření (minimální rozsah dat, šifrované přenosy, omezení přístupu, kontrola sub‑zpracovatelů). Odkazy na DPA/DTA poskytovatelů uvádíme níže.

**EU‑only režim.** Na vyžádání nastavíme zpracování tak, aby probíhalo výhradně v EU regionech a s EU poskytovateli, s výjimkami pouze v nutných případech (havárie, doručování přes CDN). Detaily poskytneme na požádání.
---

## 5) Jak dlouho údaje držíme (retence)
- **Účet (e‑mail)**: po dobu existence účtu a krátce poté (typicky **do 6 měsíců**) kvůli bezpečnosti a prokázání souladu  
- **Obsah inzerátů**: dokud jsou veřejné; po smazání mohou krátce zůstat v **cache CDN**  
- **Platby/kredit**: údaje o transakcích drží primárně Stripe; u nás jen nezbytné minimum. Pokud nám zákon uloží účetní povinnost, uchováváme daňové doklady až **10 let**
- **E‑mailové logy**: jen nezbytné minimum a po **co nejkratší dobu** (typicky dny až jednotky týdnů u poskytovatele)

---

## 6) Tvoje práva
- **Přístup** k údajům, **oprava**, **výmaz**, **omezení zpracování**, **námitka**, **přenositelnost**  
- **Stížnost** u dozorového úřadu: **Úřad pro ochranu osobních údajů (ÚOOÚ)**  
Jak na to: napiš na **marek.hanzal@icloud.com**. Odpovíme standardně do **1 měsíce** (lze jednou prodloužit, pokud je žádost složitá).

---

## 7) Bezpečnost
Šifrované přenosy (**HTTPS**), hesla **neukládáme v čitelné podobě**, přístupy máme omezené jen na osoby, které je nezbytně potřebují. Data držíme **co nejméně**, a když je nepotřebujeme, nemažeme oklikou, ale **mazáme**.

---

## 8) Děti a věkové omezení
Služba je pro osoby **15+**. Osoby **mladší 15 let** službu používat nesmí. Osoby **15–17 let** mohou službu používat jen přiměřeně věku; **prodej** (uzavírání kupních smluv) je pro **18+** nebo **se souhlasem/zastoupením zákonného zástupce** (viz ToS). Nevědomě neshromažďujeme údaje dětí **<15**; pokud se to stane, údaje **odstraníme**.

---

## 9) Cookies
Používáme pouze **nezbytné** cookies (např. přihlašovací). **Nepoužíváme** analytiky třetích stran. Pokud bychom je přidali, objeví se **banner se souhlasem** a tahle politika se aktualizuje.

---

## 10) Automatizace, profilování a AI
- **Neprovádíme** profilování ani automatizované rozhodování, které by tě právně nebo podobně významně ovlivnilo  
- **Neposíláme** tvůj obsah žádným AI službám a **nezpracováváme** ho pomocí umělé inteligence (stejně jako v ToS)

---

## 11) Změny tohoto dokumentu
Když se něco změní (třeba přidáme analytiku nebo nového poskytovatele), tuhle stránku **aktualizujeme** a o důležitých změnách dáme vědět v aplikaci.

---

## 12) Kontakt
**Správce**: Marek Hanzal, IČ 87911418  
**E‑mail**: **marek.hanzal@icloud.com**

---

## Příloha A: Přehled zpracovatelů (sub‑procesorů)
- **Vercel** – hosting aplikace; region EU preferován; logy/telemetrie jen v nezbytném rozsahu ([DPA](https://vercel.com/legal/dpa))
- **Neon (PostgreSQL)** – databáze; region **Frankfurt (DE)** ([DPA](https://neon.com/dpa))
- **Bunny.net** – CDN a úložiště obrázků; regiony EU preferovány ([GDPR](https://bunny.net/gdpr/))
- **Stripe** – zpracování plateb; čísla karet u nás neukládáme ([DPA](https://stripe.com/legal/dpa), [DTA](https://stripe.com/legal/dta))
- **Geoapify** – vyhledávání adres; dotazy jdou přímo poskytovateli ([Privacy](https://www.geoapify.com/privacy-policy/))

*Tento seznam se může měnit; aktuální znění vždy v této politice.*
