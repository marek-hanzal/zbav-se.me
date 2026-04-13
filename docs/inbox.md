---
key: inbox
title: Oznámení
summary: Systém oznámení a jak s ním pracovat
---

Oznámení jsou události interakcí mezi uživateli, důležitá oznámení jsou označená "priority: high",
ostatní pak jako "priority: common".

Pozor, v rámci konverzace se může stát, že se zamění význam "zprávy" pro inbox i transakce (skutečné zprávy), tzn.
je třeba mít jistotu, že se jedná o inbox.

Pro získání obsahu je potřeba prozkoumat, co daná inbox je zač, e.g. "family: transaction" má dostupnou payload pro získání
transakce (transactionId), kterou pak dál lze použít jako vstup do transaction (hlavička zpráv)/transaction-entry (jednotlivé položky
v rámci transakce/konverzace).
