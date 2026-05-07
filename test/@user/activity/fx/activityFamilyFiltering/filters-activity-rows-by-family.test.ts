import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { withActivitySelectFx } from "~/user/activity/server/db/withActivitySelectFx";

describe("activity family", () => {
	it("filters activity rows by family", async () => {
		const database = await testabase("activityFamilyFiltering-message");

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
		}).pipe(withKyselyFx(database), Effect.runPromise);
	});
});
