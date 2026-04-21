import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { categoryCollectionFx } from "~/public/category/server/fx/categoryCollectionFx";
import { categoryCountFx } from "~/public/category/server/fx/categoryCountFx";
import { categoryFetchFx as publicCategoryFetchFx } from "~/public/category/server/fx/categoryFetchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const categoryBySlug = (database: TestDatabase, slug: string) =>
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
		const database = await testabase("public-category-restriction-scope");

		return Effect.gen(function* () {
			const noneCategory = yield* categoryBySlug(
				database,
				"pocitace-a-kancelar--uloziste-ssd-hdd",
			);
			const adultRelaxedCategory = yield* categoryBySlug(
				database,
				"vape-elektronicke-cigarety--mody",
			);
			const adultCategory = yield* categoryBySlug(
				database,
				"tv-audio-a-foto--drony-s-kamerou",
			);
			const sensitiveCategory = yield* categoryBySlug(
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
