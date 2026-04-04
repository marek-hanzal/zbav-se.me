import { Effect } from "effect";
import { describe, it } from "vitest";
import { ignoreToggleFx } from "~/buyer/ignore/server/fx/ignoreToggleFx";
import { runToggleEntityContractFx } from "~/test/@buyer/common/fx/runToggleEntityContractFx";

describe("ignoreToggleFx", () => {
	it("toggle on: creates ignore record, listing_event and seller inbox", async () => {
		return runToggleEntityContractFx({
			databaseName: "ignoreToggle-on",
			userSlug: "ignore-toggle-on",
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
			inboxOnFx: ({ database, users }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("inbox")
						.select("type")
						.where("userId", "=", users.seller.id)
						.where("type", "=", "ignore")
						.executeTakeFirst(),
				),
			inboxOffFx: ({ database, users }) =>
				Effect.promise(() =>
					database.kysely
						.selectFrom("inbox")
						.select("type")
						.where("userId", "=", users.seller.id)
						.where("type", "=", "unignore")
						.executeTakeFirst(),
				),
		});
	});
});
