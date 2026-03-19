import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { inboxCollectionFx } from "~/@user/inbox/fx/inboxCollectionFx";
import { auth } from "~/auth/auth";
import { withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("inbox deduplication (PARTITION BY transactionId)", () => {
	it("buyer-message and seller-message for different transactions are NOT deduplicated together", async () => {
		const database = await testabase("inboxDedup-separate-transactions");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@inbox-dedup-sep.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		await api.signUpEmail({
			body: {
				email: "buyer@inbox-dedup-sep.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		// Insert inbox items for two different transactionIds — each should survive deduplication
		await database.kysely
			.insertInto("inbox")
			.values([
				{
					id: "dedup-sep-1",
					userId: seller.id,
					reference: [
						"listing-y",
						"tx-aaa",
					],
					family: "transaction",
					type: "buyer-message",
					payload: {
						transactionId: "tx-aaa",
						transactionEntryId: "entry-a",
					},
					priority: "high",
					timestamp: new Date("2026-03-17T11:00:00.000Z"),
					archivedAt: null,
				},
				{
					id: "dedup-sep-2",
					userId: seller.id,
					reference: [
						"listing-z",
						"tx-bbb",
					],
					family: "transaction",
					type: "buyer-message",
					payload: {
						transactionId: "tx-bbb",
						transactionEntryId: "entry-b",
					},
					priority: "high",
					timestamp: new Date("2026-03-17T11:01:00.000Z"),
					archivedAt: null,
				},
			])
			.execute();

		const collection = await Effect.gen(function* () {
			return yield* inboxCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					userId: seller.id,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Two different transactions → 2 items
		const buyerMessageItems = collection.filter((item) => item.type === "buyer-message");
		expect(buyerMessageItems).toHaveLength(2);
	});
});
