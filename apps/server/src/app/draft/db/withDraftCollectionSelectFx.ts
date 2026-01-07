import { Effect } from "effect";
import { match } from "ts-pattern";
import type { DraftSortSchema } from "~/app/draft/schema/DraftSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withDraftCollectionSelectFx {
	export interface Props {
		sort?: DraftSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withDraftCollectionSelectFx>>;
}

export const withDraftCollectionSelectFx = Effect.fn("withDraftCollectionSelectFx")(function* ({
	sort,
}: withDraftCollectionSelectFx.Props) {
	const kysely = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("draft as d")
		.leftJoin("location as loc", "loc.id", "d.locationId")
		.leftJoin("category as cat", "cat.id", "d.categoryId")
		.select("d.id");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("d.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("d.updatedAt", item.direction))
			.exhaustive();
	}

	return query;
});
