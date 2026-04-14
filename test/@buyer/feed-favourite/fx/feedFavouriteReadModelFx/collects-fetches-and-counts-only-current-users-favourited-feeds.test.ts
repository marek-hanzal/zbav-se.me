import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedFavouriteCollectionFx } from "~/buyer/feed-favourite/server/fx/feedFavouriteCollectionFx";
import { feedFavouriteCountFx } from "~/buyer/feed-favourite/server/fx/feedFavouriteCountFx";
import { feedFavouriteFetchFx } from "~/buyer/feed-favourite/server/fx/feedFavouriteFetchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("feedFavouriteReadModelFx", () => {
	it("collects, fetches and counts only current user's favourited feeds with per-feed counts", async () => {
		const database = await testabase("feedFavouriteReadModel-counts");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

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

			expectTaggedErrorFx(foreignFetch, {
				tag: "NotFoundErrorFx",
			});

			const count = yield* feedFavouriteCountFx({
				userId: buyer.id,
				scope: {},
			});

			expect(count).toBe(2);

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
			expect(strangerCount).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
