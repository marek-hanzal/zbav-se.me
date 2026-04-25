import { Effect } from "effect";
import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/public/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("public listing visibility", () => {
	it("hides sold listings from collection and count", async () => {
		const database = await testabase("publicListing-hide-sold");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const liveListing = yield* createListingFx(seller.id);
			const soldListing = yield* createListingFx(seller.id);

			yield* Effect.promise(() =>
				database.kysely
					.updateTable("listing")
					.set({
						status: "sold",
						title: "Already sold",
						withTitleSearch: sql`lower(immutable_unaccent(${"Already sold"}))`,
					})
					.where("id", "=", soldListing.id)
					.executeTakeFirstOrThrow(),
			);

			const collection = yield* listingCollectionFx({
				scope: {},
			});

			expect(collection.map((item) => item.id)).toEqual([
				liveListing.id,
			]);

			const count = yield* listingCountFx({
				scope: {},
			});

			expect(count).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
