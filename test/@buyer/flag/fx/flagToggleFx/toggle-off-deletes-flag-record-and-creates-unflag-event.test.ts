import { Effect } from "effect";
import { describe, it } from "vitest";
import { flagToggleFx } from "~/buyer-listing-flag/fx/flagToggleFx";
import { runToggleEntityContractFn } from "~/test/@buyer/common/fx/runToggleEntityContractFn";

describe("flagToggleFx", () => {
	it("toggle off: deletes flag record and creates unflag event", async () => {
		return runToggleEntityContractFn({
			databaseName: "flagToggle-off",
			userSlug: "flag-toggle-off",
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
			recordFx: ({ database, users, listing }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("listing_flag")
						.select([
							"listingId",
							"userId",
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
			assertRecordOnFn: () => {},
			onEvent: "listing.flag",
			offEvent: "unflag",
			activityOnFx: ({ database, users }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("activity")
						.select("type")
						.where("userId", "=", users.seller.id)
						.where("type", "=", "listing.flag")
						.executeTakeFirst(),
				),
			activityOffFx: ({ database, users }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("activity")
						.select("type")
						.where("userId", "=", users.seller.id)
						.where("type", "=", "unflag")
						.executeTakeFirst(),
				),
		});
	});
});
