import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingCountQuerySchema } from "~/buyer/listing/server/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/buyer/listing/server/schema/ListingFilterSchema";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import { withListingSelectFx } from "../db/withListingSelectFx";

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
		selectFx: withListingSelectFx({
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
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
