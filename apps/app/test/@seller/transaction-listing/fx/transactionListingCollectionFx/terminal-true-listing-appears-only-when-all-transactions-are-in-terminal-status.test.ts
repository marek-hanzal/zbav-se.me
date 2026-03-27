import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/@seller/transaction/fx/transactionRejectFx";
import { transactionListingCollectionFx } from "~/@seller/transaction-listing/fx/transactionListingCollectionFx";
import { auth } from "~/auth/auth";
import { testabase } from "~/test/testabase";
import { createPendingScenarioFx } from "~/test/utils/createPendingScenarioFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("terminal: true — listing appears only when all transactions are in terminal status", async () => {
		const database = await testabase("txListing-terminal");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@txlisting-terminal.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@txlisting-terminal.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { listingId } = await createPendingScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const tx = await database.kysely
			.selectFrom("transaction")
			.select("id")
			.where("listingId", "=", listingId)
			.executeTakeFirstOrThrow();

		// Not terminal yet (pending is non-terminal)
		const notTerminal = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: true,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(notTerminal.map((l) => l.id)).not.toContain(listingId);

		// Reject → terminal status
		await Effect.gen(function* () {
			yield* transactionRejectFx({
				transactionId: tx.id,
				userId: seller.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const terminal = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: true,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(terminal.map((l) => l.id)).toContain(listingId);
	});
});
