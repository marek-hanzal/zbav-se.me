import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { categoryCollectionFx } from "~/user/category/server/fx/categoryCollectionFx";
import { categoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const categoryIdBySlug = (database: TestDatabase, slug: string) =>
	Effect.promise(async () => {
		const category = await database.kysely
			.selectFrom("category")
			.select("id")
			.where("slug", "=", slug)
			.executeTakeFirstOrThrow();

		return category.id;
	});

const categoryIdByRestriction = (
	database: TestDatabase,
	restriction: "adult" | "adult-relaxed" | "sensitive",
) =>
	Effect.promise(async () => {
		const category = await database.kysely
			.selectFrom("category")
			.select("id")
			.where("restriction", "=", restriction)
			.executeTakeFirstOrThrow();

		return category.id;
	});

describe("user category restriction scope", () => {
	it("uses only active user restriction and falls back to none", async () => {
		const database = await testabase("user-category-active-restriction-scope");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const dateContext = yield* DateContextFx;
			const now = dateContext.now();

			const noneCategoryId = yield* categoryIdBySlug(
				database,
				"pocitace-a-kancelar--uloziste-ssd-hdd",
			);
			const adultRelaxedCategoryId = yield* categoryIdByRestriction(
				database,
				"adult-relaxed",
			);
			const adultCategoryId = yield* categoryIdByRestriction(database, "adult");
			const sensitiveCategoryId = yield* categoryIdByRestriction(database, "sensitive");

			const noneCategory = yield* categoryFetchFx({
				where: {
					id: noneCategoryId,
				},
				scope: {},
			});

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("user_restriction")
					.values([
						{
							id: genId(),
							userId: user.id,
							restriction: "sensitive",
							availableAt: now
								.plus({
									hours: 1,
								})
								.toJSDate(),
							createdAt: now
								.minus({
									minutes: 1,
								})
								.toJSDate(),
						},
						{
							id: genId(),
							userId: user.id,
							restriction: "adult",
							availableAt: now
								.minus({
									minutes: 1,
								})
								.toJSDate(),
							createdAt: now
								.minus({
									minutes: 2,
								})
								.toJSDate(),
						},
					])
					.execute(),
			);

			const scopedCollection = yield* categoryCollectionFx({
				userId: user.id,
				scope: {},
				where: {
					idIn: [
						noneCategory.id,
						adultRelaxedCategoryId,
						adultCategoryId,
						sensitiveCategoryId,
					],
				},
			});

			expect(scopedCollection.map((item) => item.restriction)).toEqual([
				"none",
				"adult-relaxed",
				"adult",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
