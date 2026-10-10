import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { listingFetchFx } from "~/seller-listing/fx/listingFetchFx";
import type { ListingQuerySchema } from "~/seller-listing/schema/ListingQuerySchema";
import type { ListingWhereSchema } from "~/seller-listing/schema/ListingWhereSchema";

export namespace listingDeleteFx {
	export interface Props extends ListingQuerySchema.Type {
		userId: string;
		scope: ListingWhereSchema.Type;
	}
}

export const listingDeleteFx = Effect.fn("listingDeleteFx")(function* ({
	userId,
	...query
}: listingDeleteFx.Props) {
	const logger = yield* getLoggerFx("listingDeleteFx");
	logger.trace("listingDeleteFx", {
		...query,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const listing = yield* listingFetchFx({
				userId,
				...query,
			});

			yield* dbFx(async (kysely) => {
				return kysely.deleteFrom("listing").where("id", "=", listing.id).execute();
			});

			return listing;
		}),
	);
});

export type listingDeleteFx = ReturnType<typeof listingDeleteFx>;
