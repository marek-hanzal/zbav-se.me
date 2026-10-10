import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer-listing/fx/listingCollectionFx";
import { listingCountFx } from "~/buyer-listing/fx/listingCountFx";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("buyer listingCountFx", () => {
	it("matches the buyer-visible collection and supports empty state", async () => {
		const database = await testabaseFn("buyer-listingCountFx-live-consistency");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			yield* createListingFx(users.seller.id, {
				title: "Live buyer listing",
			});

			yield* createResolvedScenarioFx({
				sellerId: users.seller.id,
				buyerId: users.buyer.id,
			});

			const collection = yield* listingCollectionFx({
				userId: users.buyer.id,
				scope: {},
			});

			const count = yield* listingCountFx({
				userId: users.buyer.id,
				scope: {},
			});

			expect(collection).toHaveLength(2);
			expect(count).toBe(collection.length);

			const empty = yield* listingCountFx({
				userId: users.buyer.id,
				where: {
					title: "definitely-not-present",
				},
				scope: {},
			});

			expect(empty).toBe(0);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
