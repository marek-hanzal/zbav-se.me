import { Effect } from "effect";
import { sql } from "kysely";
import { DateContextFx } from "@/lib/common/date";
import type { CleanupSchema } from "~/server/@system/janitor/schema/CleanupSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export const cleanupScoreFx = Effect.fn("cleanupScoreFx")(function* () {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const cutoffDate = dateContext
		.now()
		.minus({
			months: 1,
		})
		.toJSDate();

	const total = yield* tryDbFx(async () => {
		return kysely
			.selectFrom("listing_event")
			.select(sql<number>`count(*)::int`.as("count"))
			.executeTakeFirstOrThrow();
	});

	const result = yield* tryDbFx(async () => {
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
