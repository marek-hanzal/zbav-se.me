---
key: search
title: Hledání
summary: Jak funguje hledání a jaký je rozdíl mezi hledáním a feedem
related:
  - feed
  - listing
---

Hledání je rychlá cesta, jak si najít to, co tě právě teď zajímá.

Na první pohled se může tvářit jinak než feed, ale uvnitř funguje na stejném základu. Používá stejný engine, stejné filtry a stejná pravidla zobrazení inzerátů.

Rozdíl je hlavně v tom, k čemu slouží:

- **Hledání** je rychlá, vždy dostupná volba pro okamžité filtrování a procházení nabídky.
- **Feed** je uložený seznam nebo uložený pohled, který sis vědomě vytvořil jako svůj vlastní.

Prakticky:
- v hledání si nastavíš dotaz, filtry, lokaci, radius nebo řazení,
- systém si tenhle stav automaticky pamatuje,
- když se do hledání vrátíš, najdeš ho tak, jak jsi ho nechal.

To je důležité:
- hledání se ukládá automaticky,
- nemusíš ho ručně zakládat,
- je dostupné vždycky,
- nezabírá místo mezi tvými uloženými feedy.

Uvnitř systému existuje hledání jako speciální feed typu `search`, ale pro tebe to není běžný uložený feed.

Co to znamená:
- `search` je jen jeden,
- není vidět v sekci „Moje seznamy“,
- nespravuješ ho jako normální feed,
- nepočítá se do limitu uložených feedů.

Feed oproti tomu funguje jinak:
- feed si ukládáš vědomě jako vlastní seznam,
- můžeš jich mít víc,
- zobrazují se mezi tvými uloženými seznamy,
- počítají se do limitu feedů.

Důležité je, že hledání ani feed neobchází pravidla systému.

Platí pro ně stejně:
- citlivost obsahu,
- ignorované inzeráty,
- stav inzerátu,
- release window,
- a další pravidla zobrazení.

Když si v hledání nastavíš něco, co chceš používat dlouhodobě, můžeš si to uložit jako běžný feed.

To znamená:
- z aktuálního hledání vznikne nový uložený feed typu `user`,
- ten se pak objeví v „Moje seznamy“,
- a začne se počítat do limitu uložených feedů.

Hledání má i rychlý reset:
- vrátí dotaz a filtry do neutrálu,
- smaže starý stav hledání,
- a vytvoří nový čistý hledací kontext.

Stručně:
Hledání je vždy dostupný, automaticky ukládaný pracovní pohled nad nabídkou. Feed je oproti tomu uložený seznam, který sis vytvořil vědomě a držíš si ho natrvalo.
