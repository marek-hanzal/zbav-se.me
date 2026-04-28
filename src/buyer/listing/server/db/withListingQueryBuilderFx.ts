import { Effect } from "effect";
import type { withListingSourceSelectFx } from "~/buyer/listing/server/db/withListingSourceSelectFx";
import type { ListingFilterSchema } from "~/buyer/listing/server/schema/ListingFilterSchema";
import type { ListingMetaSchema } from "~/buyer/listing/server/schema/ListingMetaSchema";

export namespace withListingQueryBuilderFx {
	export interface Props<TSelect extends withListingSourceSelectFx.Select> {
		userId: string;
		select: TSelect;
		where?: ListingFilterSchema.Type;
		meta?: ListingMetaSchema.Type;
	}

	export type Callback<TSelect extends withListingSourceSelectFx.Select> = (
		props: Props<TSelect>,
	) => TSelect;
}

/**
 * Standalone query builder that applies all filters from ListingQuerySchema
 * Can be used by both list and count queries to ensure consistency
 */
export const withListingQueryBuilderFx = Effect.fn("withListingQueryBuilderFx")(function* <
	TSelect extends withListingSourceSelectFx.Select,
>({ userId, select, where, meta }: withListingQueryBuilderFx.Props<TSelect>) {
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

	if (where.userId) {
		query = query.where("l.userId", "=", where.userId) as TSelect;
	}

	if (where.categoryId) {
		query = query.where("l.categoryId", "=", where.categoryId) as TSelect;
	}

	if (where.categoryIdIn && where.categoryIdIn.length > 0) {
		query = query.where("l.categoryId", "in", where.categoryIdIn) as TSelect;
	}

	if (where.withOwn === false) {
		query = query.where("l.userId", "!=", userId) as TSelect;
	}

	if (where.my === true) {
		query = query.where("l.userId", "=", userId) as TSelect;
	}

	if (where.withIgnored !== undefined && where.withIgnored !== true) {
		query = query.where(({ not, exists, selectFrom }) =>
			not(
				exists(
					selectFrom("ignore as i")
						.select("i.listingId")
						.whereRef("i.listingId", "=", "l.id")
						.where("i.userId", "=", userId),
				),
			),
		) as TSelect;
	}

	if (where.isFavourite === true) {
		query = query.where(({ exists, selectFrom }) =>
			exists(
				selectFrom("favourite as f")
					.select("f.listingId")
					.whereRef("f.listingId", "=", "l.id")
					.where("f.userId", "=", userId),
			),
		) as TSelect;
	}

	return yield* Effect.succeed(query);
});
