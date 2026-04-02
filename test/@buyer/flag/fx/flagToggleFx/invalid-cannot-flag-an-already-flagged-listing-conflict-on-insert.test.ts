import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagToggleFx } from "~/buyer/flag/server/fx/flagToggleFx";
import { runToggleEntityErrorContractFx } from "~/test/@buyer/common/fx/runToggleEntityContractFx";

describe("flagToggleFx", () => {
	it("invalid: cannot flag an already-flagged listing (conflict on insert)", async () => {
		return runToggleEntityErrorContractFx({
			databaseName: "flagToggle-duplicate",
			userSlug: "flag-duplicate",
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

					expect(rows).toHaveLength(1);
				}),
		});
	});
});
