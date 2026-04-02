import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingFetchFx } from "~/public/listing/server/fx/listingFetchFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";

describe("public listing visibility", () => {
	it("fetches live listings and applies public title filters while hiding sold ones", async () => {
		const database = await testabase("publicListing-fetch-filter");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "public-listing-filter-seller@test.cz",
						name: "Public Filter Seller",
						password: "12345678",
					},
				}),
			);

			const alpha = yield* createListingFx(seller.id);
			const beta = yield* createListingFx(seller.id);

			yield* Effect.promise(() =>
				Promise.all([
					database.kysely
						.updateTable("listing")
						.set({
							title: "Alpha MacBook",
						})
						.where("id", "=", alpha.id)
						.executeTakeFirstOrThrow(),
					database.kysely
						.updateTable("listing")
						.set({
							title: "Beta ThinkPad",
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
			expect(fetched.title).toBe("Alpha MacBook");

			const sold = yield* Effect.either(
				listingFetchFx({
					scope: {},
					where: {
						id: beta.id,
					},
				}),
			);

			expect(sold._tag).toBe("Left");

			const filtered = yield* listingCollectionFx({
				scope: {},
				where: {
					title: "alpha",
				},
			});

			expect(filtered).toHaveLength(1);
			expect(filtered[0]?.id).toBe(alpha.id);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
