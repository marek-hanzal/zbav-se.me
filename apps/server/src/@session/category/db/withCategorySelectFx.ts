import { Effect } from "effect";
import { match } from "ts-pattern";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import type { CategorySortSchema } from "../schema/CategorySortSchema";

export namespace withCategorySelectFx {
	export interface Props {
		sort?: CategorySortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCategorySelectFx>>;
}

export const withCategorySelectFx = Effect.fn("withCategorySelectFx")(function* ({
	sort,
}: withCategorySelectFx.Props) {
	const database = yield* DatabaseContextFx;

	let query = database.selectFrom("category as cat").selectAll("cat");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("group", () => query.orderBy("cat.group", item.direction))
			.with("category", () => query.orderBy("cat.category", item.direction))
			.with("sort", () => query.orderBy("cat.sort", item.direction))
			.exhaustive();
	}

	return query;
});
