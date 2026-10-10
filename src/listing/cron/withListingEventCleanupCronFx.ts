import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

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
			const dateContext = yield* DateServiceFx;

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
