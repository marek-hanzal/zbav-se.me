import { Effect } from "effect";
import { match } from "ts-pattern";
import type { IgnoreSortSchema } from "~/@buyer/ignore/schema/IgnoreSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withIgnoreSourceSelectFx {
	export interface Props {
		sort?: IgnoreSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withIgnoreSourceSelectFx>>;
}

export const withIgnoreSourceSelectFx = Effect.fn("withIgnoreSourceSelectFx")(function* ({
	sort,
}: withIgnoreSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("ignore as i");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("i.createdAt", item.order))
			.exhaustive();
	}

	return query;
});
