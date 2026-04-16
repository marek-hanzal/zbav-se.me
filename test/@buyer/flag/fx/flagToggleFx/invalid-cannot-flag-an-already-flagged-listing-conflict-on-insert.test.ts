import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { runToggleEntityErrorContractFx } from "~/test/@buyer/common/fx/runToggleEntityErrorContractFx";

describe("flagToggleFx", () => {
	it("invalid: cannot flag an already-flagged listing (conflict on insert)", async () => {
		return runToggleEntityErrorContractFx({
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
						.selectFrom("flag")
						.select("id")
						.where("listingId", "=", listing.id)
						.where("userId", "=", users.buyer.id)
						.execute();
					const events = await database.kysely
						.selectFrom("listing_event")
						.select("id")
						.where("listingId", "=", listing.id)
						.where("event", "=", "flag")
						.execute();
					const activity = await database.kysely
						.selectFrom("activity")
						.select("id")
						.where("userId", "=", users.seller.id)
						.where("type", "=", "flag")
						.execute();

					expect(rows).toHaveLength(1);
					expect(events).toHaveLength(1);
					expect(activity).toHaveLength(1);
				}),
		});
	});
});
