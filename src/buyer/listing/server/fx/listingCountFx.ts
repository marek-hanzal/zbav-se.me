import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withListingCollectionSelectFx } from "~/buyer/listing/server/db/withListingCollectionSelectFx";
import { withListingQueryBuilderFx } from "~/buyer/listing/server/db/withListingQueryBuilderFx";
import type { ListingCountQuerySchema } from "~/buyer/listing/server/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/buyer/listing/server/schema/ListingFilterSchema";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		userId: string;
		scope: ListingFilterSchema.Type;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	userId,
	filter,
	where,
	scope,
	meta,
}: listingCountFx.Props) {
	const logger = yield* getLoggerFx("listingCountFx");
	logger.trace("listingCountFx", {
		userId,
		filter,
		where,
		scope,
		meta,
	});

	return yield* withCountFx({
		selectFx: withListingCollectionSelectFx({
			userId,
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
				userId,
				meta,
			});
		},
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
