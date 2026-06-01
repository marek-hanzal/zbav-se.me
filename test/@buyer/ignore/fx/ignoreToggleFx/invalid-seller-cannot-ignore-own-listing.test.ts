import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ignoreToggleFx } from "~/buyer/listing-ignore/server/fx/ignoreToggleFx";
import { runToggleEntityErrorContractFx } from "~/test/@buyer/common/fx/runToggleEntityErrorContractFx";

describe("ignoreToggleFx", () => {
	it("invalid: seller cannot ignore own listing", async () => {
		return runToggleEntityErrorContractFx({
			databaseName: "ignoreToggle-own-listing",
			userSlug: "ignore-own",
			expectedError: {
				tag: "InvalidRequestErrorFx",
				message: "You cannot ignore your own listing",
			},
			errorFx: ({ users, listing }) =>
				ignoreToggleFx({
					userId: users.seller.id,
					listingId: listing.id,
					toggle: true,
				}),
			assertAfterFx: ({ database, users, listing }) =>
				Effect.promise(async () => {
					const ignore = await database.kysely
						.selectFrom("listing_ignore")
						.select("id")
						.where("listingId", "=", listing.id)
						.where("userId", "=", users.seller.id)
						.executeTakeFirst();
					const events = await database.kysely
						.selectFrom("listing_event")
						.select("id")
						.where("listingId", "=", listing.id)
						.execute();

					expect(ignore).toBeUndefined();
					expect(events).toHaveLength(0);
				}),
		});
	});
});
