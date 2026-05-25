import { Effect } from "effect";
import { sql } from "kysely";
import { DateContextFx } from "@/lib/common/date";
import type { CleanupSchema } from "~/server/@system/janitor/schema/CleanupSchema";
import { dbFx } from "~/server/database/fx/dbFx";

export const cleanupCategoryFx = Effect.fn("cleanupCategoryFx")(function* () {
	const dateContext = yield* DateContextFx;

	const cutoffDate = dateContext
		.now()
		.minus({
			days: 7,
		})
		.toJSDate();

	const total = yield* dbFx(async (kysely) => {
		return kysely
			.selectFrom("category_miss")
			.select(sql<number>`count(*)::int`.as("count"))
			.executeTakeFirstOrThrow();
	});

	const result = yield* dbFx(async (kysely) => {
		return kysely
			.deleteFrom("category_miss")
			.where("updatedAt", "<", cutoffDate)
			.executeTakeFirst();
	});

	return {
		type: "category",
		total: total.count,
		deleted: Number(result.numDeletedRows),
	} satisfies CleanupSchema.Type;
});
