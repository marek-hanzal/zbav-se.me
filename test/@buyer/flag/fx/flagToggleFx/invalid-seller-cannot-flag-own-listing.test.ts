import { describe, it } from "vitest";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { runToggleEntityErrorContractFx } from "~/test/@buyer/common/fx/runToggleEntityContractFx";

describe("flagToggleFx", () => {
	it("invalid: seller cannot flag own listing", async () => {
		return runToggleEntityErrorContractFx({
			databaseName: "flagToggle-own-listing",
			userSlug: "flag-own",
			errorFx: ({ users, listing }) =>
				flagToggleFx({
					userId: users.seller.id,
					listingId: listing.id,
					toggle: true,
				}),
		});
	});
});
