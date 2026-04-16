import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/buyer/thumb/server/fx/thumbCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("thumbCreateFx", () => {
	it("creates thumb record, listing event, seller activity and returns listing with thumb", async () => {
		const database = await testabase("thumbCreate-side-effects");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id);

			const updatedListing = yield* thumbCreateFx({
				userId: buyer.id,
				listingId: listing.id,
				type: "like",
			});

			expect(updatedListing.id).toBe(listing.id);
			expect(updatedListing.thumb).toBe("like");

			const thumb = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("thumb")
					.select([
						"userId",
						"listingId",
						"type",
					])
					.where("userId", "=", buyer.id)
					.where("listingId", "=", listing.id)
					.executeTakeFirst(),
			);

			expect(thumb).toEqual({
				userId: buyer.id,
				listingId: listing.id,
				type: "like",
			});

			const events = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("event")
					.where("listingId", "=", listing.id)
					.execute(),
			);

			expect(events.map((item) => item.event)).toContain("like");

			const activity = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"userId",
						"family",
						"type",
						"reference",
						"payload",
					])
					.where("userId", "=", seller.id)
					.where("type", "=", "thumb")
					.executeTakeFirst(),
			);

			expect(activity?.family).toBe("reaction");
			expect(activity?.reference).toEqual([
				listing.id,
			]);
			expect(activity?.payload).toEqual({
				listingId: listing.id,
				thumb: "like",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
