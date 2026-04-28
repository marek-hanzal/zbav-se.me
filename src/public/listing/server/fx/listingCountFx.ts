import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import type { ListingCountQuerySchema } from "~/public/listing/server/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/public/listing/server/schema/ListingFilterSchema";
import { withListingSelectFx } from "../db/withListingSelectFx";

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
		selectFx: withListingSelectFx({
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
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
