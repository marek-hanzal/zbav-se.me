import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { listingGetSellerInfoFx } from "~/buyer-listing/fx/listingGetSellerInfoFx";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { userEventCreateFx } from "~/user-event/fx/userEventCreateFx";

describe("listingGetSellerInfoFx", () => {
	it("returns seller events only for the seller behind the requested listing", async () => {
		const database = await testabaseFn("listingGetSellerInfoFx-event-isolation");

		return Effect.gen(function* () {
			const sellerA = yield* leaseTestUserFx({});
			const sellerB = yield* leaseTestUserFx({});

			const listingA = yield* createListingFx(sellerA.id);
			const listingB = yield* createListingFx(sellerB.id);

			yield* userEventCreateFx({
				userId: sellerA.id,
				scope: "foreign",
				source: "transaction",
				group: "listing-seller-a",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () =>
						DateTime.now().minus({
							days: 10,
						}),
				}),
			);
			yield* userEventCreateFx({
				userId: sellerA.id,
				scope: "user",
				source: "transaction",
				group: "listing-seller-a",
				event: "transaction.open",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () =>
						DateTime.now().minus({
							days: 9,
						}),
				}),
			);

			yield* userEventCreateFx({
				userId: sellerB.id,
				scope: "foreign",
				source: "transaction",
				group: "listing-seller-b",
				event: "transaction.create",
				isTerminal: false,
			}).pipe(
				withDateServiceFn({
					nowFn: () =>
						DateTime.now().minus({
							days: 8,
						}),
				}),
			);

			const sellerAInfo = yield* listingGetSellerInfoFx({
				listingId: listingA.id,
			});
			const sellerBInfo = yield* listingGetSellerInfoFx({
				listingId: listingB.id,
			});

			expect(sellerAInfo.events).not.toBeNull();
			expect(sellerAInfo.events?.reaction.total).toBe(1);
			expect(sellerBInfo.events).not.toBeNull();
			expect(sellerBInfo.events?.reaction.total).toBe(1);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
