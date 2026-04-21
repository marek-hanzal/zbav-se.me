import { Effect } from "effect";
import { match } from "ts-pattern";
import type { CategorySortSchema } from "~/public/category/server/schema/CategorySortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

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

	let query = kysely.selectFrom("category as cat").where("cat.restriction", "=", "none");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("group", () => query.orderBy("cat.group", item.order))
			.with("category", () => query.orderBy("cat.category", item.order))
			.with("sort", () => query.orderBy("cat.sort", item.order))
			.exhaustive();
	}

	return query;
});
