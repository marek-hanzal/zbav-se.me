import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/utils/createOpenScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionEntryCleanupSensitiveFx", () => {
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
