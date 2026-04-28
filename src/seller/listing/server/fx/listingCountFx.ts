import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingCountQuerySchema } from "~/seller/listing/server/schema/ListingCountQuerySchema";
import type { ListingFilterSchema } from "~/seller/listing/server/schema/ListingFilterSchema";
import { withListingSelectFx } from "../db/withListingSelectFx";

export namespace listingCountFx {
	export interface Scope extends ListingFilterSchema.Type {
		userId: string;
	}

	export interface Props extends ListingCountQuerySchema.Type {
		scope: Scope;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	filter,
	where,
	scope,
}: listingCountFx.Props) {
	const logger = yield* getLoggerFx("listingCountFx");
	logger.trace("listingCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withListingSelectFx({
			sort: [],
		}),
		filter,
		where,
		scope,
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
