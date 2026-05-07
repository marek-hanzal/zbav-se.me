import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";

describe("activity deduplication edge cases", () => {
	it("does not deduplicate messages across different users sharing the same transaction id", async () => {
		const database = await testabase("activityDedup-user-scope");

		return Effect.gen(function* () {
			const alice = yield* leaseTestUserFx({});
			const bob = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-user-a-1",
							userId: alice.id,
							reference: [
								"listing-user-scope",
								"shared-tx-id",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "shared-tx-id",
								transactionEntryId: "alice-entry",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-user-b-1",
							userId: bob.id,
							reference: [
								"listing-user-scope",
								"shared-tx-id",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "shared-tx-id",
								transactionEntryId: "bob-entry",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:01:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const aliceCollection = yield* activityCollectionFx({
				scope: {
					userId: alice.id,
				},
				where: {
					userId: alice.id,
				},
			});
			const bobCollection = yield* activityCollectionFx({
				scope: {
					userId: bob.id,
				},
				where: {
					userId: bob.id,
				},
			});

			expect(aliceCollection.map((item) => item.id)).toEqual([
				"dedup-user-a-1",
			]);
			expect(bobCollection.map((item) => item.id)).toEqual([
				"dedup-user-b-1",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("breaks same-timestamp ties by newer lexicographic id", async () => {
		const database = await testabase("activityDedup-tie-break-id");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-tie-a",
							userId: user.id,
							reference: [
								"listing-tie",
								"tx-tie",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-tie",
								transactionEntryId: "entry-a",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-tie-b",
							userId: user.id,
							reference: [
								"listing-tie",
								"tx-tie",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-tie",
								transactionEntryId: "entry-b",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:00:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const collection = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					userId: user.id,
				},
			});

			expect(collection.map((item) => item.id)).toEqual([
				"dedup-tie-b",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("prefers the latest active message when a newer archived duplicate exists", async () => {
		const database = await testabase("activityDedup-prefer-active");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-active-older",
							userId: user.id,
							reference: [
								"listing-active",
								"tx-active",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-active",
								transactionEntryId: "entry-active",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-archived-newer",
							userId: user.id,
							reference: [
								"listing-active",
								"tx-active",
							],
							family: "transaction",
							type: "seller-message",
							payload: {
								transactionId: "tx-active",
								transactionEntryId: "entry-archived",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T12:01:00.000Z"),
							archivedAt: new Date("2026-03-17T12:02:00.000Z"),
						},
					])
					.execute(),
			);

			const activeOnly = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					userId: user.id,
					archivedAtIsNull: true,
				},
			});

			expect(activeOnly.map((item) => item.id)).toEqual([
				"dedup-active-older",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("does not deduplicate non-message transaction activity rows", async () => {
		const database = await testabase("activityDedup-non-message-untouched");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "dedup-transaction-a",
							userId: user.id,
							reference: [
								"listing-transaction",
								"tx-transaction",
							],
							family: "transaction",
							type: "transaction",
							payload: {
								transactionId: "tx-transaction",
								transactionEntryId: "entry-a",
								listingId: "listing-transaction",
								target: "buyer",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T13:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-transaction-b",
							userId: user.id,
							reference: [
								"listing-transaction",
								"tx-transaction",
							],
							family: "transaction",
							type: "transaction",
							payload: {
								transactionId: "tx-transaction",
								transactionEntryId: "entry-b",
								listingId: "listing-transaction",
								target: "buyer",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T13:01:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const collection = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
				where: {
					userId: user.id,
					type: "transaction",
				},
			});

			expect(collection.map((item) => item.id)).toEqual([
				"dedup-transaction-a",
				"dedup-transaction-b",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
