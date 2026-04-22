import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withListingCollectionSelectFx } from "~/seller/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/seller/listing/server/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/seller/listing/server/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/seller/listing/server/schema/ListingFilterSchema";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		scope: ListingFilterSchema.Type;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	filter,
	where,
	scope,
}: listingCountFx.Props) {
	const logger = yield* getLoggerFx("listingCountFx");
	logger.trace("listingCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withListingCollectionSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withListingQueryBuilderFx,
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
