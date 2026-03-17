import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCreateFx } from "~/@buyer/transaction/fx/transactionCreateFx";
import { transactionDisputeFx } from "~/@buyer/transaction/fx/transactionDisputeFx";
import { transactionResolveFx } from "~/@seller/transaction/fx/transactionResolveFx";
import { auth } from "~/auth/auth";
import {
	createListingFx,
	createResolvedScenarioFx,
	withRuntimeFx,
} from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionDisputeFx (buyer)", () => {
	it("resolved → dispute: status changes and status-dispute-buyer entry is created", async () => {
		const database = await testabase("buyerDisputeFx-resolved-to-dispute");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@buyer-dispute.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@buyer-dispute.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { transactionId } = await createResolvedScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		await Effect.gen(function* () {
			yield* transactionDisputeFx({
				transactionId,
				userId: buyer.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("transaction")
			.select("status")
			.where("id", "=", transactionId)
			.executeTakeFirstOrThrow();

		expect(status).toBe("dispute");

		const entries = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", transactionId)
			.execute();

		const kinds = entries.map((e) => e.kind);
		expect(kinds).toContain("status-resolved");
		expect(kinds).toContain("status-dispute-buyer");
		expect(kinds).not.toContain("status-dispute-seller");
	});

	it("dispute → resolved: seller re-resolves dispute and status-resolved entry is created", async () => {
		const database = await testabase("buyerDisputeFx-dispute-to-resolved");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@dispute-re-resolve.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@dispute-re-resolve.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { transactionId } = await createResolvedScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Buyer opens dispute
		await Effect.gen(function* () {
			yield* transactionDisputeFx({
				transactionId,
				userId: buyer.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Seller re-resolves the dispute
		await Effect.gen(function* () {
			yield* transactionResolveFx({
				transactionId,
				userId: seller.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("transaction")
			.select("status")
			.where("id", "=", transactionId)
			.executeTakeFirstOrThrow();

		expect(status).toBe("resolved");

		const entries = await database.kysely
			.selectFrom("transaction_entry")
			.select("kind")
			.where("transactionId", "=", transactionId)
			.orderBy("createdAt", "asc")
			.execute();

		const kinds = entries.map((e) => e.kind);
		expect(kinds).toContain("status-dispute-buyer");
		// Two status-resolved entries: initial resolve + re-resolve after dispute
		expect(kinds.filter((k) => k === "status-resolved")).toHaveLength(2);
	});

	it("invalid: cannot dispute from pending state", async () => {
		const database = await testabase("buyerDisputeFx-invalid-from-pending");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@dispute-invalid.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@dispute-invalid.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		await Effect.gen(function* () {
			const listing = yield* createListingFx(seller.id);
			yield* transactionCreateFx({
				listingId: listing.id,
				userId: buyer.id,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const tx = await database.kysely
			.selectFrom("transaction")
			.select("id")
			.where("userId", "=", buyer.id)
			.executeTakeFirstOrThrow();

		await expect(
			Effect.gen(function* () {
				yield* transactionDisputeFx({
					transactionId: tx.id,
					userId: buyer.id,
				});
			}).pipe(withRuntimeFx(database), Effect.runPromise),
		).rejects.toThrow();
	});
});
