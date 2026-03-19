import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionCloseFx } from "~/@buyer/transaction/fx/transactionCloseFx";
import { transactionCollectionFx } from "~/@buyer/transaction/fx/transactionCollectionFx";
import { transactionCountFx } from "~/@buyer/transaction/fx/transactionCountFx";
import { transactionDisputeFx } from "~/@buyer/transaction/fx/transactionDisputeFx";
import { transactionRejectFx } from "~/@buyer/transaction/fx/transactionRejectFx";
import { transactionAcceptFx } from "~/@seller/transaction/fx/transactionAcceptFx";
import { transactionResolveFx } from "~/@seller/transaction/fx/transactionResolveFx";
import { auth } from "~/auth/auth";
import {
	createPendingScenarioFx,
	createResolvedScenarioFx,
	withRuntimeFx,
} from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionLifecycleEdgeCases (buyer)", () => {
	it("expired: transaction with short expiration transitions to expired", async () => {
		const database = await testabase("buyerCloseFx-expired");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@expired.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@expired.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const tx = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			yield* transactionAcceptFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			const { status } = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow();
			});

			expect(status).toBe("resolved");

			yield* transactionCloseFx({
				transactionId: tx.id,
				userId: buyer.id,
			});

			const { status: statusAfterClose } = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow();
			});

			expect(statusAfterClose).toBe("closed");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("concurrent: buyer rejects while seller is resolving", async () => {
		const database = await testabase("buyerCloseFx-concurrent");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@concurrent.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@concurrent.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const tx = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			yield* transactionAcceptFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			expect(
				yield* transactionRejectFx({
					transactionId: tx.id,
					userId: buyer.id,
				}),
			).rejects.toThrow();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("dispute: buyer initiates dispute and seller resolves in buyer's favor", async () => {
		const database = await testabase("buyerCloseFx-dispute");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@dispute.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@dispute.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const tx = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			yield* transactionAcceptFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			yield* transactionDisputeFx({
				transactionId: tx.id,
				userId: buyer.id,
			});

			const { status: statusAfterDispute } = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow();
			});

			expect(statusAfterDispute).toBe("dispute");

			yield* transactionResolveFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			const { status: statusAfterResolve } = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("transaction")
					.select("status")
					.where("id", "=", tx.id)
					.executeTakeFirstOrThrow();
			});

			expect(statusAfterResolve).toBe("resolved");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("multiple entries: verify all transaction entries are created correctly", async () => {
		const database = await testabase("buyerCloseFx-multiple-entries");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@multiple.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@multiple.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

			const { listingId } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const tx = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			yield* transactionAcceptFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx.id,
				userId: seller.id,
			});

			yield* transactionCloseFx({
				transactionId: tx.id,
				userId: buyer.id,
			});

			const entries = yield* Effect.promise(async () => {
				return database.kysely
					.selectFrom("transaction_entry")
					.select([
						"kind",
						"createdAt",
					])
					.where("transactionId", "=", tx.id)
					.orderBy("createdAt", "asc")
					.execute();
			});

			const kinds = entries.map((e) => e.kind);
			expect(kinds).toContain("status-pending");
			expect(kinds).toContain("status-resolved");
			expect(kinds).toContain("status-closed");
			expect(entries.length).toBeGreaterThanOrEqual(3);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("invalid: cannot close already-closed transaction", async () => {
		const database = await testabase("buyerCloseFx-double-close-edge");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@double-close.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@double-close.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

			const { transactionId } = yield* createResolvedScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
				database,
			});

			yield* transactionCloseFx({
				transactionId,
				userId: buyer.id,
			});

			expect(
				yield* transactionCloseFx({
					transactionId,
					userId: buyer.id,
				}),
			).rejects.toThrow();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("fetch: verify transaction fetch with filters returns correct data", async () => {
		const database = await testabase("buyerCloseFx-fetch-filter");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@fetch-filter.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@fetch-filter.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

			const { listingId: listingId1 } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const { listingId: listingId2 } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const tx1 = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId1)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			const tx2 = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId2)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			yield* transactionAcceptFx({
				transactionId: tx1.id,
				userId: seller.id,
			});

			yield* transactionAcceptFx({
				transactionId: tx2.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx1.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx2.id,
				userId: seller.id,
			});

			const result = yield* transactionCollectionFx({
				where: {
					userId: buyer.id,
				},
				scope: {
					userId: buyer.id,
				},
			});

			expect(result).toHaveLength(2);
			const transactionIds = result.map((t) => t.id);
			expect(transactionIds).toContain(tx1.id);
			expect(transactionIds).toContain(tx2.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("count: verify transaction count accuracy", async () => {
		const database = await testabase("buyerCloseFx-count");

		return Effect.gen(function* () {
			const { api } = auth(() => database.dialect);

			const { user: seller } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "seller@count.cz",
						name: "Seller",
						password: "12345678",
					},
				});
			});
			const { user: buyer } = yield* Effect.promise(async () => {
				return api.signUpEmail({
					body: {
						email: "buyer@count.cz",
						name: "Buyer",
						password: "12345678",
					},
				});
			});

			const { listingId: listingId1 } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const { listingId: listingId2 } = yield* createPendingScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const countBefore = yield* transactionCountFx({
				where: {
					userId: buyer.id,
				},
				scope: {
					userId: buyer.id,
				},
			});

			expect(countBefore.where).toBe(2);

			const tx1 = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId1)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			const tx2 = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("transaction")
					.select("id")
					.where("listingId", "=", listingId2)
					.where("userId", "=", buyer.id)
					.executeTakeFirstOrThrow();
			});

			yield* transactionAcceptFx({
				transactionId: tx1.id,
				userId: seller.id,
			});

			yield* transactionAcceptFx({
				transactionId: tx2.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx1.id,
				userId: seller.id,
			});

			yield* transactionResolveFx({
				transactionId: tx2.id,
				userId: seller.id,
			});

			const countAfter = yield* transactionCountFx({
				where: {
					userId: buyer.id,
				},
				scope: {
					userId: buyer.id,
				},
			});

			expect(countAfter.where).toBe(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
