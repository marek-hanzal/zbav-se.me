import { describe, it } from "vitest";
import { ignoreToggleFx } from "~/buyer/ignore/server/fx/ignoreToggleFx";
import { runToggleEntityErrorContractFx } from "~/test/@buyer/common/fx/runToggleEntityContractFx";

describe("ignoreToggleFx", () => {
	it("invalid: seller cannot ignore own listing", async () => {
		return runToggleEntityErrorContractFx({
			databaseName: "ignoreToggle-own-listing",
			userSlug: "ignore-own",
			errorFx: ({ users, listing }) =>
				ignoreToggleFx({
					userId: users.seller.id,
					listingId: listing.id,
					toggle: true,
				}),
		});
	});
});
