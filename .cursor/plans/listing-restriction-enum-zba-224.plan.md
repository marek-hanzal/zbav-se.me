---
name: ""
overview: ""
todos: []
isProject: false
---

# Plán: Listing – nový enum listing_restriction_enum (ZBA-224)

## Kontext z Linearu

Úkol [ZBA-224](https://linear.app/zbav-seme/issue/ZBA-224/listing-add-a-new-value-enum-listing-restriction-enum) požaduje přidat enum s hodnotami: **none** (běžné inzeráty), **adult**, **sensitive**, **restricted**. V MASTER.md existuje koncept Sensitivity se stejnou škálou; tento enum reprezentuje úroveň omezení inzerátu (draft/listing).

**Požadavek:** `restriction` je **všude povinné** – žádný default; uživatel musí vědomě vybrat úroveň (draft i listing).

---

## 1. Integrace do existujících migrací (bez nové migrace)

**Upravit stávající soubory:**

- **[apps/server/src/database/migrations/0009-draft.ts](apps/server/src/database/migrations/0009-draft.ts)**
  - Před vytvořením tabulky `draft`: přidat `createType("listing_restriction_enum").asEnum(["none", "adult", "sensitive", "restricted"])`.
  - V definici tabulky `draft`: přidat sloupec `.addColumn("restriction", sql\`listing_restriction_enum, (col) => col.notNull())`– **povinné, žádný default**; každý INSERT musí obsahovat`restriction`.
- **[apps/server/src/database/migrations/0010-listing.ts](apps/server/src/database/migrations/0010-listing.ts)**
  - Typ `listing_restriction_enum` už bude existovat z 0009 (není potřeba znovu vytvářet).
  - V definici tabulky `listing`: přidat sloupec `.addColumn("restriction", sql\`listing_restriction_enum, (col) => col.notNull())` – **povinné, žádný default**.

Pozn.: Pokud běží migrace jen jednou od nuly, je to v pořádku. Pokud už máte lokální DB na migraci 0031, budete muset buď resetovat DB, nebo dočasně ponechat novou migraci 0032 jen pro přidání sloupce (podle toho, jak se domluvíte). Plán předpokládá úpravu 0009 a 0010.

---

## 2. Zod enum a tabulkové schémy

- **Nový soubor:** [apps/server/src/database/@enum/ListingRestrictionEnumSchema.ts](apps/server/src/database/@enum/ListingRestrictionEnumSchema.ts)  
`z.enum(["none", "adult", "sensitive", "restricted"])` + openapi + export typu (vzor: [ListingPriceEnumSchema.ts](apps/server/src/database/@enum/ListingPriceEnumSchema.ts)).
- **[apps/server/src/database/@table/DraftTableSchema.ts](apps/server/src/database/@table/DraftTableSchema.ts)**  
Přidat `restriction: ListingRestrictionEnumSchema.openapi(...)` – **povinné** (bez null).
- **[apps/server/src/database/@table/ListingTableSchema.ts](apps/server/src/database/@table/ListingTableSchema.ts)**  
Přidat `restriction: ListingRestrictionEnumSchema.openapi(...)`.
- Aktualizovat [apps/server/src/database/@enum/README.md](apps/server/src/database/@enum/README.md).

---

## 3. API schémata a listing create

- **[apps/server/src/@seller-user/draft/schema/DraftCreateSchema.ts](apps/server/src/@seller-user/draft/schema/DraftCreateSchema.ts)**  
Přidat **povinné** `restriction: ListingRestrictionEnumSchema` – při vytváření draftu musí klient vždy poslat hodnotu (žádný default).  
**DraftPatchSchema** nemusíte měnit – používá `DraftTableSchema.shape`, takže patch automaticky bere `restriction`; při patchi je pole optional (partial), ale uložená hodnota je vždy jedna z enumů.
- **[apps/server/src/@seller-user/listing/schema/ListingCreateSchema.ts](apps/server/src/@seller-user/listing/schema/ListingCreateSchema.ts)**  
Přidat **povinné** `restriction: ListingRestrictionEnumSchema` – při vytváření listingu musí klient vždy poslat hodnotu (žádný default).
- **[apps/server/src/@seller-user/listing/fx/listingCreateFx.ts](apps/server/src/@seller-user/listing/fx/listingCreateFx.ts)**  
Do insertu zahrnout `restriction: data.restriction` (pole je povinné ve schématu, žádný fallback/default).

---

## 4. Veřejný endpoint pro enum

- **[apps/server/src/@public/enum/enum.ts](apps/server/src/@public/enum/enum.ts)**  
GET `/enum/listing-restriction`, `apiPublicEnumListingRestriction`, `ListingRestrictionEnumSchema.array()`, `keysOf(ListingRestrictionEnumSchema.enum)`.

---

## 5. SDK

- Po úpravě schémat spustit `**bun run sdk**`.

---

## 6. UI pro restriction v draftu

Cíl: uživatel může v editoru draftu vybrat a uložit úroveň restriction (none / adult / sensitive / restricted). Vzor: warranty (Value + Select + Patch).

**6.1 Společné komponenty v app (@common)**

- **Nový adresář:** [apps/app/src/app/@common/restriction/ui/](apps/app/src/app/@common/restriction/ui/)
  - **RestrictionValue.tsx** – zobrazení aktuální hodnoty (jako [WarrantyValue.tsx](apps/app/src/app/@common/warranty/ui/WarrantyValue.tsx)): `restriction: tListingRestrictionEnum` (v draftu vždy definované), label/hint, volitelný `action` a `onClick`.
  - **RestrictionSelect.tsx** – výběr **jedné** hodnoty z enumu (jako [WarrantySelect.tsx](apps/app/src/app/@common/warranty/ui/WarrantySelect.tsx)): tlačítka pro každou hodnotu z `tListingRestrictionEnum`, `useSelection` single mode; v draftu musí být vždy jedna vybraná hodnota.

**6.2 Patch v draft editoru**

- **Nový soubor:** [apps/app/src/app/@seller-user/draft/ui/patch/RestrictionPatch.tsx](apps/app/src/app/@seller-user/draft/ui/patch/RestrictionPatch.tsx)  
Vzor: [WarrantyPatch.tsx](apps/app/src/app/@seller-user/draft/ui/patch/WarrantyPatch.tsx): props `draft`, `onCancel`, `onSettled`; `useDraftPatch`; `useSelection` s initial `draft.restriction` (vždy jedna hodnota); ukládat **povinné** `restriction` (jedna z enum hodnot – např. při ukládání poslat `restriction: selection.optional.singleId() ?? draft.restriction` aby nebyl nikdy prázdný). Uvnitř `PatchContainer` použít `RestrictionSelect`.

**6.3 DraftEditor – nový view a řádek**

- **[apps/app/src/app/@seller-user/draft/ui/DraftEditor.tsx](apps/app/src/app/@seller-user/draft/ui/DraftEditor.tsx)**
  - Do typu `DraftEditor.View` přidat `"restriction"`.
  - V default view přidat řádek: `<RestrictionValue restriction={draft.restriction} action={<Icon ... />} onClick={() => setView("restriction")} />` (např. za WarrantyValue nebo před ConditionValue).
  - Do `views` přidat `restriction: { children: <RestrictionPatch draft={draft} onCancel={...} onSettled={...} /> }`.
  - Import `RestrictionValue` a `RestrictionPatch`.

**6.4 Překlady**

- Překlady se **generují automaticky** – není potřeba ručně dopisovat klíče do cs.yaml / en.yaml.

---

## Shrnutí závislostí

- Migrace 0009 + 0010 → DB má enum a sloupce.
- ListingRestrictionEnumSchema → DraftTableSchema, ListingTableSchema, DraftCreateSchema, ListingCreateSchema, Public enum endpoint.
- listingCreateFx → `restriction` povinné z payloadu (žádný default).
- SDK regenerace → typ `tListingRestrictionEnum` a endpoint pro select.
- @common/restriction (Value + Select) + RestrictionPatch + DraftEditor (view + řádek) + překlady = UI v draftu.

---

## Kontrolní seznam

- 0009-draft.ts: enum + sloupec `restriction` (NOT NULL, bez defaultu)
- 0010-listing.ts: sloupec `restriction` (NOT NULL, bez defaultu)
- ListingRestrictionEnumSchema.ts + DraftTableSchema + ListingTableSchema + @enum README
- DraftCreateSchema + ListingCreateSchema (restriction povinné) + listingCreateFx (bez defaultu)
- GET /enum/listing-restriction v enum.ts
- bun run sdk
- @common/restriction: RestrictionValue.tsx, RestrictionSelect.tsx
- RestrictionPatch.tsx
- DraftEditor: view "restriction", řádek RestrictionValue, RestrictionPatch v views
- Překlady: automaticky generované (nic ručně)
