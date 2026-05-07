import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { ignoreFetchFx } from "~/buyer/ignore/server/fx/ignoreFetchFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
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
			const { kysely } = yield* KyselyContextFx;

			const ignore = yield* ignoreFetchFx({
				where: {
					listingId,
				},
				scope: {
					userId,
				},
			});

			yield* tryDbFx(async () =>
				kysely.deleteFrom("ignore").where("id", "=", ignore.id).execute(),
			);

			return ignore;
		}),
	);
});

export type ignoreDeleteFx = ReturnType<typeof ignoreDeleteFx>;
