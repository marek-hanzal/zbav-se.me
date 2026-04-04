import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { favouriteToggleFx } from "~/buyer/favourite/server/fx/favouriteToggleFx";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { runToggleEntityErrorContractFx } from "~/test/@buyer/common/fx/runToggleEntityErrorContractFx";

describe("favouriteToggleFx", () => {
	it("invalid: cannot favourite with another user's feed", async () => {
		return runToggleEntityErrorContractFx({
			databaseName: "favouriteToggle-wrong-feed",
			userSlug: "fav-wrong-feed",
			expectedError: {
				tag: "NotFoundErrorFx",
				message: "Resource not found",
			},
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
			assertAfterFx: ({ database, users, listing }) =>
				Effect.promise(async () => {
					const favourite = await database.kysely
						.selectFrom("favourite")
						.select("id")
						.where("listingId", "=", listing.id)
						.where("userId", "=", users.buyer.id)
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
