import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";
import { withInboxQueryBuilderFx } from "~/user/inbox/server/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/user/inbox/server/db/withInboxSelectFx";

describe("inbox family", () => {
	it("filters inbox rows by family", async () => {
		const database = await testabase("inboxFamilyFiltering-message");

		const { api } = auth(() => {
			return database.dialect;
		});

		return Effect.gen(function* () {
			const { user } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "inbox-family@test.cz",
						name: "Inbox User",
						password: "12345678",
					},
				}),
			);

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("inbox")
					.values([
						{
							id: "inbox-message",
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
							id: "inbox-reaction",
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

			const select = yield* withInboxSelectFx({});
			const query = yield* withInboxQueryBuilderFx({
				select,
				where: {
					userId: user.id,
					family: "transaction",
				},
			});

			const rows = yield* Effect.promise(() => query.execute());

			expect(rows).toHaveLength(1);
			expect(rows[0]?.id).toBe("inbox-message");
			expect(rows[0]?.family).toBe("transaction");
		}).pipe(withKyselyFx(database), Effect.runPromise);
	});
});
