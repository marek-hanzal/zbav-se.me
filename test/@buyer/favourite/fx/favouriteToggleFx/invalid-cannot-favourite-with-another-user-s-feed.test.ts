import { describe, it } from "vitest";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { runToggleEntityErrorContractFx } from "~/test/@buyer/common/fx/runToggleEntityContractFx";

describe("favouriteToggleFx", () => {
	it("invalid: cannot favourite with another user's feed", async () => {
		return runToggleEntityErrorContractFx({
			databaseName: "favouriteToggle-wrong-feed",
			userSlug: "fav-wrong-feed",
			createExtraFx: ({ users }) =>
				feedCreateFx({
					userId: users.stranger.id,
					type: "user",
					name: "Other's feed",
					query: {},
				}),
			errorFx: ({ users, listing, extra: otherFeed }) =>
				favouriteToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					feedId: otherFeed.id,
					toggle: true,
				}),
		});
	});
});
