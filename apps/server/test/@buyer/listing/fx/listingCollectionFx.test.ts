import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/@buyer/listing/fx/listingCollectionFx";
import { auth } from "~/auth/auth";
import { testabase } from "~test/testabase";
import {
	createListingFx,
	createOpenScenarioFx,
	createResolvedScenarioFx,
	withRuntimeFx,
} from "~test/fixture/transactionFixture";

describe("listingCollectionFx (buyer) — listing status visibility", () => {
	it("live listing is visible to buyer before any transaction", async () => {
		const database = await testabase("listingCollection-live-visible");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@listing-live.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@listing-live.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		const listing = await createListingFx(seller.id).pipe(
			withRuntimeFx(database),
			Effect.runPromise,
		);

		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				userId: buyer.id,
				scope: {},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = collection.map((l) => l.id);
		expect(ids).toContain(listing.id);
	});

	it("sold listing is NOT visible to buyer (only live listings shown)", async () => {
		const database = await testabase("listingCollection-sold-hidden");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@listing-sold.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@listing-sold.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		// Resolve transaction → listing becomes "sold"
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

		// Buyer listing collection must not return this listing
		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				userId: buyer.id,
				scope: {},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = collection.map((l) => l.id);
		expect(ids).not.toContain(listingId);
	});

	it("listing remains visible while transaction is open (not yet sold)", async () => {
		const database = await testabase("listingCollection-open-still-live");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@listing-open.cz",
				name: "Seller",
				password: "12345678",
			},
		});
		const { user: buyer } = await api.signUpEmail({
			body: {
				email: "buyer@listing-open.cz",
				name: "Buyer",
				password: "12345678",
			},
		});

		// Accept transaction → listing is still "live"
		const { listingId } = await createOpenScenarioFx({
			sellerId: seller.id,
			buyerId: buyer.id,
			database,
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const { status } = await database.kysely
			.selectFrom("listing")
			.select("status")
			.where("id", "=", listingId)
			.executeTakeFirstOrThrow();

		expect(status).toBe("live");

		const collection = await Effect.gen(function* () {
			return yield* listingCollectionFx({
				userId: buyer.id,
				scope: {},
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const ids = collection.map((l) => l.id);
		expect(ids).toContain(listingId);
	});
});
