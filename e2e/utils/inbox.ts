import type { TestDatabase } from "./database";
import { waitForRow } from "./database";

type BuyerInboxType = "buyer-message";

export async function waitForLatestInboxByUserId(
	database: TestDatabase,
	userId: string,
	type: BuyerInboxType,
) {
	return waitForRow(
		database,
		() =>
			database.kysely
				.selectFrom("inbox")
				.select([
					"archivedAt",
					"id",
				])
				.where("userId", "=", userId)
				.where("type", "=", type)
				.orderBy("timestamp", "desc")
				.executeTakeFirst(),
		"Inbox row was not created in time.",
	);
}
