import { DateTime } from "luxon";
import { database } from "~/database/kysely";
import type { CleanupSchema } from "../schema/CleanupSchema";

export async function cleanupCategory(): Promise<CleanupSchema.Type> {
	const cutoffDate = DateTime.now()
		.minus({
			days: 7,
		})
		.toJSDate();
	const kysely = await database.kysely();

	const total = await kysely
		.selectFrom("category_miss")
		.select((eb) => eb.fn.count<number>("id").as("count"))
		.executeTakeFirstOrThrow();

	const result = await kysely
		.deleteFrom("category_miss")
		.where("updatedAt", "<", cutoffDate)
		.executeTakeFirst();

	return {
		type: "category",
		total: Number(total.count),
		deleted: Number(result.numDeletedRows),
	};
}
