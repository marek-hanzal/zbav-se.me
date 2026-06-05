import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace withUserEventCleanupCronFx {
	export interface Props {
		count: number;
	}
}

export const withUserEventCleanupCronFx = Effect.fn("userEventCleanupCronFx")(function* ({
	count,
}: withUserEventCleanupCronFx.Props) {
	const logger = yield* getLoggerFx("userEventCleanupCronFx", "cron");
	logger.trace("userEventCleanupCronFx", {
		count,
	});

	yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateServiceFx;

			yield* dbFx(async (kysely) => {
				const source = kysely
					.selectFrom("user_event as ue")
					.select("ue.id")
					.where(
						"ue.createdAt",
						"<=",
						dateContext
							.now()
							.minus({
								months: 6,
							})
							.toJSDate(),
					)
					.orderBy("ue.createdAt", "asc")
					.orderBy("ue.id", "asc")
					.limit(count);

				return kysely.deleteFrom("user_event").where("id", "in", source).execute();
			});
		}),
	);
});

export type withUserEventCleanupCronFx = ReturnType<typeof withUserEventCleanupCronFx>;
