import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { withInboxQueryBuilderFx } from "~/user/inbox/server/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/user/inbox/server/db/withInboxSelectFx";

describe("inbox family", () => {
	it("filters inbox rows by normalized reference", async () => {
		const database = await testabase("inboxFamilyFiltering-reference");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("inbox")
					.values([
						{
							id: "inbox-reference-a",
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
							id: "inbox-reference-b",
							userId: user.id,
							reference: [
								"listing-b",
							],
							timestamp: new Date("2026-03-09T10:00:00.000Z"),
							family: "reaction",
							type: "favourite",
							payload: {
								listingId: "listing-b",
							},
							priority: "common",
							archivedAt: null,
						},
					])
					.execute(),
			);

			const select = yield* withInboxSelectFx({});
			const query = yield* withInboxQueryBuilderFx({
				select,
				where: {
					userId: user.id,
					reference: "listing-b",
				},
			});

			const rows = yield* Effect.promise(() => query.execute());

			expect(rows).toHaveLength(1);
			expect(rows[0]?.id).toBe("inbox-reference-b");
			expect(rows[0]?.reference).toEqual([
				"listing-b",
			]);
		}).pipe(withKyselyFx(database), Effect.runPromise);
	});
});
