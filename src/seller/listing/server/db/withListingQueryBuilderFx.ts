import { Effect } from "effect";
import type { withListingSourceSelectFx } from "~/seller/listing/server/db/withListingSourceSelectFx";
import type { ListingFilterSchema } from "~/seller/listing/server/schema/ListingFilterSchema";

export namespace withListingQueryBuilderFx {
	export interface Props<TSelect extends withListingSourceSelectFx.Select> {
		select: TSelect;
		where?: ListingFilterSchema.Type;
	}

	export type Callback<TSelect extends withListingSourceSelectFx.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

export const withListingQueryBuilderFx = Effect.fn("withListingQueryBuilderFx")(function* <
	TSelect extends withListingSourceSelectFx.Select,
>({ select, where }: withListingQueryBuilderFx.Props<TSelect>) {
	let query = select;

	if (!where) {
		return yield* Effect.succeed(select);
	}

	if (where.id) {
		query = query.where("l.id", "=", where.id) as TSelect;
	}

	if (where.idIn && where.idIn.length > 0) {
		query = query.where("l.id", "in", where.idIn) as TSelect;
	}

	if (where.fulltext) {
		const fulltext = where.fulltext;

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

	if (where.userId) {
		query = query.where("l.userId", "=", where.userId) as TSelect;
	}

	return yield* Effect.succeed(query);
});
