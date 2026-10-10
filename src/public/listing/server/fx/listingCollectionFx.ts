import { Effect } from "effect";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import type { ListingQuerySchema } from "~/public/listing/server/schema/ListingQuerySchema";
import { withListingSelectFx } from "../db/withListingSelectFx";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

export namespace listingCollectionFx {
	export interface Props extends ListingQuerySchema.Type {
		scope: ListingWhereSchema.Type;
	}
}

export const listingCollectionFx = Effect.fn("listingCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	meta,
	limit,
}: listingCollectionFx.Props) {
	const logger = yield* getLoggerFx("listingCollectionFx");
	logger.trace("listingCollectionFx", {
		cursor,
		where,
		scope,
		sort,
		meta,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withListingSelectFx({
			sort,
			meta,
			hasExplicitCategory: hasExplicitCategory([
				where,
				scope,
			]),
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
