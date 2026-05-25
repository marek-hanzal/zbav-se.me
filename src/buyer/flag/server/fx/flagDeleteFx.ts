import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { flagFetchFx } from "~/buyer/flag/server/fx/flagFetchFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace flagDeleteFx {
	export interface Props {
		userId: string;
		listingId: string;
	}
}

export const flagDeleteFx = Effect.fn("flagDeleteFx")(function* ({
	userId,
	listingId,
}: flagDeleteFx.Props) {
	const logger = yield* getLoggerFx("flagDeleteFx");
	logger.trace("flagDeleteFx", {
		userId,
		listingId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const flag = yield* flagFetchFx({
				where: {
					listingId,
				},
				scope: {
					userId,
				},
			});

			yield* dbFx(async (kysely) => {
				return kysely.deleteFrom("flag").where("id", "=", flag.id).execute();
			});

			return flag;
		}),
	);
});

export type flagDeleteFx = ReturnType<typeof flagDeleteFx>;
