import { Effect } from "effect";
import { match } from "ts-pattern";
import type { IgnoreSortSchema } from "~/app/ignore/schema/IgnoreSortSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withIgnoreSelectFx {
	export interface Props {
		sort?: IgnoreSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withIgnoreSelectFx>>;
}

export const withIgnoreSelectFx = Effect.fn("withIgnoreSelectFx")(function* ({
	sort,
}: withIgnoreSelectFx.Props) {
	const database = yield* DatabaseContextFx;

	let query = database.selectFrom("ignore as i").select([
		"i.id",
		"i.listingId",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("i.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
