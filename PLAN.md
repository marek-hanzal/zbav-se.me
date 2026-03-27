# Apps/App Domain Refactor With Hard Review Gates

## Summary
Refaktor rozdělíme na malé, reviewable bloky a budeme zastavovat nejen po milnících, ale i po typech změn, které mají vysoké riziko:
- po větším přesunu souborů,
- po vytvoření nové strukturální sady souborů/složek,
- před přepojením consumerů na nový surface,
- po zavedení nového contractu.

Cíl je, aby každý stop byl malý, srozumitelný diff, ne jedna obří stěhovací mrdka.

## Hard Review Gates
- `G1 Move Stop`: zastavit po každém přesunu většího bloku souborů.
  - Pravidlo: jakmile blok přesune víc než cca `10-15` souborů nebo celou jednu feature subtree, stop.
- `G2 Scaffold Stop`: zastavit hned po vytvoření nové sady složek/souborů.
  - Typicky: nové `ui/`, `query/`, `mutation/`, `server/`, nové `index.ts` chainy, nové `~public` re-exporty.
  - V tomhle stopu ještě nepřepojovat consumer importy dál, jen ukázat nový skeleton.
- `G3 Contract Stop`: zastavit po zavedení nového contractu/schema/query surface.
  - Typicky nový `public` listing.
- `G4 Rewire Stop`: zastavit po každém větším přepojení importů/consumerů na nový domov.
- `G5 Cleanup Stop`: zastavit po každém cleanup bloku, který už není jen move, ale mění strukturu kódu.

## Execution Blocks

### 0. Baseline
- Vytvořit boundary audit a migrační mapu.
- Zapsat cílový layout pro každou doménu.
- `STOP 0`: review jen dokumentace a cílové mapy.

### 1. UI Relocation
- `1A Scaffold`
  - připravit target `ui/` layout a barrel chainy pro první buyer feature roots
  - `STOP 1A` podle `G2`
- `1B Move`
  - přesunout buyer jednoduché screeny:
    - `favourite/FavouriteListPage`
    - `search/SearchPage`
    - `feed/FeedListPage`
  - opravit lokální importy a exporty
  - `STOP 1B` podle `G1`
- `1C Move`
  - přesunout buyer složitější UI:
    - `feed/FeedEditor`
    - `feed/FeedListingPage`
    - `transaction/TransactionDetailPage`
    - `transaction/TransactionListPage`
  - `STOP 1C` podle `G1`
- `1D Move`
  - přesunout seller UI trees
  - `STOP 1D`
- `1E Move`
  - přesunout user/common UI trees
  - `STOP 1E`

Pravidlo:
- jakmile se zakládá nový `ui` subtree, nejdřív scaffold stop
- až potom move stop

### 2. Query/Mutation Relocation
- `2A Scaffold`
  - založit `query/` a `mutation/` tam, kde dnes chybí
  - doplnit `index.ts`
  - `STOP 2A` podle `G2`
- `2B Move`
  - buyer wrappers do `query/` a `mutation/`
  - `STOP 2B`
- `2C Move`
  - seller wrappers do `query/` a `mutation/`
  - `STOP 2C`
- `2D Move`
  - user/session/public/common wrappers do `query/` a `mutation/`
  - `STOP 2D`

Pravidlo:
- `with*Query` vždy do `query/`
- `with*Mutation` vždy do `mutation/`
- `service/` a `hook/` zůstávají bokem

### 3. Server Co-location
- `3A Scaffold`
  - založit feature-local `server/` targety a barrel chainy
  - `STOP 3A` podle `G2`
- `3B Move`
  - přesunout buyer server features
  - `STOP 3B` podle `G1`
- `3C Move`
  - přesunout seller server features
  - `STOP 3C`
- `3D Move`
  - přesunout user feature server trees:
    - `inbox`
    - `transaction`
    - `transaction-entry`
    - `transaction-user`
  - `STOP 3D`
- `3E Move`
  - přesunout user infra server trees:
    - `upload`
    - `gallery`
    - `gallery-item`
    - `s3`
    - případně `user-event`, `user-ex`
  - `STOP 3E`

Cílový shape:
- `client/@buyer/<feature>/server/*`
- `client/@seller/<feature>/server/*`
- `client/@user/<feature>/server/*`

### 4. Public Listing Surface
- `4A Contract`
  - vytvořit nový `public` listing contract
  - první shape bude `card-ready`
  - `STOP 4A` podle `G3`
- `4B Scaffold`
  - vytvořit nový `client/@public/listing/{server,query,ui,~public?}` skeleton
  - `STOP 4B` podle `G2`
- `4C Provider Move`
  - doplnit public listing query/fetch/server implementation
  - `STOP 4C` podle `G3`
- `4D Rewire`
  - přepnout první generic consumery:
    - hlavně `@user/inbox`
  - `STOP 4D` podle `G4`
- `4E Rewire`
  - přepnout další non-user-specific listing consumers, pokud existují
  - `STOP 4E`

Varianty listingu:
- `buyer` = buyer-specific
- `seller` = seller-specific
- `public` = bez user/session-specific dat

### 5. Schema And Cleanup
- `5A Schema`
  - normalizovat object schema nodes
  - `STOP 5A` podle `G5`
- `5B Auth`
  - vytáhnout auth route UI do page komponent a shared shellu
  - `STOP 5B`
- `5C Local Simplification`
  - `FeedEditor`
  - `PricePatch`
  - `TransactionList`
  - `STOP 5C`

## What I Show At Each Stop
- seznam přesunutých nebo nově vytvořených souborů
- které `index.ts`/barrels se měnily
- které import path patterns se změnily
- co přesně máš zreviewovat
- co jsem záměrně ještě nepřepojil dál

## Test Plan
- po každém stopu `bun run workflow:check`
- po `2D`, `3E`, `4D`, `5C` cílený smoke check dotčených flows
- po celé sérii `bun run test`

## Assumptions
- `ui/` je správný domov i pro page/screen component trees
- shared infra z dnešního `server/@user` zůstává pod `@user`
- `public` listing je nový canonical generic listing surface
- cross-domain cleanup se nebude míchat do move bloků, kromě přepnutí consumerů na `public` listing
