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
			const source = kysely
				.selectFrom("transaction as t")
				.select("t.id")
				.where(
					"t.statusUpdatedAt",
					"<=",
					dateContext
						.now()
						.minus({
							month: 3,
						})
						.toJSDate(),
				)
				.orderBy("t.statusUpdatedAt", "asc")
				.orderBy("t.id", "asc")
				.limit(50_000);

			return kysely.deleteFrom("transaction").where("id", "in", source).execute();
		});
	},
);

export type withTransactionCleanupCronFx = ReturnType<typeof withTransactionCleanupCronFx>;
