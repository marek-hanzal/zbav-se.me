import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import { withListingSelectFx } from "~/public/listing/server/db/withListingSelectFx";
import type { ListingQuerySchema } from "~/public/listing/server/schema/ListingQuerySchema";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

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
