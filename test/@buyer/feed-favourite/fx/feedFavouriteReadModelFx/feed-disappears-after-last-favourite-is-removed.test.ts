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
	it("removes a feed from favourite read model after its last favourite is toggled off", async () => {
		const database = await testabase("feedFavouriteReadModel-removal");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id);

			const feed = yield* feedCreateFx({
				userId: buyer.id,
				type: "search",
				name: "Disposable feed",
				query: {},
			});

			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				feedId: feed.id,
				toggle: true,
			});

			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				feedId: feed.id,
				toggle: false,
			});

			const collection = yield* feedFavouriteCollectionFx({
				userId: buyer.id,
				scope: {},
			});

			expect(collection).toEqual([]);

			const count = yield* feedFavouriteCountFx({
				userId: buyer.id,
				scope: {},
			});

			expect(count.total).toBe(0);
			expect(count.isEmpty).toBe(true);

			const fetched = yield* Effect.either(
				feedFavouriteFetchFx({
					userId: buyer.id,
					scope: {},
					where: {
						id: feed.id,
					},
				}),
			);

			expectTaggedErrorFx(fetched, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
