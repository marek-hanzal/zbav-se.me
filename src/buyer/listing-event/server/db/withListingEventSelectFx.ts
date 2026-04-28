import { Effect } from "effect";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { ListingEventFilterSchema } from "../schema/ListingEventFilterSchema";
import type { ListingEventSortSchema } from "../schema/ListingEventSortSchema";

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
		queryFx(select, where: ListingEventFilterSchema.Type) {
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
