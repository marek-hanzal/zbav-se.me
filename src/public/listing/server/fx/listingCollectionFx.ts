import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import { withListingCollectionSelectFx } from "~/public/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/public/listing/server/db/withListingQueryBuilderFx";
import type { ListingFilterSchema } from "~/public/listing/server/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/public/listing/server/schema/ListingQuerySchema";

export namespace listingCollectionFx {
	export interface Props extends ListingQuerySchema.Type {
		scope: ListingFilterSchema.Type;
	}
}

export const listingCollectionFx = Effect.fn("listingCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	filter,
	where,
	scope,
	sort,
	meta,
}: listingCollectionFx.Props) {
	const logger = yield* getLoggerFx("listingCollectionFx");
	logger.trace("listingCollectionFx", {
		cursor,
		limit,
		filter,
		where,
		scope,
		sort,
		meta,
	});

	return yield* withCollectionFx({
		selectFx: withListingCollectionSelectFx({
			sort,
			meta,
			hasExplicitCategory: hasExplicitCategory([
				filter,
				where,
				scope,
			]),
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
		queryFx(query) {
			return withListingQueryBuilderFx({
				...query,
				meta,
			});
		},
	});
});

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
