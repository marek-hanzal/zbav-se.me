import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace withTransactionCleanupCronFx {
	export interface Props {
		count: number;
	}
}

export const withTransactionCleanupCronFx = Effect.fn("vwithTransactionCleanupCronFx")(function* ({
	count,
}: withTransactionCleanupCronFx.Props) {
	const logger = yield* getLoggerFx("withTransactionCleanupCronFx", "cron");
	logger.trace("withTransactionCleanupCronFx", {
		count,
	});

	const dateContext = yield* DateServiceFx;

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
			.limit(count);

		return kysely.deleteFrom("transaction").where("id", "in", source).execute();
	});
});

export type withTransactionCleanupCronFx = ReturnType<typeof withTransactionCleanupCronFx>;
