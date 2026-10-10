import { Effect } from "effect";
import { withListingSelectFx } from "~/buyer-listing/db/withListingSelectFx";
import type { ListingQuerySchema } from "~/buyer-listing/schema/ListingQuerySchema";
import type { ListingWhereSchema } from "~/buyer-listing/schema/ListingWhereSchema";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { hasExplicitCategory } from "~/listing/fn/hasExplicitCategory";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace listingFetchFx {
	export interface Props extends ListingQuerySchema.Type {
		userId: string;
		scope: ListingWhereSchema.Type;
	}
}

export const listingFetchFx = Effect.fn("listingFetchFx")(function* ({
	userId,
	where,
	scope,
	sort,
	meta,
}: listingFetchFx.Props) {
	const logger = yield* getLoggerFx("listingFetchFx");
	logger.trace("listingFetchFx", {
		userId,
		where,
		scope,
		sort,
		meta,
	});

	return yield* withFetchFx({
		resource: "listing",
		selectFx: withListingSelectFx({
			userId,
			sort,
			meta,
			hasExplicitCategory: hasExplicitCategory([
				where,
				scope,
			]),
		}),
		where,
		scope,
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
