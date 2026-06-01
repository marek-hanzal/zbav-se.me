import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { favouriteToggleFx } from "~/buyer/listing-favourite/server/fx/favouriteToggleFx";
import { runToggleEntityContractFx } from "~/test/@buyer/common/fx/runToggleEntityContractFx";

describe("favouriteToggleFx", () => {
	it("toggle off: deletes favourite, creates unfavourite event and activity", async () => {
		return runToggleEntityContractFx({
			databaseName: "favouriteToggle-off",
			userSlug: "fav-toggle-off",
			createExtraFx: ({ users }) =>
				feedCreateFx({
					userId: users.buyer.id,
					type: "user",
					name: "Test feed",
					query: {},
				}),
			toggleOnFx: ({ users, listing, extra: feed }) =>
				favouriteToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					feedId: feed.id,
					toggle: true,
				}),
			toggleOffFx: ({ users, listing, extra: feed }) =>
				favouriteToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					feedId: feed.id,
					toggle: false,
				}),
			recordFx: ({ database, users, listing }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("listing_favourite")
						.select([
							"listingId",
							"userId",
							"feedId",
						])
						.where("listingId", "=", listing.id)
						.where("userId", "=", users.buyer.id)
						.executeTakeFirst(),
				),
			eventsFx: ({ database, listing }) =>
				Effect.promise(async () => {
					const events = await database.kysely
						.selectFrom("listing_event")
						.select("event")
						.where("listingId", "=", listing.id)
						.execute();

					return events.map((event) => event.event);
				}),
			assertRecordOn: (record, { extra: feed }) => {
				expect(record.feedId).toBe(feed.id);
			},
			onEvent: "listing.favourite",
			offEvent: "unfavourite",
			activityOnFx: ({ database, users }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("activity")
						.select([
							"type",
							"family",
						])
						.where("userId", "=", users.seller.id)
						.where("type", "=", "listing.favourite")
						.executeTakeFirst(),
				),
			assertActivityOn: (activity) => {
				expect(activity.family).toBe("reaction");
			},
			activityOffFx: ({ database, users }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("activity")
						.select([
							"type",
							"family",
						])
						.where("userId", "=", users.seller.id)
						.where("type", "=", "unfavourite")
						.executeTakeFirst(),
				),
		});
	});
});
