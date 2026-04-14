import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCountFx } from "~/user/activity/server/fx/activityCountFx";
import { activityPatchCollectionFx } from "~/user/activity/server/fx/activityPatchCollectionFx";

describe("activityPatchCollectionFx", () => {
	it("patches only scoped matching items and leaves foreign rows untouched", async () => {
		const database = await testabase("activityPatch-collection");
		const archivedAt = new Date("2026-04-01T11:00:00.000Z");

		return Effect.gen(function* () {
			const owner = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "owner-transaction-1",
							userId: owner.id,
							reference: [
								"listing-1",
								"tx-1",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-1",
								transactionEntryId: "entry-1",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "owner-transaction-2",
							userId: owner.id,
							reference: [
								"listing-2",
								"tx-2",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-2",
								transactionEntryId: "entry-2",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:01:00.000Z"),
							archivedAt: null,
						},
						{
							id: "owner-reaction",
							userId: owner.id,
							reference: [
								"listing-3",
							],
							family: "reaction",
							type: "thumb",
							payload: {
								listingId: "listing-3",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:02:00.000Z"),
							archivedAt: null,
						},
						{
							id: "stranger-transaction",
							userId: stranger.id,
							reference: [
								"listing-4",
								"tx-4",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-4",
								transactionEntryId: "entry-4",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T09:03:00.000Z"),
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
					},
				},
				patch: {
					archivedAt,
				},
			});

			expect(patched).toHaveLength(2);
			expect(patched.every((item) => item.userId === owner.id)).toBe(true);
			expect(
				patched.every(
					(item) => item.archivedAt?.toISOString() === archivedAt.toISOString(),
				),
			).toBe(true);

			const ownerActive = yield* activityCountFx({
				scope: {
					userId: owner.id,
				},
				filter: {
					archivedAtIsNull: true,
				},
			});

			expect(ownerActive).toBe(1);

			const strangerActive = yield* activityCountFx({
				scope: {
					userId: stranger.id,
				},
				filter: {
					archivedAtIsNull: true,
				},
			});

			expect(strangerActive).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
