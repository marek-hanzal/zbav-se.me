import { DateTime } from "luxon";
import { database } from "../../database/kysely";
import type { CleanupSchema } from "../schema/CleanupSchema";

export async function cleanupCategory(): Promise<CleanupSchema.Type> {
	const cutoffDate = DateTime.now()
		.minus({
			days: 7,
		})
		.toJSDate();

	const total = await database.kysely
		.selectFrom("category_miss")
		.where("updatedAt", "<", cutoffDate)
		.select((eb) => eb.fn.count<number>("id").as("count"))
		.executeTakeFirstOrThrow();

	const result = await database.kysely
		.deleteFrom("category_miss")
		.where("updatedAt", "<", cutoffDate)
		.execute();

	return {
		type: "category",
		total: total.count,
		deleted: result.length,
	};
}
