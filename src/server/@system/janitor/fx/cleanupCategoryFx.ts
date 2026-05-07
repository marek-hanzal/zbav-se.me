import { Effect } from "effect";
import { sql } from "kysely";
import { DateContextFx } from "@/lib/common/date";
import type { CleanupSchema } from "~/server/@system/janitor/schema/CleanupSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";

export const cleanupCategoryFx = Effect.fn("cleanupCategoryFx")(function* () {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const cutoffDate = dateContext
		.now()
		.minus({
			days: 7,
		})
		.toJSDate();

	const total = yield* tryDbFx(async () =>
		kysely
			.selectFrom("category_miss")
			.select(sql<number>`count(*)::int`.as("count"))
			.executeTakeFirstOrThrow(),
	);

	const result = yield* tryDbFx(async () =>
		kysely.deleteFrom("category_miss").where("updatedAt", "<", cutoffDate).executeTakeFirst(),
	);

	return {
		type: "category",
		total: total.count,
		deleted: Number(result.numDeletedRows),
	} satisfies CleanupSchema.Type;
});
