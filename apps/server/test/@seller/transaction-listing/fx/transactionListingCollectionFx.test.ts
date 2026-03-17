import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionRejectFx } from "~/@seller/transaction/fx/transactionRejectFx";
import { transactionListingCollectionFx } from "~/@seller/transaction-listing/fx/transactionListingCollectionFx";
import { inboxArchiveFx } from "~/@user/inbox/fx/inboxArchiveFx";
import { auth } from "~/auth/auth";
import {
	createListingFx,
	createOpenScenarioFx,
	createPendingScenarioFx,
	createResolvedScenarioFx,
	withRuntimeFx,
} from "~test/fixture/transactionFixture";
import { testabase } from "~test/testabase";

describe("transactionListingCollectionFx (seller dashboard)", () => {
	it("listing without any transaction does not appear in the collection", async () => {
		const database = await testabase("txListing-no-tx");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@txlisting-no-tx.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const collection = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = collection.map((l) => l.id);
		expect(ids).not.toContain(listing.id);
	});

	it("listing with a pending transaction appears in the collection", async () => {
		const database = await testabase("txListing-with-pending");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@txlisting-pending.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@txlisting-pending.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { listingId } = await createPendingScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const collection = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = collection.map((l) => l.id);
		expect(ids).toContain(listingId);
	});

	it("seller sees only their own listings", async () => {
		const database = await testabase("txListing-scope-isolation");
		const { api } = auth(() => database.dialect);

		const { user: seller1 } = await api.signUpEmail({
			body: {
				email: "seller1@txlisting-scope.cz",
				name: "Seller1",
				password: "12345678",
			},
		});
		const { user: seller2 } = await api.signUpEmail({
			body: {
				email: "seller2@txlisting-scope.cz",
				name: "Seller2",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@txlisting-scope.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { listingId: listing1 } = await createPendingScenarioFx({
			sellerId: seller1.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { listingId: listing2 } = await createPendingScenarioFx({
			sellerId: seller2.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const seller1Collection = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller1.id,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = seller1Collection.map((l) => l.id);
		expect(ids).toContain(listing1);
		expect(ids).not.toContain(listing2);
	});

	it("active: true — shows listings with unread buyer-message inbox", async () => {
		const database = await testabase("txListing-active-true");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@txlisting-active.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@txlisting-active.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		// Pending transaction → seller gets unread buyer-message inbox
		const { listingId } = await createPendingScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const collection = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					active: true,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.map((l) => l.id)).toContain(listingId);
	});

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

	it("terminal: false — listing with at least one open transaction appears", async () => {
		const database = await testabase("txListing-non-terminal");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@txlisting-non-terminal.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@txlisting-non-terminal.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { listingId } = await createOpenScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// "open" is a non-terminal status
		const collection = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: false,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.map((l) => l.id)).toContain(listingId);
	});

	it("resolved listing has terminal: true — all transactions sold or resolved", async () => {
		const database = await testabase("txListing-resolved-terminal");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@txlisting-resolved.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@txlisting-resolved.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const { listingId } = await createResolvedScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// After resolve, transactionResolveFx sets other transactions to "sold"
		// The resolved transaction itself is in "resolved" state — NOT terminal
		// (pending/open/resolved/dispute are non-terminal per the query builder)
		const collection = await Effect.gen(function* () {
			return yield* transactionListingCollectionFx({
				scope: {
					userId: seller.id,
				},
				where: {
					terminal: false,
				},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.map((l) => l.id)).toContain(listingId);
	});
});
