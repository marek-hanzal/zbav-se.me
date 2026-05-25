import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { ignoreFetchFx } from "~/buyer/ignore/server/fx/ignoreFetchFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

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
				return kysely.deleteFrom("ignore").where("id", "=", ignore.id).execute();
			});

			return ignore;
		}),
	);
});

export type ignoreDeleteFx = ReturnType<typeof ignoreDeleteFx>;
