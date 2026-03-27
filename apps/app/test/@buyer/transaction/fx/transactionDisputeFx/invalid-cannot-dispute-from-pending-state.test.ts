import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/@buyer/transaction/server/fx/transactionCreateFx";
import { transactionDisputeFx } from "~/@buyer/transaction/server/fx/transactionDisputeFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

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
