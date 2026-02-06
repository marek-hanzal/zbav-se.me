import { Effect } from "effect";
import { match } from "ts-pattern";
import type { CategoryMissSortSchema } from "~/@session/category-miss/schema/CategoryMissSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withCategoryMissSelectFx {
	export interface Props {
		sort?: CategoryMissSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCategoryMissSelectFx>>;
}

export const withCategoryMissSelectFx = Effect.fn("withCategoryMissSelectFx")(function* ({
	sort,
}: withCategoryMissSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("category_miss as cm").selectAll("cm");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("category", () => query.orderBy("cm.category", item.order))
			.with("count", () => query.orderBy("cm.count", item.order))
			.with("updatedAt", () => query.orderBy("cm.updatedAt", item.order))
			.exhaustive();
	}

	return query;
});
