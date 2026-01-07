import { Effect } from "effect";
import { DateTime } from "luxon";
import type { CleanupSchema } from "~/@public/janitor/schema/CleanupSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export const cleanupCategoryFx = Effect.fn("cleanupCategoryFx")(function* () {
	const database = yield* DatabaseContextFx;

	const cutoffDate = DateTime.now()
		.minus({
			days: 7,
		})
		.toJSDate();

	const total = yield* Effect.promise(async () => {
		return database
			.selectFrom("category_miss")
			.select((eb) => eb.fn.count<number>("id").as("count"))
			.executeTakeFirstOrThrow();
	});

	const result = yield* Effect.promise(async () => {
		return database
			.deleteFrom("category_miss")
			.where("updatedAt", "<", cutoffDate)
			.executeTakeFirst();
	});

	return {
		type: "category",
		total: Number(total.count),
		deleted: Number(result.numDeletedRows),
	} satisfies CleanupSchema.Type;
});
