import { Effect } from "effect";
import { match } from "ts-pattern";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import type { CategoryMissSortSchema } from "../schema/CategoryMissSortSchema";

export namespace withCategoryMissSelectFx {
	export interface Props {
		sort?: CategoryMissSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withCategoryMissSelectFx>>;
}

export const withCategoryMissSelectFx = Effect.fn("withCategoryMissSelectFx")(function* ({
	sort,
}: withCategoryMissSelectFx.Props) {
	const database = yield* DatabaseContextFx;

	let query = database.selectFrom("category_miss as cm").selectAll("cm");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("category", () => query.orderBy("cm.category", item.direction))
			.with("count", () => query.orderBy("cm.count", item.direction))
			.with("updatedAt", () => query.orderBy("cm.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
});
