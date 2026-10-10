import { Effect } from "effect";
import { ignoreFetchFx } from "~/buyer-listing-ignore/fx/ignoreFetchFx";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace ignoreDeleteFx {
	export interface Props {
		userId: string;
		listingId: string;
	}
}

export const ignoreDeleteFx = Effect.fn("ignoreDeleteFx")(function* ({
	userId,
	listingId,
}: ignoreDeleteFx.Props) {
	const logger = yield* getLoggerFx("ignoreDeleteFx");
	logger.trace("ignoreDeleteFx", {
		userId,
		listingId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const ignore = yield* ignoreFetchFx({
				where: {
					listingId,
				},
				scope: {
					userId,
				},
			});

			yield* dbFx(async (kysely) => {
				return kysely.deleteFrom("listing_ignore").where("id", "=", ignore.id).execute();
			});

			return ignore;
		}),
	);
});

export type ignoreDeleteFx = ReturnType<typeof ignoreDeleteFx>;
