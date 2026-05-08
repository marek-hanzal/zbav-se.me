import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/public/listing/server/fx/listingCountFx";
import { listingFetchFx } from "~/public/listing/server/fx/listingFetchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

type CategoryFixture = {
	id: string;
	group: string;
	category: string;
};

const categoryBySlugFx = (database: TestDatabase, slug: string) =>
	Effect.promise(() =>
		database.kysely
			.selectFrom("category")
			.select([
				"id",
				"group",
				"category",
			])
			.where("slug", "=", slug)
			.executeTakeFirstOrThrow(),
	) as Effect.Effect<CategoryFixture, never, never>;

const patchCategoryFx = (
	database: TestDatabase,
	props: {
		id: string;
		discovery?: "explicit" | "implicit";
		restriction?: "none" | "adult-relaxed" | "adult" | "sensitive" | "restricted";
	},
) =>
	Effect.promise(async () => {
		const values: Record<string, unknown> = {};

		if (props.discovery !== undefined) {
			values.discovery = props.discovery;
		}

		if (props.restriction !== undefined) {
			values.restriction = props.restriction;
		}

		await database.kysely
			.updateTable("category")
			.set(values)
			.where("id", "=", props.id)
			.executeTakeFirstOrThrow();
	});

describe("public listing visibility", () => {
	it("respects category discovery, listing/category restrictions and public fulltext", async () => {
		const database = await testabase("public-listing-visibility-and-discovery");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const implicitCategory = yield* categoryBySlugFx(
				database,
				"pocitace-a-kancelar--uloziste-ssd-hdd",
			);
			const explicitCategory = yield* categoryBySlugFx(
				database,
				"pocitace-a-kancelar--monitor",
			);
			const relaxedCategory = yield* categoryBySlugFx(
				database,
				"pocitace-a-kancelar--sitove-prvky-router-nas",
			);

			const implicitListing = yield* createListingFx(users.seller.id, {
				categoryId: implicitCategory.id,
				title: "qxpubimplicit987",
			});
			const explicitListing = yield* createListingFx(users.seller.id, {
				categoryId: explicitCategory.id,
				title: "qxpubexplicit987",
			});
			const relaxedListing = yield* createListingFx(users.seller.id, {
				categoryId: relaxedCategory.id,
				title: "qxpubrelaxed987",
			});
			const blockedListing = yield* createListingFx(users.seller.id, {
				categoryId: implicitCategory.id,
				title: "qxpubblocked987",
				restriction: "adult",
			});

			yield* patchCategoryFx(database, {
				id: explicitCategory.id,
				discovery: "explicit",
			});
			yield* patchCategoryFx(database, {
				id: relaxedCategory.id,
				restriction: "adult-relaxed",
			});

			const defaultCollection = yield* listingCollectionFx({
				scope: {},
			});
			const defaultCount = yield* listingCountFx({
				scope: {},
			});
			const fulltextByTitle = yield* listingCollectionFx({
				scope: {},
				where: {
					fulltext: [
						"qxpubimplicit987",
					],
				},
			});
			const hiddenByCategoryFulltext = yield* listingCollectionFx({
				scope: {},
				where: {
					fulltext: [
						"qxpubexplicit987",
					],
				},
			});
			const explicitByCategory = yield* listingCollectionFx({
				scope: {},
				where: {
					categoryId: explicitCategory.id,
					fulltext: [
						"qxpubexplicit987",
					],
				},
			});
			const explicitByCategoryIn = yield* listingCollectionFx({
				scope: {},
				where: {
					categoryIdIn: [
						explicitCategory.id,
					],
				},
			});
			const hiddenExplicitFetch = yield* Effect.either(
				listingFetchFx({
					scope: {},
					where: {
						id: explicitListing.id,
					},
				}),
			);
			const visibleExplicitFetch = yield* listingFetchFx({
				scope: {},
				where: {
					id: explicitListing.id,
					categoryId: explicitCategory.id,
				},
			});
			const blockedFetch = yield* Effect.either(
				listingFetchFx({
					scope: {},
					where: {
						id: blockedListing.id,
					},
				}),
			);

			expect(defaultCollection.map((item) => item.id).sort()).toEqual(
				[
					implicitListing.id,
					relaxedListing.id,
				].sort(),
			);
			expect(defaultCount).toBe(defaultCollection.length);
			expect(defaultCollection.map((item) => item.id)).not.toContain(explicitListing.id);
			expect(defaultCollection.map((item) => item.id)).not.toContain(blockedListing.id);
			expect(fulltextByTitle.map((item) => item.id)).toEqual([
				implicitListing.id,
			]);
			expect(hiddenByCategoryFulltext).toEqual([]);
			expect(explicitByCategory.map((item) => item.id)).toEqual([
				explicitListing.id,
			]);
			expect(explicitByCategoryIn.map((item) => item.id)).toEqual([
				explicitListing.id,
			]);
			expect(visibleExplicitFetch.id).toBe(explicitListing.id);
			expect(visibleExplicitFetch.withRestriction).toBe("none");
			expectTaggedErrorFx(hiddenExplicitFetch, {
				tag: "NotFoundErrorFx",
			});
			expectTaggedErrorFx(blockedFetch, {
				tag: "NotFoundErrorFx",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
