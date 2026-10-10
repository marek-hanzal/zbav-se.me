import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { hasExplicitCategoryFn } from "~/listing/fn/hasExplicitCategoryFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withListingSelectFx } from "~/public-listing/db/withListingSelectFx";
import type { ListingQuerySchema } from "~/public-listing/schema/ListingQuerySchema";
import type { ListingWhereSchema } from "~/public-listing/schema/ListingWhereSchema";

export namespace listingFetchFx {
	export interface Props extends ListingQuerySchema.Type {
		scope: ListingWhereSchema.Type;
	}
}

export const listingFetchFx = Effect.fn("listingFetchFx")(function* ({
	where,
	scope,
	sort,
	meta,
}: listingFetchFx.Props) {
	const logger = yield* getLoggerFx("listingFetchFx");
	logger.trace("listingFetchFx", {
		where,
		scope,
		sort,
		meta,
	});

	return yield* withFetchFx({
		resource: "listing",
		selectFx: withListingSelectFx({
			sort,
			meta,
			hasExplicitCategory: hasExplicitCategoryFn([
				where,
				scope,
			]),
		}),
		where,
		scope,
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
