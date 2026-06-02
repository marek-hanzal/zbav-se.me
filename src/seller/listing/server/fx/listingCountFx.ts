import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import type { ListingCountQuerySchema } from "~/seller/listing/server/schema/ListingCountQuerySchema";
import { withListingSelectFx } from "../db/withListingSelectFx";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

export namespace listingCountFx {
	export interface Props extends ListingCountQuerySchema.Type {
		userId: string;
		scope: ListingWhereSchema.Type;
	}
}

export const listingCountFx = Effect.fn("listingCountFx")(function* ({
	userId,
	where,
	scope,
}: listingCountFx.Props) {
	const logger = yield* getLoggerFx("listingCountFx");
	logger.trace("listingCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withListingSelectFx({
			userId,
			sort: [],
		}),
		where,
		scope,
	});
});

export type listingCountFx = ReturnType<typeof listingCountFx>;
