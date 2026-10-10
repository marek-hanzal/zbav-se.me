import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer-feed/fx/feedCreateFx";
import { favouriteCollectionFx } from "~/buyer-listing-favourite/fx/favouriteCollectionFx";
import { favouriteCountFx } from "~/buyer-listing-favourite/fx/favouriteCountFx";
import { favouriteFetchFx } from "~/buyer-listing-favourite/fx/favouriteFetchFx";
import { favouriteToggleFx } from "~/buyer-listing-favourite/fx/favouriteToggleFx";
import { runToggleReadModelContractFx } from "~/test/@buyer/common/fx/runToggleReadModelContractFx";

describe("favourite read model", () => {
	it("collection, fetch and count reflect toggle state and respect scope", async () => {
		return runToggleReadModelContractFx({
			databaseName: "favouriteReadModelFx",
			userSlug: "favourite-read",
			createExtraFx: ({ users }) =>
				feedCreateFx({
					userId: users.buyer.id,
					type: "user",
					name: "Favourite feed",
					query: {},
				}),
			toggleOnFx: ({ users, listing, extra: feed }) =>
				favouriteToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					feedId: feed.id,
					toggle: true,
				}),
			toggleOffFx: ({ users, listing, extra: feed }) =>
				favouriteToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					feedId: feed.id,
					toggle: false,
				}),
			collectionFx: (_, userId) =>
				favouriteCollectionFx({
					scope: {
						userId,
					},
				}),
			fetchFx: ({ listing }, userId) =>
				favouriteFetchFx({
					scope: {
						userId,
					},
					where: {
						listingId: listing.id,
					},
				}),
			countFx: (_, userId) =>
				favouriteCountFx({
					scope: {
						userId,
					},
				}),
			filteredCollectionFx: ({ listing }, userId, itemId) =>
				favouriteCollectionFx({
					scope: {
						userId,
					},
					where: {
						listingId: listing.id,
						idIn: [
							itemId,
							"foreign-favourite-id",
						],
					},
				}),
			filteredCountFx: ({ listing }, userId) =>
				favouriteCountFx({
					scope: {
						userId,
					},
					where: {
						listingId: listing.id,
					},
				}),
			assertFetched: (item, { listing, extra: feed }) => {
				expect(item.listingId).toBe(listing.id);
				expect(item.feedId).toBe(feed.id);
			},
		});
	});
});
