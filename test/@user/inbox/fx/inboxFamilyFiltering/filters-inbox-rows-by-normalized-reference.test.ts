import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { withInboxQueryBuilderFx } from "~/user/inbox/server/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/user/inbox/server/db/withInboxSelectFx";

describe("inbox family", () => {
	it("filters inbox rows by normalized reference", async () => {
		const database = await testabase("inboxFamilyFiltering-reference");

		const { api } = auth(() => {
			return database.dialect;
		});

		return Effect.gen(function* () {
			const { user } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "inbox-reference@test.cz",
						name: "Inbox Reference",
						password: "12345678",
					},
				}),
			);

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
