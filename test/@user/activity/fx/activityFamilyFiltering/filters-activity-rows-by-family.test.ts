import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { withActivitySelectFx } from "~/user-activity/db/withActivitySelectFx";

describe("activity family", () => {
	it("filters activity rows by family", async () => {
		const database = await testabaseFn("activityFamilyFiltering-message");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "activity-message",
							userId: user.id,
							reference: [
								"listing-1",
								"tx-1",
							],
							timestamp: new Date("2026-03-09T09:00:00.000Z"),
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-1",
							},
							priority: "high",
							archivedAt: null,
						},
						{
							id: "activity-reaction",
							userId: user.id,
							reference: [
								"listing-1",
							],
							timestamp: new Date("2026-03-09T10:00:00.000Z"),
							family: "reaction",
							type: "thumb",
							payload: {
								listingId: "listing-1",
								thumb: "like",
							},
							priority: "common",
							archivedAt: null,
						},
					])
					.execute(),
			);

			const { select, queryFx } = yield* withActivitySelectFx({});
			const query = yield* queryFx(select, {
				userId: user.id,
				family: "transaction",
			});

			const rows = yield* Effect.promise(() => query.execute());

			expect(rows).toHaveLength(1);
			expect(rows[0]?.id).toBe("activity-message");
			expect(rows[0]?.family).toBe("transaction");
		}).pipe(withKyselyFn(database), Effect.runPromise);
	});
});
