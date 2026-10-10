import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withListingSelectFx } from "~/seller-listing/db/withListingSelectFx";
import type { ListingQuerySchema } from "~/seller-listing/schema/ListingQuerySchema";
import type { ListingWhereSchema } from "~/seller-listing/schema/ListingWhereSchema";

export namespace listingCollectionFx {
	export interface Props extends ListingQuerySchema.Type {
		userId: string;
		scope: ListingWhereSchema.Type;
	}
}

export const listingCollectionFx = Effect.fn("listingCollectionFx")(function* ({
	userId,
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	limit,
}: listingCollectionFx.Props) {
	const logger = yield* getLoggerFx("listingCollectionFx");
	logger.trace("listingCollectionFx", {
		cursor,
		where,
		scope,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withListingSelectFx({
			userId,
			sort,
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
