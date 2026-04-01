import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedFavouriteCollectionFx } from "~/buyer/feed-favourite/server/fx/feedFavouriteCollectionFx";
import { feedFavouriteCountFx } from "~/buyer/feed-favourite/server/fx/feedFavouriteCountFx";
import { feedFavouriteFetchFx } from "~/buyer/feed-favourite/server/fx/feedFavouriteFetchFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { createListingFx } from "~/test/utils/createListingFx";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("feedFavouriteReadModelFx", () => {
	it("collects, fetches and counts only current user's favourited feeds with per-feed counts", async () => {
		const database = await testabase("feedFavouriteReadModel-counts");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: seller } = yield* signUp(
				"feed-favourite-seller@test.cz",
				"Feed Favourite Seller",
			);
			const { user: buyer } = yield* signUp(
				"feed-favourite-buyer@test.cz",
				"Feed Favourite Buyer",
			);
			const { user: stranger } = yield* signUp(
				"feed-favourite-stranger@test.cz",
				"Feed Favourite Stranger",
			);

			const firstListing = yield* createListingFx(seller.id);
			const secondListing = yield* createListingFx(seller.id);
			const thirdListing = yield* createListingFx(seller.id);

			const macFeed = yield* feedCreateFx({
				userId: buyer.id,
				type: "search",
				name: "Mac feed",
				query: {
					where: {
						title: "macbook",
					},
				},
			});

			const alertsFeed = yield* feedCreateFx({
				userId: buyer.id,
				type: "user",
				name: "Alerts feed",
				query: {},
			});

			const strangerFeed = yield* feedCreateFx({
				userId: stranger.id,
				type: "search",
				name: "Stranger feed",
				query: {},
			});

			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: firstListing.id,
				feedId: macFeed.id,
				toggle: true,
			});
			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: secondListing.id,
				feedId: macFeed.id,
				toggle: true,
			});
			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: thirdListing.id,
				feedId: alertsFeed.id,
				toggle: true,
			});
			yield* favouriteToggleFx({
				userId: stranger.id,
				listingId: firstListing.id,
				feedId: strangerFeed.id,
				toggle: true,
			});

			const collection = yield* feedFavouriteCollectionFx({
				userId: buyer.id,
				scope: {},
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
			});

			expect(collection).toHaveLength(2);
			expect(collection.map((item) => item.id).sort()).toEqual(
				[
					alertsFeed.id,
					macFeed.id,
				].sort(),
			);

			const fetched = yield* feedFavouriteFetchFx({
				userId: buyer.id,
				scope: {},
				where: {
					id: macFeed.id,
				},
			});

			expect(fetched.id).toBe(macFeed.id);
			expect(fetched.count).toBe(2);
			expect(fetched.query.where?.title).toBe("macbook");

			const foreignFetch = yield* Effect.either(
				feedFavouriteFetchFx({
					userId: buyer.id,
					scope: {},
					where: {
						id: strangerFeed.id,
					},
				}),
			);

			expect(foreignFetch._tag).toBe("Left");

			const count = yield* feedFavouriteCountFx({
				userId: buyer.id,
				scope: {},
			});

			expect(count.total).toBe(2);
			expect(count.where).toBe(2);

			const strangerCollection = yield* feedFavouriteCollectionFx({
				userId: stranger.id,
				scope: {},
			});
			const strangerCount = yield* feedFavouriteCountFx({
				userId: stranger.id,
				scope: {},
			});

			expect(strangerCollection).toHaveLength(1);
			expect(strangerCollection[0]?.id).toBe(strangerFeed.id);
			expect(strangerCount.total).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
