import { Effect } from "effect";
import { match } from "ts-pattern";
import type { FlagSortSchema } from "~/app/flag/schema/FlagSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withFlagSelectFx {
	export interface Props {
		sort?: FlagSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFlagSelectFx>>;
}

export const withFlagSelectFx = Effect.fn("withFlagSelectFx")(function* ({
	sort,
}: withFlagSelectFx.Props) {
	const kysely = yield* KyselyContextFx;

	let query = kysely.selectFrom("flag as f").select([
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
