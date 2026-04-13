---
key: messages
title: Zprávy
summary: Jak funguje chat mezi kupujícím a prodejcem.
related:
  - transactions-states
  - transaction-expiration
---

Zprávy patří k transakcím a slouží k domluvě mezi kupujícím a prodejcem.
Každá nová zpráva se počítá jako aktivita v inboxu a může ovlivnit unread stav.
Když je transakce uzavřená nebo vyřešená, další práce se zprávami už se řídí stavem transakce.

Důležité je ovšem rozlišit, zda se jedná skutečně o zprávu (interně transaction) nebo inbox (notifikace), tyto
dvě věci se mohou navzájem zaměnit.
