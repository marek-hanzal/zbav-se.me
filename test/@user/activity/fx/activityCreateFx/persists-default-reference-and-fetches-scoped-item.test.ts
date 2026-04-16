import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";

describe("activityCreateFx", () => {
	it("persists default reference, keeps archivedAt null and stays scoped to owner", async () => {
		const database = await testabase("activityCreateFx-contract");

		return Effect.gen(function* () {
			const owner = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			const activity = yield* activityCreateFx({
				userId: owner.id,
				family: "transaction",
				type: "system",
				payload: {
					transactionId: "transaction-direct",
					listingId: "listing-direct",
					target: "buyer",
				},
				priority: "high",
			});

			expect(activity.reference).toEqual([]);
			expect(activity.family).toBe("transaction");
			expect(activity.type).toBe("system");
			expect(activity.priority).toBe("high");
			expect(activity.payload).toMatchObject({
				transactionId: "transaction-direct",
				listingId: "listing-direct",
				target: "buyer",
			});

			const persisted = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"userId",
						"reference",
						"archivedAt",
						"family",
						"type",
						"priority",
					])
					.where("id", "=", activity.id)
					.executeTakeFirstOrThrow(),
			);

			expect(persisted.userId).toBe(owner.id);
			expect(persisted.reference).toEqual([]);
			expect(persisted.archivedAt).toBeNull();
			expect(persisted.family).toBe("transaction");
			expect(persisted.type).toBe("system");
			expect(persisted.priority).toBe("high");

			const foreignRead = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select("id")
					.where("id", "=", activity.id)
					.where("userId", "=", stranger.id)
					.executeTakeFirst(),
			);

			expect(foreignRead).toBeUndefined();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
