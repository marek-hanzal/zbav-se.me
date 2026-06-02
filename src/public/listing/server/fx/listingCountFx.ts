import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import type { ListingCountQuerySchema } from "~/public/listing/server/schema/ListingCountQuerySchema";
import { withListingSelectFx } from "../db/withListingSelectFx";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

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
			hasExplicitCategory: hasExplicitCategory([
				where,
				scope,
			]),
		}),
		where,
		scope,
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
