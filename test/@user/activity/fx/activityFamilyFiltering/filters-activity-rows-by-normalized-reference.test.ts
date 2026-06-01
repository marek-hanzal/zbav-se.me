import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { withActivitySelectFx } from "~/user/activity/server/db/withActivitySelectFx";

describe("activity family", () => {
	it("filters activity rows by normalized reference", async () => {
		const database = await testabase("activityFamilyFiltering-reference");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("activity")
					.values([
						{
							id: "activity-reference-a",
							userId: user.id,
							reference: [
								"listing-a",
								"tx-a",
							],
							timestamp: new Date("2026-03-09T09:00:00.000Z"),
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: "tx-a",
							},
							priority: "high",
							archivedAt: null,
						},
						{
							id: "activity-reference-b",
							userId: user.id,
							reference: [
								"listing-b",
							],
							timestamp: new Date("2026-03-09T10:00:00.000Z"),
							family: "reaction",
							type: "listing.favourite",
							payload: {
								listingId: "listing-b",
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
				reference: "listing-b",
			});

			const rows = yield* Effect.promise(() => query.execute());

			expect(rows).toHaveLength(1);
			expect(rows[0]?.id).toBe("activity-reference-b");
			expect(rows[0]?.reference).toEqual([
				"listing-b",
			]);
		}).pipe(withKyselyFx(database), Effect.runPromise);
	});
});
