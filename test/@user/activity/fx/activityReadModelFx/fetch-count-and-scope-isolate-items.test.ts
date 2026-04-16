import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";
import { activityCountFx } from "~/user/activity/server/fx/activityCountFx";
import { activityFetchFx } from "~/user/activity/server/fx/activityFetchFx";

describe("activity read model", () => {
	it("fetches and counts scoped items", async () => {
		const database = await testabase("activityReadModelFx-fetch-count-scope");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "activity-read-thumb-b",
							userId: user.id,
							reference: [
								"listing-b",
							],
							family: "reaction",
							type: "thumb",
							payload: {
								listingId: "listing-b",
								thumb: "like",
							},
							priority: "common",
							timestamp: new Date("2026-04-01T10:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "activity-read-favourite-c",
							userId: user.id,
							reference: [
								"listing-c",
							],
							family: "reaction",
							type: "favourite",
							payload: {
								listingId: "listing-c",
							},
							priority: "common",
							timestamp: new Date("2026-04-01T11:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "activity-read-tx-archived",
							userId: user.id,
							reference: [
								"listing-a",
								"tx-archived",
							],
							family: "transaction",
							type: "transaction",
							payload: {
								listingId: "listing-a",
								transactionId: "tx-archived",
								transactionEntryId: "entry-archived",
								target: "seller",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T12:00:00.000Z"),
							archivedAt: new Date("2026-04-01T12:30:00.000Z"),
						},
						{
							id: "activity-read-stranger",
							userId: stranger.id,
							reference: [
								"listing-stranger",
								"tx-stranger",
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-stranger",
								transactionEntryId: "entry-stranger",
							},
							priority: "high",
							timestamp: new Date("2026-04-01T13:00:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const scoped = yield* activityCollectionFx({
				scope: {
					userId: user.id,
				},
			});
			const fetched = yield* activityFetchFx({
				scope: {
					userId: user.id,
				},
				where: {
					id: "activity-read-thumb-b",
				},
			});
			const reactionCount = yield* activityCountFx({
				scope: {
					userId: user.id,
				},
				where: {
					family: "reaction",
				},
			});
			const archivedCount = yield* activityCountFx({
				scope: {
					userId: user.id,
				},
				where: {
					archivedAtIsNull: false,
				},
			});

			expect(scoped.map((item) => item.id).sort()).toEqual([
				"activity-read-favourite-c",
				"activity-read-thumb-b",
				"activity-read-tx-archived",
			]);
			expect(fetched.id).toBe("activity-read-thumb-b");
			expect(fetched.userId).toBe(user.id);
			expect(reactionCount).toBe(2);
			expect(archivedCount).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("denies foreign access", async () => {
		const database = await testabase("activityReadModelFx-fetch-foreign");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values({
						id: "activity-read-foreign-item",
						userId: stranger.id,
						reference: [
							"listing-stranger",
							"tx-stranger",
						],
						family: "transaction",
						type: "buyer-message",
						payload: {
							transactionId: "tx-stranger",
							transactionEntryId: "entry-stranger",
						},
						priority: "high",
						timestamp: new Date("2026-04-01T13:00:00.000Z"),
						archivedAt: null,
					})
					.execute(),
			);

			const foreignFetch = yield* Effect.either(
				activityFetchFx({
					scope: {
						userId: user.id,
					},
					where: {
						id: "activity-read-foreign-item",
					},
				}),
			);

			expectTaggedErrorFx(foreignFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
