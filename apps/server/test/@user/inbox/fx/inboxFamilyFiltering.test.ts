import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withInboxQueryBuilderFx } from "~/@user/inbox/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/@user/inbox/db/withInboxSelectFx";
import { InboxWhereSchema } from "~/@user/inbox/schema/InboxWhereSchema";
import { auth } from "~/auth/auth";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { testabase } from "~test/testabase";

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

	it("accepts only known family values in where schema", () => {
		expect(
			InboxWhereSchema.parse({
				family: "transaction",
			}).family,
		).toBe("transaction");

		expect(() =>
			InboxWhereSchema.parse({
				family: "whatever",
			}),
		).toThrow();
	});

	it("filters inbox rows by normalized reference", async () => {
		const database = await testabase("inboxFamilyFiltering-reference");

		const { api } = auth(() => {
			return database.dialect;
		});

		const { user } = await api.signUpEmail({
			body: {
				email: "inbox-reference@test.cz",
				name: "Inbox Reference",
				password: "12345678",
			},
		});

		await database.kysely
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
			.execute();

		const rows = await Effect.gen(function* () {
			const select = yield* withInboxSelectFx({});
			const query = yield* withInboxQueryBuilderFx({
				select,
				where: {
					userId: user.id,
					reference: "listing-b",
				},
			});

			return yield* Effect.promise(async () => query.execute());
		}).pipe(withKyselyFx(database), Effect.runPromise);

		expect(rows).toHaveLength(1);
		expect(rows[0]?.id).toBe("inbox-reference-b");
		expect(rows[0]?.reference).toEqual([
			"listing-b",
		]);
	});
});
