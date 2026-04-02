import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteCollectionFx } from "~/buyer/favourite/server/fx/favouriteCollectionFx";
import { favouriteCountFx } from "~/buyer/favourite/server/fx/favouriteCountFx";
import { favouriteFetchFx } from "~/buyer/favourite/server/fx/favouriteFetchFx";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

describe("favourite read model", () => {
	it("collection, fetch and count reflect toggle state and respect scope", async () => {
		const database = await testabase("favouriteReadModelFx");
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
				"favourite-read-seller@test.cz",
				"Favourite Read Seller",
			);
			const { user: buyer } = yield* signUp(
				"favourite-read-buyer@test.cz",
				"Favourite Read Buyer",
			);
			const { user: stranger } = yield* signUp(
				"favourite-read-stranger@test.cz",
				"Favourite Read Stranger",
			);

			const listing = yield* createListingFx(seller.id);
			const feed = yield* feedCreateFx({
				userId: buyer.id,
				type: "user",
				name: "Favourite feed",
				query: {},
			});

			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				feedId: feed.id,
				toggle: true,
			});

			const collection = yield* favouriteCollectionFx({
				scope: {
					userId: buyer.id,
				},
			});

			expect(collection).toHaveLength(1);

			const favourite = yield* favouriteFetchFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: listing.id,
				},
			});

			expect(favourite.listingId).toBe(listing.id);
			expect(favourite.feedId).toBe(feed.id);

			const count = yield* favouriteCountFx({
				scope: {
					userId: buyer.id,
				},
			});

			expect(count.total).toBe(1);

			const filteredCollection = yield* favouriteCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: listing.id,
					idIn: [
						favourite.id,
						"foreign-favourite-id",
					],
				},
			});
			const filteredCount = yield* favouriteCountFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: listing.id,
				},
			});

			expect(filteredCollection).toHaveLength(1);
			expect(filteredCollection[0]?.id).toBe(favourite.id);
			expect(filteredCount.where).toBe(1);

			const strangerCollection = yield* favouriteCollectionFx({
				scope: {
					userId: stranger.id,
				},
			});

			expect(strangerCollection).toEqual([]);

			yield* favouriteToggleFx({
				userId: buyer.id,
				listingId: listing.id,
				feedId: feed.id,
				toggle: false,
			});

			const afterCollection = yield* favouriteCollectionFx({
				scope: {
					userId: buyer.id,
				},
			});
			const afterCount = yield* favouriteCountFx({
				scope: {
					userId: buyer.id,
				},
			});
			const afterFetch = yield* Effect.either(
				favouriteFetchFx({
					scope: {
						userId: buyer.id,
					},
					where: {
						listingId: listing.id,
					},
				}),
			);

			expect(afterCollection).toEqual([]);
			expect(afterCount.total).toBe(0);
			expect(afterFetch._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
