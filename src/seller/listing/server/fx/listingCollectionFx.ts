import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withListingCollectionSelectFx } from "~/seller/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/seller/listing/server/db/withListingQueryBuilderFx";
import type { ListingFilterSchema } from "~/seller/listing/server/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/seller/listing/server/schema/ListingQuerySchema";

export namespace listingCollectionFx {
	export interface Scope extends ListingFilterSchema.Type {
		userId: string;
	}

	export interface Props extends ListingQuerySchema.Type {
		scope: Scope;
	}
}

export const listingCollectionFx = Effect.fn("listingCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	filter,
	where,
	scope,
	sort,
	limit,
}: listingCollectionFx.Props) {
	const logger = yield* getLoggerFx("listingCollectionFx");
	logger.trace("listingCollectionFx", {
		cursor,
		filter,
		where,
		scope,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withListingCollectionSelectFx({
			sort,
			userId: scope.userId,
		}),
		cursor,
		filter,
		where,
		scope,
		queryFx: withListingQueryBuilderFx,
		limit,
	});
});

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
