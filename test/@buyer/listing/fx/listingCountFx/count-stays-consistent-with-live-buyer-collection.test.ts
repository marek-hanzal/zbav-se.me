import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/buyer/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("buyer listingCountFx", () => {
	it("matches buyer-visible live collection and supports empty state", async () => {
		const database = await testabase("buyer-listingCountFx-live-consistency");

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

			expect(collection).toHaveLength(1);
			expect(count).toBe(collection.length);

			const empty = yield* listingCountFx({
				userId: users.buyer.id,
				filter: {
					// title: "definitely-not-present",
				},
				scope: {},
			});

			expect(empty).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
