import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/@seller/listing/fx/listingCollectionFx";
import { auth } from "~/auth/auth";
import { testabase } from "~test/testabase";
import {
	createListingFx,
	createResolvedScenarioFx,
	withRuntimeFx,
} from "~test/fixture/transactionFixture";

describe("listingCollectionFx (seller)", () => {
	it("seller sees their own live listing", async () => {
		const database = await testabase("sellerListing-live");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: { email: "seller@seller-listing-live.cz", name: "Seller", password: "12345678" },
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				scope: { userId: seller.id },
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.map((l) => l.id)).toContain(listing.id);
	});

	it("seller sees their sold listing (unlike buyer who only sees live)", async () => {
		const database = await testabase("sellerListing-sold-visible");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@seller-listing-sold.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@seller-listing-sold.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		// Resolve → listing becomes "sold"
		const { listingId } = await createResolvedScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("listing")
			.select("status")
			.where("id", "=", listingId)
			.executeTakeFirstOrThrow();

		expect(status).toBe("sold");

		// Seller listing collection has no status filter — sold listing is visible
		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				scope: { userId: seller.id },
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.map((l) => l.id)).toContain(listingId);
	});

	it("seller does not see other sellers' listings", async () => {
		const database = await testabase("sellerListing-isolation");
		const { api } = auth(() => database.dialect);

		const { user: seller1 } = await api.signUpEmail({
			body: {
				email: "seller1@seller-listing-iso.cz",
				name: "Seller1",
				password: "12345678",
			},
		});
		const { user: seller2 } = await api.signUpEmail({
			body: {
				email: "seller2@seller-listing-iso.cz",
				name: "Seller2",
				password: "12345678",
			},
		});

		const listing1 = await createListingFx(seller1.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);
		const listing2 = await createListingFx(seller2.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				scope: { userId: seller1.id },
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = collection.map((l) => l.id);
		expect(ids).toContain(listing1.id);
		expect(ids).not.toContain(listing2.id);
	});

	it("fulltext filter matches listing by title", async () => {
		const database = await testabase("sellerListing-fulltext");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@seller-listing-ft.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		// Two listings with different titles — fixture uses "Test listing"
		await createListingFx(seller.id).pipe(withRuntimeFx(database), Effect.runPromise);

		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				scope: { userId: seller.id },
				where: { fulltext: "Test listing" },
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(collection.length).toBeGreaterThanOrEqual(1);
		expect(collection.every((l) => l.title.toLowerCase().includes("test"))).toBe(true);

		// Non-matching search returns empty
		const empty = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				scope: { userId: seller.id },
				where: { fulltext: "xyzzy-nonexistent-title" },
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(empty).toHaveLength(0);
	});
});
