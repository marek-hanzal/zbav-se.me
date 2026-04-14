import { Effect } from "effect";
import { describe, it } from "vitest";
import { ignoreToggleFx } from "~/buyer/ignore/server/fx/ignoreToggleFx";
import { runToggleEntityContractFx } from "~/test/@buyer/common/fx/runToggleEntityContractFx";

describe("ignoreToggleFx", () => {
	it("toggle off: deletes ignore record, creates unignore event and seller activity", async () => {
		return runToggleEntityContractFx({
			databaseName: "ignoreToggle-off",
			userSlug: "ignore-toggle-off",
			toggleOnFx: ({ users, listing }) =>
				ignoreToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					toggle: true,
				}),
			toggleOffFx: ({ users, listing }) =>
				ignoreToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					toggle: false,
				}),
			recordFx: ({ database, users, listing }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("ignore")
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
			assertRecordOn: () => {},
			onEvent: "ignore",
			offEvent: "unignore",
			activityOnFx: ({ database, users }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("activity")
						.select("type")
						.where("userId", "=", users.seller.id)
						.where("type", "=", "ignore")
						.executeTakeFirst(),
				),
			activityOffFx: ({ database, users }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("activity")
						.select("type")
						.where("userId", "=", users.seller.id)
						.where("type", "=", "unignore")
						.executeTakeFirst(),
				),
		});
	});
});
