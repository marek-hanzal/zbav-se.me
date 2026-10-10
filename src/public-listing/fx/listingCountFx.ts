import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { hasExplicitCategoryFn } from "~/listing/fn/hasExplicitCategoryFn";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withListingSelectFx } from "~/public-listing/db/withListingSelectFx";
import type { ListingCountQuerySchema } from "~/public-listing/schema/ListingCountQuerySchema";
import type { ListingWhereSchema } from "~/public-listing/schema/ListingWhereSchema";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		scope: ListingWhereSchema.Type;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	where,
	scope,
	meta,
}: listingCountFx.Props) {
	const logger = yield* getLoggerFx("listingCountFx");
	logger.trace("listingCountFx", {
		where,
		scope,
		meta,
	});

	return yield* withCountFx({
		selectFx: withListingSelectFx({
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

export type listingCountFx = ReturnType<typeof listingCountFx>;
