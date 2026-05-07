import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityPatchCollectionFx } from "~/user/activity/server/fx/activityPatchCollectionFx";

describe("activity bulk mutation patch contract", () => {
	it("patches only scoped rows matched by combined filters", async () => {
		const database = await testabase("activityBulkMutationFx-patch");
		const archivedAt = new Date("2026-04-01T14:00:00.000Z");

		return Effect.gen(function* () {
			const owner = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "bulk-owner-a",
							userId: owner.id,
							reference: [
								"listing-bulk",
								"tx-a",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-a",
								transactionEntryId: "entry-a",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "bulk-owner-b",
							userId: owner.id,
							reference: [
								"listing-bulk",
								"tx-b",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-b",
								transactionEntryId: "entry-b",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T10:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "bulk-owner-c",
							userId: owner.id,
							reference: [
								"listing-bulk",
								"tx-c",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-c",
								transactionEntryId: "entry-c",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T11:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "bulk-stranger-a",
							userId: stranger.id,
							reference: [
								"listing-bulk",
								"tx-stranger",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-stranger",
								transactionEntryId: "entry-stranger",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:30:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const patched = yield* activityPatchCollectionFx({
				scope: {
					userId: owner.id,
				},
				query: {
					filter: {
						family: "transaction",
						type: "buyer-message",
						reference: "listing-bulk",
						timestampLte: new Date("2026-04-01T10:30:00.000Z"),
					},
				},
				patch: {
					archivedAt,
				},
			});

			expect(patched.map((item) => item.id).sort()).toEqual([
				"bulk-owner-a",
				"bulk-owner-b",
			]);

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"archivedAt",
					])
					.where("id", "in", [
						"bulk-owner-a",
						"bulk-owner-b",
						"bulk-owner-c",
						"bulk-stranger-a",
					])
					.execute(),
			);

			const archivedIds = rows
				.filter((row) => row.archivedAt !== null)
				.map((row) => row.id)
				.sort();

			expect(archivedIds).toEqual([
				"bulk-owner-a",
				"bulk-owner-b",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
