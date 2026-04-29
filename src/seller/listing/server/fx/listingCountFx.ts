import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingCountQuerySchema } from "~/seller/listing/server/schema/ListingCountQuerySchema";
import { withListingSelectFx } from "../db/withListingSelectFx";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

export namespace listingCountFx {
	export interface Scope extends ListingWhereSchema.Type {
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
