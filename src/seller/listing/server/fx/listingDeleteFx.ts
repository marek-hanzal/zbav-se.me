import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { ListingQuerySchema } from "../schema/ListingQuerySchema";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";
import { listingFetchFx } from "./listingFetchFx";

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
