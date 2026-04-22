import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import { withListingCollectionSelectFx } from "~/public/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/public/listing/server/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/public/listing/server/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/public/listing/server/schema/ListingFilterSchema";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		scope: ListingFilterSchema.Type;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	filter,
	where,
	scope,
	meta,
}: listingCountFx.Props) {
	const logger = yield* getLoggerFx("listingCountFx");
	logger.trace("listingCountFx", {
		filter,
		where,
		scope,
		meta,
	});

	return yield* withCountFx({
		selectFx: withListingCollectionSelectFx({
			meta,
			hasExplicitCategory: hasExplicitCategory([
				filter,
				where,
				scope,
			]),
		}),
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

export type listingCountFx = ReturnType<typeof listingCountFx>;
