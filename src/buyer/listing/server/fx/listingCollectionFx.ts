import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withListingCollectionSelectFx } from "~/buyer/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/buyer/listing/server/db/withListingQueryBuilderFx";
import type { ListingFilterSchema } from "~/buyer/listing/server/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";

export namespace listingCollectionFx {
	export interface Props extends ListingQuerySchema.Type {
		userId: string;
		scope: ListingFilterSchema.Type;
	}
}

export const listingCollectionFx = Effect.fn("listingCollectionFx")(function* ({
	userId,
	cursor,
	filter,
	where,
	scope,
	sort,
	meta,
}: listingCollectionFx.Props) {
	const logger = yield* getLoggerFx("listingCollectionFx");
	logger.debug("listingCollectionFx", {
		userId,
		cursor,
		filter,
		where,
		scope,
		sort,
		meta,
	});

	return yield* withCollectionFx({
		selectFx: withListingCollectionSelectFx({
			userId,
			sort,
			meta,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx(query) {
			return withListingQueryBuilderFx({
				...query,
				userId,
				meta,
			});
		},
	});
});

export type listingCollectionFx = ReturnType<typeof listingCollectionFx>;
