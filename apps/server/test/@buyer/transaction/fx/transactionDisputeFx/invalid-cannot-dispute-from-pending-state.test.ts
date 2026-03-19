import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/@buyer/transaction/fx/transactionCreateFx";
import { transactionDisputeFx } from "~/@buyer/transaction/fx/transactionDisputeFx";
import { auth } from "~/auth/auth";
import { createListingFx, withRuntimeFx } from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionDisputeFx (buyer)", () => {
	it("invalid: cannot dispute from pending state", async () => {
		const database = await testabase("buyerDisputeFx-invalid-from-pending");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@dispute-invalid.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);
			const { user: buyer } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "buyer@dispute-invalid.cz",
						name: "Buyer",
						password: "12345678",
					},
				}),
			);

			const listing = yield* createListingFx(seller.id);
			yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyer.id,
			});

			const tx = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow(),
			);

			const result = yield* Effect.either(
				transactionDisputeFx({
					transactionId: tx.id,
					userId: buyer.id,
				}),
			);

			expect(result._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
