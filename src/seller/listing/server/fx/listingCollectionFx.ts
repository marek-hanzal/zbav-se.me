import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingFilterSchema } from "~/seller/listing/server/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/seller/listing/server/schema/ListingQuerySchema";
import { withListingSelectFx } from "../db/withListingSelectFx";

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
		selectFx: withListingSelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		limit,
	});
});

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
