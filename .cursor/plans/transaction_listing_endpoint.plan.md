# Vytvoření endpointu transaction-listing

## Cíl

Vytvořit novou doménu `transaction-listing`, která vrací unikátní seznam inzerátů, které mají transakce. Seřazeno podle `createdAt` inzerátu. Toto zlepší organizaci pro prodejce - jako první krok před vstupem do zpráv.

## Struktura souborů

Vytvoříme novou doménu v `apps/server/src/@user/transaction-listing/` s následující strukturou:

### 1. Schémata (`schema/`)

- `TransactionListingQuerySchema.ts` - Query schema pro request
- `TransactionListingFilterSchema.ts` - Filter schema (SRP - specifické pro transaction-listing)
- `TransactionListingSortSchema.ts` - Sort schema (pouze createdAt pro inzeráty)
- `TransactionListingSchema.ts` - Response schema (můžeme znovu použít ListingSchema nebo vytvořit specifický)

### 2. Databázové vrstvy (`db/`)

- `withTransactionListingCollectionSelectFx.ts` - Select query, který:
  - Začíná od `listing` tabulky
  - Používá `WHERE l.id IN (SELECT DISTINCT listingId FROM transaction WHERE ...)` pro filtrování pouze inzerátů s transakcemi
  - Používá Kysely query builder
  - Řadí podle `l.createdAt` (defaultně DESC)
  - Vrací pouze `l.id` pro collection select

- `withTransactionListingQueryBuilderFx.ts` - Query builder pro filtry:
  - Podporuje `userId` (pro prodejce - filtruje podle `l.userId`)
  - Používá Kysely query builder
  - Může podporovat další filtry podle potřeby

### 3. Business logika (`fx/`)

- `transactionListingCollectionFx.ts` - Hlavní collection function:
  - Používá `withCollectionFx` z `@use-pico/common/collection`
  - Volá `withTransactionListingCollectionSelectFx` pro select
  - Volá `withTransactionListingQueryBuilderFx` pro filtry
  - Podporuje cursor pagination

### 4. API vrstva (`@user/transaction-listing/`)

- `collection.ts` - API endpoint:
  - POST `/api/user/transaction-listing/collection`
  - Používá `TransactionListingQuerySchema`
  - Vrací `TransactionListingCollection` (nebo ListingCollection)
  - Scope: `{ userId: user.id }` (pro prodejce - pouze jejich inzeráty)

- `withTransactionListingApiFx.ts` - API setup:
  - Registruje collection endpoint
  - Exportuje Effect pro registraci v `withUserApiFx`

### 5. Registrace

- Přidat `withTransactionListingApiFx()` do `apps/server/src/@user/withUserApiFx.ts`

## Implementační detaily

### Query logika (Kysely)

```typescript
kysely
  .selectFrom("listing as l")
  .innerJoin("location as loc", "loc.id", "l.locationId")
  .innerJoin("category as cat", "cat.id", "l.categoryId")
  .where("l.id", "in", (eb) =>
    eb
      .selectFrom("transaction as lt")
      .innerJoin("listing as l2", "l2.id", "lt.listingId")
      .select("lt.listingId")
      .distinct()
      .where("l2.userId", "=", userId) // pro prodejce - pouze inzeráty uživatele
  )
  .where("l.userId", "=", userId) // také filtrujeme podle userId na hlavní query
  .select("l.id")
  .orderBy("l.createdAt", "desc")
```

Nebo pokud potřebujeme filtrovat transakce podle statusu:

```typescript
.where("l.id", "in", (eb) =>
  eb
    .selectFrom("transaction as lt")
    .innerJoin("transaction_status as lts", (join) => ...)
    .select("lt.listingId")
    .distinct()
    .where(...)
)
```

### Select pro full data

Použijeme `withListingSelectFx` pro získání plných dat inzerátu (stejně jako v listing collection), ale filtrované pouze na inzeráty s transakcemi pomocí WHERE IN subquery.

### Filtrování

- Scope: `{ userId: user.id }` - pouze inzeráty, kde je uživatel prodejce
- Subquery v WHERE IN filtruje transakce podle userId (prodejce = listing.userId)

## Soubory k vytvoření

1. `apps/server/src/@user/transaction-listing/schema/TransactionListingQuerySchema.ts`
2. `apps/server/src/@user/transaction-listing/schema/TransactionListingFilterSchema.ts`
3. `apps/server/src/@user/transaction-listing/schema/TransactionListingSortSchema.ts`
4. `apps/server/src/@user/transaction-listing/db/withTransactionListingCollectionSelectFx.ts`
5. `apps/server/src/@user/transaction-listing/db/withTransactionListingQueryBuilderFx.ts`
6. `apps/server/src/@user/transaction-listing/fx/transactionListingCollectionFx.ts`
7. `apps/server/src/@user/transaction-listing/collection.ts`
8. `apps/server/src/@user/transaction-listing/withTransactionListingApiFx.ts`

## Soubory k úpravě

1. `apps/server/src/@user/withUserApiFx.ts` - přidat registraci nového API

## Poznámky

- Endpoint bude vracet stejnou strukturu jako listing collection (ListingSchema)
- Seřazení bude podle `l.createdAt` (nejnovější první)
- Pouze inzeráty, kde má uživatel transakce jako prodejce
- Unikátní inzeráty (jeden inzerát může mít více transakcí)
- Používá WHERE IN subquery místo JOIN + DISTINCT
- Všechny dotazy používají Kysely query builder
- Schémata jsou specifická pro transaction-listing (SRP)