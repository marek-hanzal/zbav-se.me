import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { thumbCreateFx } from "~/buyer-thumb/fx/thumbCreateFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("activity reference", () => {
	it("maps reaction activity reference from listingId", async () => {
		const database = await testabaseFn("activityReference-thumb-create");

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
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
