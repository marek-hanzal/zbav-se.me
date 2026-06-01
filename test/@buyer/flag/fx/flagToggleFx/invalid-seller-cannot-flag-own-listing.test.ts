import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/buyer/listing-flag/server/fx/flagToggleFx";
import { runToggleEntityErrorContractFx } from "~/test/@buyer/common/fx/runToggleEntityErrorContractFx";

describe("flagToggleFx", () => {
	it("invalid: seller cannot flag own listing", async () => {
		return runToggleEntityErrorContractFx({
			databaseName: "flagToggle-own-listing",
			userSlug: "flag-own",
			expectedError: {
				tag: "InvalidRequestErrorFx",
				message: "You cannot flag your own listing",
			},
			errorFx: ({ users, listing }) =>
				flagToggleFx({
					userId: users.seller.id,
					listingId: listing.id,
					toggle: true,
				}),
			assertAfterFx: ({ database, users, listing }) =>
				Effect.promise(async () => {
					const flag = await database.kysely
						.selectFrom("listing_flag")
						.select("id")
						.where("listingId", "=", listing.id)
						.where("userId", "=", users.seller.id)
						.executeTakeFirst();
					const events = await database.kysely
						.selectFrom("listing_event")
						.select("id")
						.where("listingId", "=", listing.id)
						.execute();

					expect(flag).toBeUndefined();
					expect(events).toHaveLength(0);
				}),
		});
	});
});
