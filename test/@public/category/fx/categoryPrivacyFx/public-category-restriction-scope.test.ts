import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { categoryCollectionFx } from "~/public/category/server/fx/categoryCollectionFx";
import { categoryCountFx } from "~/public/category/server/fx/categoryCountFx";
import { categoryFetchFx as publicCategoryFetchFx } from "~/public/category/server/fx/categoryFetchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { categoryFetchFx as userCategoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";

describe("public category privacy", () => {
	it("only exposes unrestricted categories", async () => {
		const database = await testabase("public-category-restriction-scope");

		return Effect.gen(function* () {
			const noneCategory = yield* userCategoryFetchFx({
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			});
			const adultRelaxedCategory = yield* userCategoryFetchFx({
				where: {
					slug: "vape-elektronicke-cigarety--mody",
				},
				scope: {},
			});
			const adultCategory = yield* userCategoryFetchFx({
				where: {
					slug: "tv-audio-a-foto--drony-s-kamerou",
				},
				scope: {},
			});
			const sensitiveCategory = yield* userCategoryFetchFx({
				where: {
					slug: "airsoft--airsoftove-pistole",
				},
				scope: {},
			});

			const categoryIdIn = [
				noneCategory.id,
				adultRelaxedCategory.id,
				adultCategory.id,
				sensitiveCategory.id,
			];
			const collection = yield* categoryCollectionFx({
				scope: {},
				where: {
					idIn: categoryIdIn,
				},
			});
			const count = yield* categoryCountFx({
				scope: {},
				where: {
					idIn: categoryIdIn,
				},
			});
			const adultRelaxedFetch = yield* Effect.either(
				publicCategoryFetchFx({
					scope: {},
					where: {
						id: adultRelaxedCategory.id,
					},
				}),
			);

			expect(collection.map((item) => item.id)).toEqual([
				noneCategory.id,
			]);
			expect(collection.every((item) => item.restriction === "none")).toBe(true);
			expect(count).toBe(1);
			expectTaggedErrorFx(adultRelaxedFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
