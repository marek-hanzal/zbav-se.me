import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export const withExpireAtCronFx = Effect.fn("withExpireAtCronFx")(function* () {
	const logger = yield* getLoggerFx("withExpireAtCronFx", "cron");
	logger.trace("withExpireAtCronFx");

	yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateServiceFx;

			yield* dbFx(async (kysely) => {
				const source = kysely
					.selectFrom("listing as l")
					.select("l.id")
					.where("l.status", "=", "live")
					.where("l.expiresAt", "<=", dateContext.nowFn().toJSDate())
					.orderBy("l.expiresAt", "asc")
					.orderBy("l.id", "asc")
					.limit(50_000);

				return kysely
					.updateTable("listing")
					.set({
						status: "expired",
					})
					.where("id", "in", source)
					.execute();
			});
		}),
	);
});

export type withExpireAtCronFx = ReturnType<typeof withExpireAtCronFx>;
