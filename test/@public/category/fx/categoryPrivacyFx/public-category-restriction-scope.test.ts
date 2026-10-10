import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { categoryCollectionFx } from "~/public-category/fx/categoryCollectionFx";
import { categoryCountFx } from "~/public-category/fx/categoryCountFx";
import { categoryFetchFx as publicCategoryFetchFx } from "~/public-category/fx/categoryFetchFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;

const categoryBySlugFx = (database: TestDatabase, slug: string) =>
	Effect.promise(() =>
		database.kysely
			.selectFrom("category")
			.select([
				"id",
				"restriction",
			])
			.where("slug", "=", slug)
			.executeTakeFirstOrThrow(),
	);

describe("public category privacy", () => {
	it("only exposes unrestricted categories", async () => {
		const database = await testabaseFn("public-category-restriction-scope");

		return Effect.gen(function* () {
			const noneCategory = yield* categoryBySlugFx(
				database,
				"pocitace-a-kancelar--uloziste-ssd-hdd",
			);
			const adultRelaxedCategory = yield* categoryBySlugFx(
				database,
				"vape-elektronicke-cigarety--mody",
			);
			const adultCategory = yield* categoryBySlugFx(
				database,
				"tv-audio-a-foto--drony-s-kamerou",
			);
			const sensitiveCategory = yield* categoryBySlugFx(
				database,
				"airsoft--airsoftove-pistole",
			);

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
			const adultRelaxedFetch = yield* Effect.result(
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
			expectTaggedErrorFn(adultRelaxedFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
