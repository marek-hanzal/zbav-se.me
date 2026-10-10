import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace withCategoryMissCleanupCronFx {
	export interface Props {
		count: number;
	}
}

export const withCategoryMissCleanupCronFx = Effect.fn("withCategoryMissCleanupCronFx")(function* ({
	count,
}: withCategoryMissCleanupCronFx.Props) {
	const logger = yield* getLoggerFx("withCategoryMissCleanupCronFx", "cron");
	logger.trace("withCategoryMissCleanupCronFx", {
		count,
	});

	yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateServiceFx;

			yield* dbFx(async (kysely) => {
				const source = kysely
					.selectFrom("category_miss as cm")
					.select("cm.id")
					.where(
						"cm.updatedAt",
						"<=",
						dateContext
							.now()
							.minus({
								days: 7,
							})
							.toJSDate(),
					)
					.orderBy("cm.updatedAt", "asc")
					.orderBy("cm.id", "asc")
					.limit(count);

				return kysely.deleteFrom("category_miss").where("id", "in", source).execute();
			});
		}),
	);
});

export type withCategoryMissCleanupCronFx = ReturnType<typeof withCategoryMissCleanupCronFx>;
