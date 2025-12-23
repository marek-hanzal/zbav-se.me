import { DateTime } from "luxon";
import { database } from "~/database/kysely";
import type { CleanupSchema } from "../schema/CleanupSchema";

export async function cleanupScore(): Promise<CleanupSchema.Type> {
	const cutoffDate = DateTime.now()
		.minus({
			months: 1,
		})
		.toJSDate();

	const total = await database.kysely
		.selectFrom("listing_event")
		.select((eb) => eb.fn.count<number>("id").as("count"))
		.executeTakeFirstOrThrow();

	const result = await database.kysely
		.deleteFrom("listing_event")
		.where("createdAt", "<", cutoffDate)
		.executeTakeFirst();

	return {
		type: "listing-event",
		total: Number(total.count),
		deleted: Number(result.numDeletedRows),
	};
}
