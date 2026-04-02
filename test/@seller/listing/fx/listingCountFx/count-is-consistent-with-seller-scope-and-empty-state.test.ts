import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/seller/listing/server/fx/listingCountFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("seller listingCountFx", () => {
	it("matches seller-scoped collection and supports empty filters", async () => {
		const database = await testabase("seller-listingCountFx-contract");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const users = yield* createUsersFx({
				api,
				slug: "seller-listing-count",
			});

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
				scope: {
					userId: users.seller.id,
				},
			});

			const count = yield* listingCountFx({
				scope: {
					userId: users.seller.id,
				},
			});

			expect(collection).toHaveLength(2);
			expect(count.total).toBe(2);
			expect(count.filter).toBe(2);
			expect(count.where).toBe(2);

			const empty = yield* listingCountFx({
				filter: {
					fulltext: "not-present",
				},
				scope: {
					userId: users.seller.id,
				},
			});

			expect(empty.filter).toBe(0);
			expect(empty.isFilterEmpty).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
