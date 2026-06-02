import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace withListingEventCleanupCronFx {
	export interface Props {
		count: number;
	}
}

export const withListingEventCleanupCronFx = Effect.fn("withListingEventCleanupCronFx")(function* ({
	count,
}: withListingEventCleanupCronFx.Props) {
	const logger = yield* getLoggerFx("withListingEventCleanupCronFx", "cron");
	logger.trace("withListingEventCleanupCronFx", {
		count,
	});

	yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateContextFx;

			yield* dbFx(async (kysely) => {
				const source = kysely
					.selectFrom("listing_event as le")
					.select("le.id")
					.where(
						"le.createdAt",
						"<=",
						dateContext
							.now()
							.minus({
								months: 3,
							})
							.toJSDate(),
					)
					.orderBy("le.createdAt", "asc")
					.orderBy("le.id", "asc")
					.limit(count);

				return kysely.deleteFrom("listing_event").where("id", "in", source).execute();
			});
		}),
	);
});

export type withListingEventCleanupCronFx = ReturnType<typeof withListingEventCleanupCronFx>;
