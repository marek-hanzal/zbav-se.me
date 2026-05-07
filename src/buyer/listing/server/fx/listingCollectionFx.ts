import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
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
	filter,
	where,
	scope,
	sort,
	meta,
	limit,
}: listingCollectionFx.Props) {
	const logger = yield* getLoggerFx("listingCollectionFx");
	logger.trace("listingCollectionFx", {
		userId,
		cursor,
		filter,
		where,
		scope,
		sort,
		meta,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withListingSelectFx({
			userId,
			sort,
			meta,
			hasExplicitCategory: hasExplicitCategory([
				filter,
				where,
				scope,
			]),
		}),
		cursor,
		filter,
		where,
		scope,
		limit,
	});
});

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
