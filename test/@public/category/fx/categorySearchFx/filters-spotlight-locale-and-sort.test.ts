import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { categoryCollectionFx } from "~/public/category/server/fx/categoryCollectionFx";
import { categoryCountFx } from "~/public/category/server/fx/categoryCountFx";
import { categoryFetchFx } from "~/public/category/server/fx/categoryFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

type CategoryFixture = {
	id: string;
	group: string;
	category: string;
	slug: string;
};

const categoryBySlugFx = (database: TestDatabase, slug: string) =>
	Effect.promise(() =>
		database.kysely
			.selectFrom("category")
			.select([
				"id",
				"group",
				"category",
				"slug",
			])
			.where("slug", "=", slug)
			.executeTakeFirstOrThrow(),
	) as Effect.Effect<CategoryFixture, never, never>;

const patchCategoryLocaleFx = (database: TestDatabase, id: string, locale: string) =>
	Effect.promise(() =>
		database.kysely
			.updateTable("category")
			.set({
				locale,
			})
			.where("id", "=", id)
			.executeTakeFirstOrThrow(),
	);

const insertSpotlightFx = (
	database: TestDatabase,
	props: {
		id: string;
		categoryId: string;
		text: string;
	},
) =>
	Effect.promise(() =>
		database.kysely
			.insertInto("category_spotlight")
			.values({
				id: props.id,
				categoryId: props.categoryId,
				text: props.text,
				locale: "cs",
				weight: 10,
			})
			.execute(),
	);

describe("public category search", () => {
	it("filters through spotlight text and locale while keeping fetch/count/sort consistent", async () => {
		const database = await testabase("public-category-search-filters");

		return Effect.gen(function* () {
			const spotlightCategory = yield* categoryBySlugFx(
				database,
				"pocitace-a-kancelar--uloziste-ssd-hdd",
			);
			const secondCategory = yield* categoryBySlugFx(
				database,
				"pocitace-a-kancelar--monitor",
			);

			yield* patchCategoryLocaleFx(database, spotlightCategory.id, "en");
			yield* patchCategoryLocaleFx(database, secondCategory.id, "de");
			yield* insertSpotlightFx(database, {
				id: "category-spotlight-public-search",
				categoryId: spotlightCategory.id,
				text: "qxspotlight987",
			});

			const spotlightCollection = yield* categoryCollectionFx({
				scope: {},
				where: {
					fulltext: "qxspotlight987",
				},
			});
			const spotlightCount = yield* categoryCountFx({
				scope: {},
				where: {
					fulltext: "qxspotlight987",
				},
			});
			const localeCollection = yield* categoryCollectionFx({
				scope: {},
				where: {
					idIn: [
						spotlightCategory.id,
						secondCategory.id,
					],
					localeIn: [
						"en",
						"de",
					],
				},
				sort: [
					{
						field: "category",
						order: "asc",
					},
				],
			});
			const groupCollection = yield* categoryCollectionFx({
				scope: {},
				where: {
					idIn: [
						spotlightCategory.id,
						secondCategory.id,
					],
					group: "Pocitace",
				},
			});
			const categoryOnly = yield* categoryCollectionFx({
				scope: {},
				where: {
					category: secondCategory.category,
				},
			});
			const fetched = yield* categoryFetchFx({
				scope: {},
				where: {
					slug: spotlightCategory.slug,
					locale: "en",
				},
			});

			expect(spotlightCollection.map((item) => item.id)).toEqual([
				spotlightCategory.id,
			]);
			expect(spotlightCount).toBe(1);
			expect(localeCollection.map((item) => item.id)).toEqual(
				[
					secondCategory,
					spotlightCategory,
				]
					.sort((a, b) => a.category.localeCompare(b.category, "cs"))
					.map((item) => item.id),
			);
			expect(groupCollection.map((item) => item.id).sort()).toEqual(
				[
					spotlightCategory.id,
					secondCategory.id,
				].sort(),
			);
			expect(categoryOnly.map((item) => item.id)).toEqual([
				secondCategory.id,
			]);
			expect(fetched.id).toBe(spotlightCategory.id);
			expect(fetched.locale).toBe("en");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
