import { Effect } from "effect";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { CategorySortSchema } from "~/user/category/server/schema/CategorySortSchema";

export namespace withCategorySourceSelectFx {
	export interface Props {
		sort?: CategorySortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCategorySourceSelectFx>>;
}

export const withCategorySourceSelectFx = Effect.fn("withCategorySourceSelectFx")(function* ({
	sort,
}: withCategorySourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("category as cat");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("group", () => query.orderBy("cat.group", item.order))
			.with("category", () => query.orderBy("cat.category", item.order))
			.with("sort", () => query.orderBy("cat.sort", item.order))
			.exhaustive();
	}

	return query;
});
