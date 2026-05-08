import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/buyer/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("buyer listing fulltext spotlight", () => {
	it("requires every fulltext term to match listing spotlight rows", async () => {
		const database = await testabase("buyer-listing-fulltext-and");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			const targetListing = yield* createListingFx(users.seller.id, {
				title: "Mobil telefon OnePlus Nord",
				description:
					"Pouzity one plus telefon pro kazdy mobil fanousek s rychlym nabijenim.",
			});
			yield* createListingFx(users.seller.id, {
				title: "Mobil telefon Xiaomi Redmi",
				description: "Spolehlivy telefon pro bezne pouziti a mobilni foceni.",
			});
			yield* createListingFx(users.seller.id, {
				title: "One Plus nabijecka",
				description: "Originalni one plus prislusenstvi pro mobil a cestovani.",
			});
			yield* createListingFx(users.seller.id, {
				title: "Tlacitkovy mobil",
				description: "Odolny telefon bez chytreho systemu.",
			});

			const where = {
				fulltext: [
					"mobil",
					"telefon",
					"one plus",
				],
			};

			const collection = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
				where,
			});
			const count = yield* listingCountFx({
				userId: users.buyer.id,
				scope: {},
				where,
			});

			expect(collection.map((item) => item.id)).toEqual([
				targetListing.id,
			]);
			expect(count).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
