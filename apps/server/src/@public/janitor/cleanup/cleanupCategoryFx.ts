import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import type { CleanupSchema } from "~/@public/janitor/schema/CleanupSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export const cleanupCategoryFx = Effect.fn("cleanupCategoryFx")(function* () {
	const { kysely } = yield* KyselyContextFx;
	const dateContext = yield* DateContextFx;

	const cutoffDate = dateContext
		.now()
		.minus({
			days: 7,
		})
		.toJSDate();

	const total = yield* Effect.promise(async () => {
		return kysely
			.selectFrom("category_miss")
			.select((eb) => eb.fn.count<number>("id").as("count"))
			.executeTakeFirstOrThrow();
	});

	const result = yield* Effect.promise(async () => {
		return kysely
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
