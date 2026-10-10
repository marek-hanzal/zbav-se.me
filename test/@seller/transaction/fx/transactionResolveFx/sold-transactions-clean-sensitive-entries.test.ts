import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/buyer-transaction/fx/transactionCreateFx";
import { transactionAcceptFx } from "~/seller-transaction/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/seller-transaction/fx/transactionResolveFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("transactionResolveFx — sold cleanup", () => {
	it("deletes sensitive entries for other transactions moved to sold", async () => {
		const database = await testabaseFn("transactionResolveFx-sold-cleanup");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyerB = yield* leaseTestUserFx({});
			const buyerC = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id, {
				title: "Test listing for sold cleanup",
			});

			const txB = yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyerB.id,
			});

			const txC = yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyerC.id,
			});

			yield* transactionAcceptFx({
				transactionId: txB.id,
				userId: seller.id,
			});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("transaction_entry")
					.values([
						{
							id: "txC-location",
							transactionId: txC.id,
							kind: "location",
							userId: buyerC.id,
							payload: {
								text: "pickup spot",
							},
							createdAt: new Date(),
						},
						{
							id: "txC-package",
							transactionId: txC.id,
							kind: "package",
							userId: seller.id,
							payload: {
								text: "tracking info",
							},
							createdAt: new Date(),
						},
						{
							id: "txC-personal",
							transactionId: txC.id,
							kind: "personal",
							userId: buyerC.id,
							payload: {
								text: "personal note",
							},
							createdAt: new Date(),
						},
						{
							id: "txC-text",
							transactionId: txC.id,
							kind: "text",
							userId: buyerC.id,
							payload: {
								text: "keep me",
							},
							createdAt: new Date(),
						},
					])
					.execute(),
			);

			yield* transactionResolveFx({
				transactionId: txB.id,
				userId: seller.id,
			});

			const remaining = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction_entry")
					.select("kind")
					.where("transactionId", "=", txC.id)
					.execute(),
			);

			const kinds = remaining.map((entry) => entry.kind);

			expect(kinds).not.toContain("location");
			expect(kinds).not.toContain("package");
			expect(kinds).not.toContain("personal");
			expect(kinds).toContain("text");
			expect(kinds).toContain("status-sold");
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
