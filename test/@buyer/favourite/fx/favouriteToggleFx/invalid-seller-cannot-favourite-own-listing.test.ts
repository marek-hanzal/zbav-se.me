import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { favouriteToggleFx } from "~/buyer/listing-favourite/server/fx/favouriteToggleFx";
import { runToggleEntityErrorContractFx } from "~/test/@buyer/common/fx/runToggleEntityErrorContractFx";

describe("favouriteToggleFx", () => {
	it("invalid: seller cannot favourite own listing", async () => {
		return runToggleEntityErrorContractFx({
			databaseName: "favouriteToggle-own-listing",
			userSlug: "fav-own",
			expectedError: {
				tag: "InvalidRequestErrorFx",
				message: "You cannot add your own listing to favourites",
			},
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
			assertAfterFx: ({ database, users, listing }) =>
				Effect.promise(async () => {
					const favourite = await database.kysely
						.selectFrom("listing_favourite")
						.select("id")
						.where("listingId", "=", listing.id)
						.where("userId", "=", users.seller.id)
						.executeTakeFirst();
					const events = await database.kysely
						.selectFrom("listing_event")
						.select("id")
						.where("listingId", "=", listing.id)
						.execute();

					expect(favourite).toBeUndefined();
					expect(events).toHaveLength(0);
				}),
		});
	});
});
