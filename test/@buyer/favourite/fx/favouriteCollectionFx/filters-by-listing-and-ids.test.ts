import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteCollectionFx } from "~/buyer/favourite/server/fx/favouriteCollectionFx";
import { favouriteCountFx } from "~/buyer/favourite/server/fx/favouriteCountFx";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("favouriteCollectionFx", () => {
	it("filters by listing and idIn while staying scoped to the current user", async () => {
		const database = await testabase("favouriteCollectionFx-contract");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});
			const feed = yield* feedCreateFx({
				userId: buyer.id,
				type: "user",
				name: "Favourite Feed",
				query: {},
			});
			const firstListing = yield* createListingFx(seller.id, {
				title: "Favourite One",
			});
			const secondListing = yield* createListingFx(seller.id, {
				title: "Favourite Two",
			});

			yield* favouriteToggleFx({
				userId: buyer.id,
				feedId: feed.id,
				listingId: firstListing.id,
				toggle: true,
			});
			yield* favouriteToggleFx({
				userId: buyer.id,
				feedId: feed.id,
				listingId: secondListing.id,
				toggle: true,
			});

			const all = yield* favouriteCollectionFx({
				scope: {
					userId: buyer.id,
				},
			});

			const firstFavourite = all[0];

			if (!firstFavourite) {
				throw new Error("Expected favourite collection to contain at least one item");
			}

			const byListing = yield* favouriteCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: firstListing.id,
				},
			});
			const byIds = yield* favouriteCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					idIn: [
						firstFavourite.id,
						"missing-favourite-id",
					],
				},
			});
			const count = yield* favouriteCountFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: firstListing.id,
				},
			});
			const strangerCollection = yield* favouriteCollectionFx({
				scope: {
					userId: stranger.id,
				},
			});

			expect(all).toHaveLength(2);
			expect(byListing).toHaveLength(1);
			expect(byListing[0]?.id).toBe(firstFavourite.id);
			expect(byIds).toHaveLength(1);
			expect(byIds[0]?.id).toBe(firstFavourite.id);
			expect(count).toBe(1);
			expect(strangerCollection).toEqual([]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
