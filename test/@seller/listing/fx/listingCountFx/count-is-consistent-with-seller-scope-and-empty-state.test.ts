import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/seller/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("seller listingCountFx", () => {
	it("matches seller-scoped collection and supports empty filters", async () => {
		const database = await testabase("seller-listingCountFx-contract");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			yield* createListingFx(users.seller.id, {
				title: "Seller listing one",
			});
			yield* createListingFx(users.seller.id, {
				title: "Seller listing two",
			});
			yield* createListingFx(users.stranger.id, {
				title: "Foreign listing hidden",
			});

			const collection = yield* listingCollectionFx({
				userId: users.seller.id,
				scope: {
					userId: users.seller.id,
				},
			});

			const count = yield* listingCountFx({
				userId: users.seller.id,
				scope: {
					userId: users.seller.id,
				},
			});

			expect(collection).toHaveLength(2);
			expect(count).toBe(2);

			const empty = yield* listingCountFx({
				userId: users.seller.id,
				filter: {
					fulltext: "not-present",
				},
				scope: {
					userId: users.seller.id,
				},
			});

			expect(empty).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
