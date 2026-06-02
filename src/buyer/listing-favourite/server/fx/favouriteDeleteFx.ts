import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { favouriteFetchFx } from "~/buyer/listing-favourite/server/fx/favouriteFetchFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace favouriteDeleteFx {
	export interface Props {
		userId: string;
		listingId: string;
	}
}

export const favouriteDeleteFx = Effect.fn("favouriteDeleteFx")(function* ({
	userId,
	listingId,
}: favouriteDeleteFx.Props) {
	const logger = yield* getLoggerFx("favouriteDeleteFx", "listing_favourite");
	logger.trace("Request", {
		userId,
		listingId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const favourite = yield* favouriteFetchFx({
				where: {
					listingId,
				},
				scope: {
					userId,
				},
			});

			yield* dbFx(async (kysely) => {
				return kysely
					.deleteFrom("listing_favourite")
					.where("id", "=", favourite.id)
					.execute();
			});

			return favourite;
		}),
	);
});

export type favouriteDeleteFx = ReturnType<typeof favouriteDeleteFx>;
