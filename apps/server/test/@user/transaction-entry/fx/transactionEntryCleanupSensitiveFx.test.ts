import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/@seller/transaction/fx/transactionRejectFx";
import { auth } from "~/auth/auth";
import { createOpenScenarioFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionEntryCleanupSensitiveFx", () => {
	it("deletes location/package/personal entries on rejection, keeps text and status entries", async () => {
		const database = await testabase("entryCleanup-reject-sensitive");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@entry-cleanup.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@entry-cleanup.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { transactionId } = await createOpenScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Insert sensitive + non-sensitive entries directly into DB
		await database.kysely
			.insertInto("transaction_entry")
			.values([
				{
					id: "entry-location",
					transactionId,
					kind: "location",
					userId: seller.id,
					payload: {
						text: "location data",
					},
					createdAt: new Date(),
				},
				{
					id: "entry-package",
					transactionId,
					kind: "package",
					userId: seller.id,
					payload: {
						text: "package data",
					},
					createdAt: new Date(),
				},
				{
					id: "entry-personal",
					transactionId,
					kind: "personal",
					userId: buyer.id,
					payload: {
						text: "personal data",
					},
					createdAt: new Date(),
				},
				{
					id: "entry-text",
					transactionId,
					kind: "text",
					userId: buyer.id,
					payload: {
						text: "hello",
					},
					createdAt: new Date(),
				},
			])
			.execute();

		// Verify all 4 extra entries exist before cleanup
		const before = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", transactionId)
			.where("kind", "in", [
				"location",
				"package",
				"personal",
				"text",
			])
			.execute();

		expect(before).toHaveLength(4);

		// Rejection triggers transactionUpdateStatusFx → transactionEntryCleanupSensitiveFx
		await Effect.gen(function* () {
			yield* transactionRejectFx({
				transactionId,
				userId: seller.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const after = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", transactionId)
			.execute();

		const kinds = after.map((e) => e.kind);

		// Sensitive entries must be deleted
		expect(kinds).not.toContain("location");
		expect(kinds).not.toContain("package");
		expect(kinds).not.toContain("personal");

		// Non-sensitive entries must survive
		expect(kinds).toContain("text");
		expect(kinds).toContain("status-rejected-seller");
	});

	it("does not delete entries when status is non-terminal (open)", async () => {
		const database = await testabase("entryCleanup-non-terminal");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@entry-cleanup-open.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@entry-cleanup-open.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { transactionId } = await createOpenScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Insert sensitive entries directly
		await database.kysely
			.insertInto("transaction_entry")
			.values([
				{
					id: "entry-loc-open",
					transactionId,
					kind: "location",
					userId: seller.id,
					payload: {
						text: "location data",
					},
					createdAt: new Date(),
				},
			])
			.execute();

		// No rejection — entries should remain intact
		const entries = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", transactionId)
			.where("kind", "=", "location")
			.execute();

		expect(entries).toHaveLength(1);
	});
});
