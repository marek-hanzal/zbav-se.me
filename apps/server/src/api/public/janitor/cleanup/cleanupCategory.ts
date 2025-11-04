import { DateTime } from "luxon";
import type { CleanupSchema } from "../../api/public/janitor/dto/CleanupDtoSchema";
import { database } from "../../database/kysely";

export async function cleanupCategory(): Promise<CleanupSchema.Type> {
	const cutoffDate = DateTime.now()
		.minus({
			days: 7,
		})
		.toJSDate();

	const total = await database.kysely
		.selectFrom("category_miss")
		.select((eb) => eb.fn.count<number>("id").as("count"))
		.executeTakeFirstOrThrow();

	const result = await database.kysely
		.deleteFrom("category_miss")
		.where("updatedAt", "<", cutoffDate)
		.executeTakeFirst();

	return {
		type: "category",
		total: Number(total.count),
		deleted: Number(result.numDeletedRows),
	};
}
