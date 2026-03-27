import { Effect } from "effect";
import { sql } from "kysely";
import type { withInboxSelectFx } from "~/client/@user/inbox/server/db/withInboxSelectFx";
import type { InboxFilterSchema } from "~/client/@user/inbox/server/schema/InboxFilterSchema";

export namespace withInboxQueryBuilderFx {
	export interface Props<TSelect extends withInboxSelectFx.Select> {
		select: TSelect;
		where?: InboxFilterSchema.Type;
	}

	export type Callback<TSelect extends withInboxSelectFx.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

export const withInboxQueryBuilderFx = Effect.fn("withInboxQueryBuilderFx")(function* <
	TSelect extends withInboxSelectFx.Select,
>({ select, where }: withInboxQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("i.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("i.id", "in", where.idIn) as TSelect;
	}

	if (where.userId) {
		query = query.where("i.userId", "=", where.userId) as TSelect;
	}

	if (where.reference) {
		query = query.where(
			sql<boolean>`${sql.ref("i.reference")} @> ARRAY[${where.reference}]::text[]`,
		) as TSelect;
	}

	if (where.referenceIn && where.referenceIn.length > 0) {
		query = query.where(
			sql<boolean>`${sql.ref("i.reference")} && ARRAY[${sql.join(where.referenceIn)}]::text[]`,
		) as TSelect;
	}

	if (where.referenceAllIn && where.referenceAllIn.length > 0) {
		query = query.where(
			sql<boolean>`${sql.ref("i.reference")} @> ARRAY[${sql.join(where.referenceAllIn)}]::text[]`,
		) as TSelect;
	}

	if (where.family) {
		query = query.where("i.family", "=", where.family) as TSelect;
	}

	if (where.type) {
		query = query.where("i.type", "=", where.type) as TSelect;
	}

	if (where.priority) {
		query = query.where("i.priority", "=", where.priority) as TSelect;
	}

	if (typeof where.archivedAtIsNull === "boolean") {
		query = where.archivedAtIsNull
			? (query.where("i.archivedAt", "is", null) as TSelect)
			: (query.where("i.archivedAt", "is not", null) as TSelect);
	}

	if (where.timestampGte) {
		query = query.where("i.timestamp", ">=", where.timestampGte) as TSelect;
	}

	if (where.timestampLte) {
		query = query.where("i.timestamp", "<=", where.timestampLte) as TSelect;
	}

	return yield* Effect.succeed(query);
});
