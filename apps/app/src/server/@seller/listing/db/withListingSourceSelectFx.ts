import { Effect } from "effect";
import { match } from "ts-pattern";
import type { ListingSortSchema } from "~/server/@seller/listing/schema/ListingSortSchema";
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

	let query = kysely
		.selectFrom("listing as l")
		.innerJoin("location as loc", "loc.id", "l.locationId")
		.innerJoin("category as cat", "cat.id", "l.categoryId");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("price", () => query.orderBy("l.price", item.order))
			.with("condition", () => query.orderBy("l.condition", item.order))
			.with("age", () => query.orderBy("l.age", item.order))
			.with("createdAt", () => query.orderBy("l.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("l.updatedAt", item.order))
			.with("expiresAt", () => query.orderBy("l.expiresAt", item.order))
			.exhaustive();
	}

	return query;
});
