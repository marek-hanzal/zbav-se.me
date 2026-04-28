import { Effect } from "effect";
import { match } from "ts-pattern";
import type { ListingSortSchema } from "~/seller/listing/server/schema/ListingSortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace withListingSourceSelectFx {
	export interface Props {
		sort?: ListingSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingSourceSelectFx>>;
}

export const withListingSourceSelectFx = Effect.fn("withListingSourceSelectFx")(function* ({
	sort,
}: withListingSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("listing as l");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("l.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("l.updatedAt", item.order))
			.with("expiresAt", () => query.orderBy("l.expiresAt", item.order))
			.exhaustive();
	}

	return query;
});
