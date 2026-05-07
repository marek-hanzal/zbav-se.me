import { describe, expect, it } from "vitest";
import { flagCollectionFx } from "~/buyer/flag/server/fx/flagCollectionFx";
import { flagCountFx } from "~/buyer/flag/server/fx/flagCountFx";
import { flagFetchFx } from "~/buyer/flag/server/fx/flagFetchFx";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { runToggleReadModelContractFx } from "~/test/@buyer/common/fx/runToggleReadModelContractFx";

describe("flag read model", () => {
	it("collection, fetch and count reflect toggle state and respect scope", async () => {
		return runToggleReadModelContractFx({
			databaseName: "flagReadModelFx",
			userSlug: "flag-read",
			toggleOnFx: ({ users, listing }) =>
				flagToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					toggle: true,
				}),
			toggleOffFx: ({ users, listing }) =>
				flagToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					toggle: false,
				}),
			collectionFx: (_, userId) =>
				flagCollectionFx({
					scope: {
						userId,
					},
				}),
			fetchFx: ({ listing }, userId) =>
				flagFetchFx({
					scope: {
						userId,
					},
					where: {
						listingId: listing.id,
					},
				}),
			countFx: (_, userId) =>
				flagCountFx({
					scope: {
						userId,
					},
				}),
			filteredCollectionFx: ({ listing }, userId, itemId) =>
				flagCollectionFx({
					scope: {
						userId,
					},
					where: {
						listingId: listing.id,
						idIn: [
							itemId,
							"foreign-flag-id",
						],
					},
				}),
			filteredCountFx: ({ listing }, userId) =>
				flagCountFx({
					scope: {
						userId,
					},
					where: {
						listingId: listing.id,
					},
				}),
			assertFetched: (item, { listing }) => {
				expect(item.listingId).toBe(listing.id);
			},
		});
	});
});
