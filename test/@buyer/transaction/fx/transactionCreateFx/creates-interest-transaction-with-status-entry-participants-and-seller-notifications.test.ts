import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { keyOf } from "@/lib/common/key-of";
import { transactionCreateFx } from "~/buyer/transaction/server/fx/transactionCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("transactionCreateFx", () => {
	it("creates interest transaction with status entry, participants and seller notifications", async () => {
		const database = await testabase("transactionCreateFx-direct");

		return Effect.gen(function* () {
			const { seller, buyer } = yield* createUsersFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Transaction Create Listing",
			});

			const transaction = yield* transactionCreateFx({
				userId: buyer.id,
				listingId: listing.id,
			});

			expect(transaction.status).toBe("interest");
			expect(transaction.userId).toBe(buyer.id);
			expect(transaction.listingId).toBe(listing.id);
			expect(transaction.expiresAt.getTime()).toBeGreaterThan(
				transaction.createdAt.getTime(),
			);

			const statusEntries = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select([
						"kind",
						"userId",
						"payload",
					])
					.where("transactionId", "=", transaction.id)
					.execute(),
			);
			const participants = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_user")
					.select([
						"userId",
						"side",
					])
					.where("transactionId", "=", transaction.id)
					.orderBy("side", "asc")
					.execute(),
			);
			const listingEvents = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select([
						"listingId",
						"event",
					])
					.where("listingId", "=", listing.id)
					.where("event", "=", "transaction")
					.execute(),
			);
			const userEvents = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("user_event")
					.select([
						"userId",
						"scope",
						"event",
						"group",
					])
					.where("group", "=", keyOf(transaction.id))
					.where("event", "=", "transaction.create")
					.execute(),
			);
			const sellerActivity = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"type",
						"userId",
						"payload",
					])
					.where("userId", "=", seller.id)
					.where("type", "=", "buyer-message")
					.execute(),
			);

			expect(statusEntries).toHaveLength(1);
			expect(statusEntries[0]).toMatchObject({
				kind: "status-interest",
				userId: buyer.id,
				payload: {
					text: "status-interest",
				},
			});
			expect(participants).toHaveLength(2);
			expect(participants).toEqual(
				expect.arrayContaining([
					{
						userId: buyer.id,
						side: "buyer",
					},
					{
						userId: seller.id,
						side: "seller",
					},
				]),
			);
			expect(listingEvents).toHaveLength(1);
			expect(userEvents).toHaveLength(2);
			expect(
				userEvents.some((event) => event.userId === buyer.id && event.scope === "user"),
			).toBe(true);
			expect(
				userEvents.some((event) => event.userId === seller.id && event.scope === "foreign"),
			).toBe(true);
			expect(
				sellerActivity.some(
					(item) =>
						item.type === "buyer-message" &&
						"transactionId" in item.payload &&
						item.payload.transactionId === transaction.id,
				),
			).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
