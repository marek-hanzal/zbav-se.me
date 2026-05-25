import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";

export const withTransactionCleanupCronFx = Effect.fn("vwithTransactionCleanupCronFx")(
	function* () {
		const logger = yield* getLoggerFx("withTransactionCleanupCronFx", "cron");
		logger.trace("withTransactionCleanupCronFx");

		const dateContext = yield* DateContextFx;

		yield* dbFx(async (kysely) => {
			return kysely
				.deleteFrom("transaction")
				.where(
					"statusUpdatedAt",
					"<=",
					dateContext
						.now()
						.minus({
							month: 3,
						})
						.toJSDate(),
				)
                .limit(50_000)
				.execute();
		});
	},
);

export type withTransactionCleanupCronFx = ReturnType<typeof withTransactionCleanupCronFx>;
