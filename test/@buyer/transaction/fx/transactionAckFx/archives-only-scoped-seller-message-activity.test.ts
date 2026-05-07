import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionAckFx } from "~/buyer/transaction/server/fx/transactionAckFx";
import type { ActivityTableSchema } from "~/server/database/@table/ActivityTableSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

type SeedActivity = Pick<
	ActivityTableSchema.Type,
	"family" | "id" | "payload" | "priority" | "reference" | "type" | "userId"
>;

const seedActivity = async (
	database: Awaited<ReturnType<typeof testabase>>,
	rows: SeedActivity[],
) => {
	await database.kysely
		.insertInto("activity")
		.values(
			rows.map((row) => ({
				...row,
				timestamp: new Date("2026-03-17T12:00:00.000Z"),
				archivedAt: null,
			})),
		)
		.execute();
};

describe("buyer transactionAckFx", () => {
	it("archives only scoped seller-message activity for the requested transaction", async () => {
		const database = await testabase("buyer-transactionAckFx-scoped");

		return Effect.gen(function* () {
			const buyer = yield* leaseTestUserFx({});
			const foreign = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				seedActivity(database, [
					{
						id: "archive-target",
						userId: buyer.id,
						reference: [
							"listing-1",
							"transaction-1",
						],
						family: "transaction",
						type: "seller-message",
						payload: {
							transactionId: "transaction-1",
						},
						priority: "high",
					},
					{
						id: "keep-wrong-type",
						userId: buyer.id,
						reference: [
							"listing-1",
							"transaction-1",
						],
						family: "transaction",
						type: "buyer-message",
						payload: {
							transactionId: "transaction-1",
						},
						priority: "high",
					},
					{
						id: "keep-foreign-user",
						userId: foreign.id,
						reference: [
							"listing-1",
							"transaction-1",
						],
						family: "transaction",
						type: "seller-message",
						payload: {
							transactionId: "transaction-1",
						},
						priority: "high",
					},
				]),
			);

			yield* transactionAckFx({
				listingId: "listing-1",
				transactionId: "transaction-1",
				userId: buyer.id,
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"archivedAt",
					])
					.orderBy("id")
					.execute(),
			);

			const archivedById = new Map(
				rows.map((row) => [
					row.id,
					row.archivedAt,
				]),
			);

			expect(archivedById.get("archive-target")).not.toBeNull();
			expect(archivedById.get("keep-wrong-type")).toBeNull();
			expect(archivedById.get("keep-foreign-user")).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
