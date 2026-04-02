import { describe, it } from "vitest";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { runToggleEntityErrorContractFx } from "~/test/@buyer/common/fx/runToggleEntityErrorContractFx";

describe("favouriteToggleFx", () => {
	it("invalid: seller cannot favourite own listing", async () => {
		return runToggleEntityErrorContractFx({
			databaseName: "favouriteToggle-own-listing",
			userSlug: "fav-own",
			createExtraFx: ({ users }) =>
				feedCreateFx({
					userId: users.seller.id,
					type: "user",
					name: "Test feed",
					query: {},
				}),
			errorFx: ({ users, listing, extra: feed }) =>
				favouriteToggleFx({
					userId: users.seller.id,
					listingId: listing.id,
					feedId: feed.id,
					toggle: true,
				}),
		});
	});
});
