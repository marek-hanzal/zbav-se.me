import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export const withExpireAtCronFx = Effect.fn("withExpireAtCronFx")(function* () {
	const logger = yield* getLoggerFx("withExpireAtCronFx", "cron");
	logger.trace("withExpireAtCronFx");

	yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateContextFx;

			yield* dbFx(async (kysely) => {
				const source = kysely
					.selectFrom("listing as l")
					.select("l.id")
					.where("l.status", "=", "live")
					.where("l.expiresAt", "<=", dateContext.now().toJSDate())
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
