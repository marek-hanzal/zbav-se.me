import { Effect } from "effect";
import { match } from "ts-pattern";
import type { FlagSortSchema } from "~/app/flag/schema/FlagSortSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withFlagSelectFx {
	export interface Props {
		sort?: FlagSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFlagSelectFx>>;
}

export const withFlagSelectFx = Effect.fn("withFlagSelectFx")(function* ({
	sort,
}: withFlagSelectFx.Props) {
	const database = yield* DatabaseContextFx;

	let query = database.selectFrom("flag as f").select([
		"f.id",
		"f.listingId",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
