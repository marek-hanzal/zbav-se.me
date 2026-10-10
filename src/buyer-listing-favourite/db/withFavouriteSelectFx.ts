import { Effect } from "effect";
import { match } from "ts-pattern";
import type { FavouriteSortSchema } from "~/buyer-listing-favourite/schema/FavouriteSortSchema";
import type { FavouriteWhereSchema } from "~/buyer-listing-favourite/schema/FavouriteWhereSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { selectFx } from "~/database-query/fx/selectFx";

export namespace withFavouriteSelectFx {
	export interface Props {
		sort?: FavouriteSortSchema.Type[];
	}
}

export const withFavouriteSelectFx = Effect.fn("withFavouriteSelectFx")(function* ({
	sort,
}: withFavouriteSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("listing_favourite as f");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("f.createdAt", item.order))
			.exhaustive();
	}

	return selectFx({
		select: query.selectAll("f"),
		queryFx(select, where: FavouriteWhereSchema.Type) {
			return Effect.gen(function* () {
				let q = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					q = q.where("f.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					q = q.where("f.id", "in", where.idIn);
				}

				if (where.userId) {
					q = q.where("f.userId", "=", where.userId);
				}

				if (where.listingId) {
					q = q.where("f.listingId", "=", where.listingId);
				}

				return yield* Effect.succeed(q);
			});
		},
	});
});
