import { Effect } from "effect";
import { match } from "ts-pattern";
import type { ListingEventSortSchema } from "~/buyer-listing-event/schema/ListingEventSortSchema";
import type { ListingEventWhereSchema } from "~/buyer-listing-event/schema/ListingEventWhereSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { selectFx } from "~/database-query/fx/selectFx";

export namespace withListingEventSelectFx {
	export interface Props {
		sort?: ListingEventSortSchema.Type[];
	}
}

export const withListingEventSelectFx = Effect.fn("withListingEventSelectFx")(function* ({
	sort,
}: withListingEventSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely.selectFrom("listing_event as le");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("le.createdAt", item.order))
			.exhaustive();
	}

	return selectFx({
		select: query.selectAll("le"),
		queryFx(select, where: ListingEventWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("le.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("le.id", "in", where.idIn);
				}

				if (where.listingId) {
					query = query.where("le.listingId", "=", where.listingId);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
