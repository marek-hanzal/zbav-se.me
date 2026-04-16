import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/buyer/thumb/server/fx/thumbCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("activity reference", () => {
	it("maps reaction activity reference from listingId", async () => {
		const database = await testabase("activityReference-thumb-create");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Reference fixture listing",
			});

			yield* thumbCreateFx({
				listingId: listing.id,
				type: "like",
				userId: buyer.id,
			});

			const activity = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("activity")
					.select([
						"id",
						"reference",
						"type",
						"userId",
					])
					.where("userId", "=", seller.id)
					.where("type", "=", "thumb")
					.executeTakeFirstOrThrow(),
			);

			expect(activity.reference).toEqual([
				listing.id,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
