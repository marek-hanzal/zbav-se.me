import { describe, expect, it } from "vitest";
import { ignoreCollectionFx } from "~/buyer-listing-ignore/fx/ignoreCollectionFx";
import { ignoreCountFx } from "~/buyer-listing-ignore/fx/ignoreCountFx";
import { ignoreFetchFx } from "~/buyer-listing-ignore/fx/ignoreFetchFx";
import { ignoreToggleFx } from "~/buyer-listing-ignore/fx/ignoreToggleFx";
import { runToggleReadModelContractFn } from "~/test/@buyer/common/fx/runToggleReadModelContractFn";

describe("ignore read model", () => {
	it("collection, fetch and count reflect toggle state and respect scope", async () => {
		return runToggleReadModelContractFn({
			databaseName: "ignoreReadModelFx",
			userSlug: "ignore-read",
			toggleOnFx: ({ users, listing }) =>
				ignoreToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					toggle: true,
				}),
			toggleOffFx: ({ users, listing }) =>
				ignoreToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					toggle: false,
				}),
			collectionFx: (_, userId) =>
				ignoreCollectionFx({
					scope: {
						userId,
					},
				}),
			fetchFx: ({ listing }, userId) =>
				ignoreFetchFx({
					scope: {
						userId,
					},
					where: {
						listingId: listing.id,
					},
				}),
			countFx: (_, userId) =>
				ignoreCountFx({
					scope: {
						userId,
					},
				}),
			filteredCollectionFx: ({ listing }, userId, itemId) =>
				ignoreCollectionFx({
					scope: {
						userId,
					},
					where: {
						listingId: listing.id,
						idIn: [
							itemId,
							"foreign-ignore-id",
						],
					},
				}),
			filteredCountFx: ({ listing }, userId) =>
				ignoreCountFx({
					scope: {
						userId,
					},
					where: {
						listingId: listing.id,
					},
				}),
			assertFetchedFn: (item, { listing }) => {
				expect(item.listingId).toBe(listing.id);
			},
		});
	});
});
