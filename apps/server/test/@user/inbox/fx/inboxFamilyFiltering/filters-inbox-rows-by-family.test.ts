import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withInboxQueryBuilderFx } from "~/@user/inbox/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/@user/inbox/db/withInboxSelectFx";
import { auth } from "~/auth/auth";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { testabase } from "~/test/testabase";

describe("inbox family", () => {
	it("filters inbox rows by family", async () => {
		const database = await testabase("inboxFamilyFiltering-message");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user } = await api.signUpEmail({
			body: {
				email: "inbox-family@test.cz",
				name: "Inbox User",
				password: "12345678",
			},
		});

		await database.kysely
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
			.execute();

		const rows = await Effect.gen(function* () {
			const select = yield* withInboxSelectFx({});
			const query = yield* withInboxQueryBuilderFx({
				select,
				where: {
					userId: user.id,
					family: "transaction",
				},
			});

			return yield* Effect.promise(async () => query.execute());
		}).pipe(withKyselyFx(database), Effect.runPromise);

		expect(rows).toHaveLength(1);
		expect(rows[0]?.id).toBe("inbox-message");
		expect(rows[0]?.family).toBe("transaction");
	});
});
