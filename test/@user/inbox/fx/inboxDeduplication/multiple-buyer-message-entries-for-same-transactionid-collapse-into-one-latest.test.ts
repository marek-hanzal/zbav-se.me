import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { inboxCollectionFx } from "~/user/inbox/server/fx/inboxCollectionFx";

describe("inbox deduplication (PARTITION BY transactionId)", () => {
	it("multiple buyer-message entries for same transactionId collapse into one (latest)", async () => {
		const database = await testabase("inboxDedup-buyer-message");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@inbox-dedup.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const txId = "dedup-tx-001";
			const listingId = "dedup-listing-001";

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("inbox")
					.values([
						{
							id: "dedup-inbox-1",
							userId: seller.id,
							reference: [
								listingId,
								txId,
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: txId,
								transactionEntryId: "entry-1",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T10:00:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-inbox-2",
							userId: seller.id,
							reference: [
								listingId,
								txId,
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: txId,
								transactionEntryId: "entry-2",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T10:01:00.000Z"),
							archivedAt: null,
						},
						{
							id: "dedup-inbox-3",
							userId: seller.id,
							reference: [
								listingId,
								txId,
							],
							family: "transaction",
							type: "buyer-message",
							payload: {
								transactionId: txId,
								transactionEntryId: "entry-3",
							},
							priority: "high",
							timestamp: new Date("2026-03-17T10:02:00.000Z"),
							archivedAt: null,
						},
					])
					.execute(),
			);

			const rawItems = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("inbox")
					.select("id")
					.where("id", "in", [
						"dedup-inbox-1",
						"dedup-inbox-2",
						"dedup-inbox-3",
					])
					.execute(),
			);

			expect(rawItems).toHaveLength(3);

			const collection = yield* inboxCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					userId: seller.id,
				},
			});

			const buyerMessageItems = collection.filter((item) => item.type === "buyer-message");
			expect(buyerMessageItems).toHaveLength(1);
			expect(buyerMessageItems[0]?.id).toBe("dedup-inbox-3");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
