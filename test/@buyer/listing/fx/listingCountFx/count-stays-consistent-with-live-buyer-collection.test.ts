import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/buyer/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/buyer/listing/server/fx/listingCountFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("buyer listingCountFx", () => {
	it("matches buyer-visible live collection and supports empty state", async () => {
		const database = await testabase("buyer-listingCountFx-live-consistency");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const users = yield* createUsersFx({
				api,
				slug: "buyer-listing-count",
			});

			yield* createListingFx(users.seller.id, {
				title: "Live buyer listing",
			});

			yield* createResolvedScenarioFx({
				sellerId: users.seller.id,
				buyerId: users.buyer.id,
				database,
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
			expect(count.total).toBe(collection.length);
			expect(count.where).toBe(collection.length);
			expect(count.filter).toBe(collection.length);

			const empty = yield* listingCountFx({
				userId: users.buyer.id,
				filter: {
					title: "definitely-not-present",
				},
				scope: {},
			});

			expect(empty.filter).toBe(0);
			expect(empty.isFilterEmpty).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
