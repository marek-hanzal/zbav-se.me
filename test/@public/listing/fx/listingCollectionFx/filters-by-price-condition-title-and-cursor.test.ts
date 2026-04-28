import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/public/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("public listingCollectionFx", () => {
	it("filters live listings by title, price and condition and paginates with cursor", async () => {
		const database = await testabase("publicListingCollectionFx-contract");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const alpha = yield* createListingFx(seller.id, {
				title: "Alpha MacBook",
			});
			const beta = yield* createListingFx(seller.id, {
				title: "Beta MacBook",
			});
			const gamma = yield* createListingFx(seller.id, {
				title: "Gamma ThinkPad",
			});

			yield* Effect.promise(() =>
				Promise.all([
					database.kysely
						.updateTable("listing")
						.set({
							// price: 1000,
							condition: 5,
						})
						.where("id", "=", alpha.id)
						.executeTakeFirstOrThrow(),
					database.kysely
						.updateTable("listing")
						.set({
							// price: 1500,
							condition: 4,
						})
						.where("id", "=", beta.id)
						.executeTakeFirstOrThrow(),
					database.kysely
						.updateTable("listing")
						.set({
							// price: 2500,
							condition: 2,
							status: "sold",
						})
						.where("id", "=", gamma.id)
						.executeTakeFirstOrThrow(),
				]),
			);

			const filtered = yield* listingCollectionFx({
				scope: {},
				where: {
					// title: "macbook",
					priceMax: 1600,
					conditionMin: 4,
				},
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
			});
			const firstPage = yield* listingCollectionFx({
				scope: {},
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
				cursor: {
					page: 0,
					size: 1,
				},
			});
			const secondPage = yield* listingCollectionFx({
				scope: {},
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
				cursor: {
					page: 1,
					size: 1,
				},
			});
			const count = yield* listingCountFx({
				scope: {},
				where: {
					// title: "macbook",
					priceMax: 1600,
					conditionMin: 4,
				},
			});

			expect(filtered.map((item) => item.id)).toEqual([
				alpha.id,
				beta.id,
			]);
			expect(firstPage).toHaveLength(1);
			expect(secondPage).toHaveLength(1);
			expect(firstPage[0]?.id).toBe(alpha.id);
			expect(secondPage[0]?.id).toBe(beta.id);
			expect(count).toBe(2);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
