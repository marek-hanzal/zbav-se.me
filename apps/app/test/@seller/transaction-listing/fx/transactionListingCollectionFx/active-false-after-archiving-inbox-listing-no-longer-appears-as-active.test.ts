import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionListingCollectionFx } from "~/server/@seller/transaction-listing/fx/transactionListingCollectionFx";
import { inboxArchiveFx } from "~/server/@user/inbox/fx/inboxArchiveFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("active: false — after archiving inbox, listing no longer appears as active", async () => {
		const database = await testabase("txListing-active-archived");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@txlisting-archived.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@txlisting-archived.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { listingId } = await createPendingScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Verify it appears as active before archiving
		const before = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					active: true,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(before.map((l) => l.id)).toContain(listingId);

		// Seller archives the inbox for this listing
		await Effect.gen(function* () {
			yield* inboxArchiveFx({
				scope: {
					userId: seller.id,
				},
				where: {
					reference: listingId,
					family: "transaction",
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Now it should NOT appear as active
		const after = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					active: true,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(after.map((l) => l.id)).not.toContain(listingId);
	});
});
