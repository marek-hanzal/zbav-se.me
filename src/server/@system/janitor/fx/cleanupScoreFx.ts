import { Effect } from "effect";
import { sql } from "kysely";
import { DateContextFx } from "@/lib/common/date";
import type { CleanupSchema } from "~/server/@system/janitor/schema/CleanupSchema";
import { dbFx } from "~/server/database/fx/dbFx";

export const cleanupScoreFx = Effect.fn("cleanupScoreFx")(function* () {
	const dateContext = yield* DateContextFx;

	const cutoffDate = dateContext
		.now()
		.minus({
			months: 1,
		})
		.toJSDate();

	const total = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("listing_event")
			.select(sql<number>`count(*)::int`.as("count"))
			.executeTakeFirstOrThrow();
	});

	const result = yield* dbFx(async (kysely) => {
		return kysely
			.deleteFrom("listing_event")
			.where("createdAt", "<", cutoffDate)
			.executeTakeFirst();
	});

	return {
		type: "listing-event",
		total: total.count,
		deleted: Number(result.numDeletedRows),
	} satisfies CleanupSchema.Type;
});
