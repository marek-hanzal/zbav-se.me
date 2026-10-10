import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/buyer-listing-flag/fx/flagToggleFx";
import { runToggleEntityErrorContractFn } from "~/test/@buyer/common/fx/runToggleEntityErrorContractFn";

describe("flagToggleFx", () => {
	it("invalid: cannot flag an already-flagged listing (conflict on insert)", async () => {
		return runToggleEntityErrorContractFn({
			databaseName: "flagToggle-duplicate",
			userSlug: "flag-duplicate",
			expectedError: {
				tag: "RuntimeErrorFx",
				message: "Generic Error",
			},
			beforeFx: ({ users, listing }) =>
				flagToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					toggle: true,
				}),
			errorFx: ({ users, listing }) =>
				flagToggleFx({
					userId: users.buyer.id,
					listingId: listing.id,
					toggle: true,
				}),
			assertAfterFx: ({ database, users, listing }) =>
				Effect.promise(async () => {
					const rows = await database.kysely
						.selectFrom("listing_flag")
						.select("id")
						.where("listingId", "=", listing.id)
						.where("userId", "=", users.buyer.id)
						.execute();
					const events = await database.kysely
						.selectFrom("listing_event")
						.select("id")
						.where("listingId", "=", listing.id)
						.where("event", "=", "listing.flag")
						.execute();
					const activity = await database.kysely
						.selectFrom("activity")
						.select("id")
						.where("userId", "=", users.seller.id)
						.where("type", "=", "listing.flag")
						.execute();

					expect(rows).toHaveLength(1);
					expect(events).toHaveLength(1);
					expect(activity).toHaveLength(1);
				}),
		});
	});
});
