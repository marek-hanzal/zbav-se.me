import { Effect } from "effect";
import { match } from "ts-pattern";
import type { DraftSortSchema } from "~/seller/draft/server/schema/DraftSortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace withDraftSourceSelectFx {
	export interface Props {
		sort?: DraftSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withDraftSourceSelectFx>>;
}

export const withDraftSourceSelectFx = Effect.fn("withDraftSourceSelectFx")(function* ({
	sort,
}: withDraftSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("draft as d");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("d.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("d.updatedAt", item.order))
			.exhaustive();
	}

	return query;
});
