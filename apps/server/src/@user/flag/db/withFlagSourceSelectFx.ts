import { Effect } from "effect";
import { match } from "ts-pattern";
import type { FlagSortSchema } from "~/@user/flag/schema/FlagSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withFlagSourceSelectFx {
	export interface Props {
		sort?: FlagSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withFlagSourceSelectFx>>;
}

export const withFlagSourceSelectFx = Effect.fn("withFlagSourceSelectFx")(function* ({
	sort,
}: withFlagSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("flag as f");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
