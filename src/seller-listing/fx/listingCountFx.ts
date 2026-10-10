import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withListingSelectFx } from "~/seller-listing/db/withListingSelectFx";
import type { ListingCountQuerySchema } from "~/seller-listing/schema/ListingCountQuerySchema";
import type { ListingWhereSchema } from "~/seller-listing/schema/ListingWhereSchema";

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
