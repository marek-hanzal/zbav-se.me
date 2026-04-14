import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/buyer/thumb/server/fx/thumbCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("thumbCreateFx", () => {
	it("is idempotent on duplicate thumb creation and does not duplicate side effects", async () => {
		const database = await testabase("thumbCreate-idempotent");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const listing = yield* createListingFx(seller.id);

			yield* thumbCreateFx({
				userId: buyer.id,
				listingId: listing.id,
				type: "like",
			});
			const duplicateResult = yield* thumbCreateFx({
				userId: buyer.id,
				listingId: listing.id,
				type: "like",
			});

			expect(duplicateResult.id).toBe(listing.id);
			expect(duplicateResult.thumb).toBe("like");

			const thumbs = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("thumb")
					.select([
						"userId",
						"listingId",
						"type",
					])
					.where("userId", "=", buyer.id)
					.where("listingId", "=", listing.id)
					.execute(),
			);
			const events = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("listing_event")
					.select("event")
					.where("listingId", "=", listing.id)
					.where("event", "=", "like")
					.execute(),
			);
			const activityItems = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select("id")
					.where("userId", "=", seller.id)
					.where("type", "=", "thumb")
					.execute(),
			);

			expect(thumbs).toHaveLength(1);
			expect(thumbs[0]).toEqual({
				userId: buyer.id,
				listingId: listing.id,
				type: "like",
			});
			expect(events).toHaveLength(1);
			expect(activityItems).toHaveLength(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
