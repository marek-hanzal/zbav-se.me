import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingQuerySchema } from "~/seller/listing/server/schema/ListingQuerySchema";
import { withListingSelectFx } from "../db/withListingSelectFx";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

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
