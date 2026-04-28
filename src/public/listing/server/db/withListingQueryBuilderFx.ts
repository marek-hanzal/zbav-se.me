import { Effect } from "effect";
import type { withListingSourceSelectFx } from "~/public/listing/server/db/withListingSourceSelectFx";
import type { ListingFilterSchema } from "~/public/listing/server/schema/ListingFilterSchema";
import type { ListingMetaSchema } from "~/public/listing/server/schema/ListingMetaSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace withListingQueryBuilderFx {
	export interface Props<TSelect extends withListingSourceSelectFx.Select> {
		select: TSelect;
		where?: ListingFilterSchema.Type;
		meta?: ListingMetaSchema.Type;
	}

	export type Callback<TSelect extends withListingSourceSelectFx.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

export const withListingQueryBuilderFx = Effect.fn("withListingQueryBuilderFx")(function* <
	TSelect extends withListingSourceSelectFx.Select,
>({ select, where, meta }: withListingQueryBuilderFx.Props<TSelect>) {
	const { kysely } = yield* KyselyContextFx;
	let query = select;

	if (!where) {
		return yield* Effect.succeed(query);
	}

	if (where.id) {
		query = query.where("l.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("l.id", "in", where.idIn) as TSelect;
	}

	if (where.fulltext) {
		const _fulltext = where.fulltext;

		// query = query.where((eb) => {
		// 	const categoryIdSelect = eb
		// 		.selectFrom("category as cat")
		// 		.select("cat.id")
		// 		.where((eb) =>
		// 			eb.or([
		// 				withLikeEx(eb.ref("cat.category"), fulltext),
		// 				withLikeEx(eb.ref("cat.group"), fulltext),
		// 			]),
		// 		);

		// 	return eb.or([
		// 		withNormalizedLikeEx(eb.ref("l.withTitleSearch"), fulltext, "both"),
		// 		eb("l.categoryId", "in", categoryIdSelect),
		// 	]);
		// }) as TSelect;
	}

	if (where.categoryId) {
		query = query.where("l.categoryId", "=", where.categoryId) as TSelect;
	}

	if (where.categoryIdIn && where.categoryIdIn.length > 0) {
		query = query.where("l.categoryId", "in", where.categoryIdIn) as TSelect;
	}

	return yield* Effect.succeed(query);
});
