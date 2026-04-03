import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createDbUserFx } from "~/test/user/fx/createDbUserFx";
import { inboxCollectionFx } from "~/user/inbox/server/fx/inboxCollectionFx";

describe("inbox deduplication (PARTITION BY transactionId)", () => {
	it("buyer-message and seller-message for different transactions are NOT deduplicated together", async () => {
		const database = await testabase("inboxDedup-separate-transactions");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "seller@inbox-dedup-sep.cz",
				name: "Seller",
			});
			yield* createDbUserFx({
				email: "buyer@inbox-dedup-sep.cz",
				name: "Buyer",
			});

			yield* Effect.promise(() =>
				database.kysely
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
					.execute(),
			);

			const collection = yield* inboxCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					userId: seller.id,
				},
			});

			const buyerMessageItems = collection.filter((item) => item.type === "buyer-message");
			expect(buyerMessageItems).toHaveLength(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
