# GDPR Záznam – Analytika skóre inzerátů

**Verze dokumentu:** 1.0  
**Poslední aktualizace:** 2025-11-07  
**Vlastník:** zbav-se.me (pouze interní záznam)

---

## Účel
Vyhodnocování výkonu inzerátů na platformě zbav-se.me.  
Systém automaticky přiřazuje číselné skóre na základě anonymních/pseudonymních interakcí uživatelů (zobrazení, doba zhlédnutí, kliky, signály zájmu).  
Cílem je poskytovat prodejcům agregovaný ukazatel „žhavosti“ inzerátu bez odhalení osobních údajů uživatelů.

---

## Zpracovávané údaje
| Kategorie | Příklad | Poznámka |
|-----------|---------|---------|
| Interakční události | doba zobrazení, timeoutové skóre, signály zájmu | Uloženo proti internímu uživatelskému ID pouze pro technické zpracování |
| Metadata inzerátu | kategorie, cena, stav, stáří | Pouze pro kontext inzerátu |
| Identifikátor uživatele | interní ID nebo e-mail (v tabulkách skóre pseudonymizováno) | Nikdy se nezobrazuje externě |

---

## Právní základ
**Čl. 6 odst. 1 písm. f) – Oprávněný zájem**  
Provozovatel má oprávněný zájem analyzovat engagement s inzeráty za účelem zlepšování kvality služby a poskytování agregovaných metrik prodejcům.

Údaje se nepoužívají pro marketing, individuální profilování uživatelů ani se nesdílejí s třetími stranami.  
Zpracování je omezeno na nezbytný rozsah.

---

## Shrnutí vyvažovacího testu (balancing test)
| Faktor | Hodnocení |
|--------|-----------|
| **Účel** | Interní analytika a zlepšování funkcí |
| **Minimalizace** | Logujeme pouze nezbytná eventová data; žádné citlivé údaje |
| **Dopad na uživatele** | Žádný negativní/právní efekt; uživatelé nejsou identifikováni |
| **Záruky** | Pseudonymizace, interní přístupy pouze pro backend, agregace před zobrazením |
| **Závěr** | Oprávněný zájem převažuje; nízké soukromě-právní riziko |

---

## Doba uchování a bezpečnost
- Surové interakční logy: **max. 90 dní**  
- Agregovaná skóre: po dobu existence inzerátu  
- Přístupy omezeny na backendové služby; nepublikováno přes veřejné API  
- Přenos šifrován (HTTPS, TLS 1.3)

---

## Transparentnost
Do Zásad ochrany osobních údajů je vloženo:

> „Systém automaticky vyhodnocuje úspěšnost inzerátů na základě anonymizovaných interakcí uživatelů. Statistiky zobrazujeme pouze v agregované podobě a neumožňují identifikovat konkrétní uživatele.“

---

## Revize
Dokument revidovat minimálně jednou ročně nebo při změně rozsahu analytiky  
(např. pokud by skóre začalo ovlivňovat doporučování, řazení či cílení).

---

*Konec dokumentu.*
