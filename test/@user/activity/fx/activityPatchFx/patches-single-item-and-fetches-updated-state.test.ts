import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCountFx } from "~/user/activity/server/fx/activityCountFx";
import { activityFetchFx } from "~/user/activity/server/fx/activityFetchFx";
import { activityPatchFx } from "~/user/activity/server/fx/activityPatchFx";

describe("activityPatchFx", () => {
	it("patches a single item and exposes the updated state via fetch/count", async () => {
		const database = await testabase("activityPatch-single");
		const archivedAt = new Date("2026-04-01T10:00:00.000Z");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values({
						id: "activity-patch-1",
						userId: user.id,
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
					})
					.executeTakeFirstOrThrow(),
			);

			const patched = yield* activityPatchFx({
				scope: {
					userId: user.id,
				},
				query: {
					where: {
						id: "activity-patch-1",
					},
				},
				patch: {
					archivedAt,
				},
			});

			expect(patched.archivedAt?.toISOString()).toBe(archivedAt.toISOString());

			const fetched = yield* activityFetchFx({
				scope: {
					userId: user.id,
				},
				where: {
					id: "activity-patch-1",
				},
			});

			expect(fetched.archivedAt?.toISOString()).toBe(archivedAt.toISOString());

			const foreignFetch = yield* Effect.either(
				activityFetchFx({
					scope: {
						userId: stranger.id,
					},
					where: {
						id: "activity-patch-1",
					},
				}),
			);
			const foreignPatch = yield* Effect.either(
				activityPatchFx({
					scope: {
						userId: stranger.id,
					},
					query: {
						where: {
							id: "activity-patch-1",
						},
					},
					patch: {
						archivedAt: null,
					},
				}),
			);

			expectTaggedErrorFx(foreignFetch, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFx(foreignPatch, {
				tag: "NotFoundErrorFx",
			});

			const storedActivity = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"userId",
						"archivedAt",
					])
					.where("id", "=", "activity-patch-1")
					.executeTakeFirstOrThrow(),
			);

			expect(storedActivity).toEqual({
				id: "activity-patch-1",
				userId: user.id,
				archivedAt,
			});

			const activeCount = yield* activityCountFx({
				scope: {
					userId: user.id,
				},
				filter: {
					archivedAtIsNull: true,
				},
			});

			expect(activeCount).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
