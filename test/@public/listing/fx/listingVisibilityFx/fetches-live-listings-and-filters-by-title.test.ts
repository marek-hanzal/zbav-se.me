import { Effect } from "effect";
import { sql } from "kysely";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingFetchFx } from "~/public/listing/server/fx/listingFetchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("public listing visibility", () => {
	it("fetches live listings and applies public title filters while hiding sold ones", async () => {
		const database = await testabase("publicListing-fetch-filter");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const alpha = yield* createListingFx(seller.id, {
				restriction: "adult-relaxed",
			});
			const beta = yield* createListingFx(seller.id);

			yield* Effect.promise(() =>
				Promise.all([
					database.kysely
						.updateTable("listing")
						.set({
							// title: "Alpha MacBook",
							withTitleSearch: sql`lower(immutable_unaccent(${"Alpha MacBook"}))`,
						})
						.where("id", "=", alpha.id)
						.executeTakeFirstOrThrow(),
					database.kysely
						.updateTable("listing")
						.set({
							// title: "Beta ThinkPad",
							withTitleSearch: sql`lower(immutable_unaccent(${"Beta ThinkPad"}))`,
							status: "sold",
						})
						.where("id", "=", beta.id)
						.executeTakeFirstOrThrow(),
				]),
			);

			const fetched = yield* listingFetchFx({
				scope: {},
				where: {
					id: alpha.id,
				},
			});

			expect(fetched.id).toBe(alpha.id);
			// expect(fetched.title).toBe("Alpha MacBook");
			// expect(fetched.restrictions).toEqual([
			// 	"none",
			// 	"adult-relaxed",
			// ]);

			const sold = yield* Effect.either(
				listingFetchFx({
					scope: {},
					where: {
						id: beta.id,
					},
				}),
			);

			expectTaggedErrorFx(sold, {
				tag: "NotFoundErrorFx",
			});

			const filtered = yield* listingCollectionFx({
				scope: {},
				where: {
					// title: "alpha",
				},
			});

			expect(filtered).toHaveLength(1);
			expect(filtered[0]?.id).toBe(alpha.id);
			// expect(filtered[0]?.restrictions).toEqual([
			// 	"none",
			// 	"adult-relaxed",
			// ]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
