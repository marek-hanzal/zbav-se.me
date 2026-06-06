import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { resourceLimitCollectionFx } from "~/user/resource-limit/server/fx/resourceLimitCollectionFx";
import {
	atResourceLimitReadModelFx,
	seedResourceLimitReadModelFx,
} from "./resourceLimitReadModelFixture";

describe("resourceLimit read model fx", () => {
	it("collection resolves effective resource bundle limits", async () => {
		const database = await testabase("resource-limit-collection");

		return Effect.gen(function* () {
			const { seller } = yield* seedResourceLimitReadModelFx(database);

			const sellerCollection = yield* atResourceLimitReadModelFx(
				"2026-05-12T10:00:00.000Z",
				resourceLimitCollectionFx({
					scope: {
						userId: seller.id,
					},
					sort: [
						{
							field: "resourceDefinitionId",
							order: "asc",
						},
					],
					cursor: {
						page: 0,
						size: 10,
					},
				}),
			);
			const pagedSellerCollection = yield* atResourceLimitReadModelFx(
				"2026-05-12T10:00:00.000Z",
				resourceLimitCollectionFx({
					scope: {
						userId: seller.id,
					},
					sort: [
						{
							field: "resourceDefinitionId",
							order: "asc",
						},
						{
							field: "createdAt",
							order: "desc",
						},
					],
					cursor: {
						page: 0,
						size: 20,
					},
				}),
			);

			expect(sellerCollection).toHaveLength(4);
			expect(sellerCollection.map((item) => item.resourceDefinitionId)).toEqual([
				ResourceDefinitionEnumSchema.enum["buyer:limit:feed.count"],
				ResourceDefinitionEnumSchema.enum["seller:limit:listing.count"],
				ResourceDefinitionEnumSchema.enum["seller:limit:listing.count"],
				ResourceDefinitionEnumSchema.enum["seller:limit:listing.gallery.count"],
			]);
			expect(
				sellerCollection.find(
					(item) =>
						item.resourceDefinitionId ===
						ResourceDefinitionEnumSchema.enum["buyer:limit:feed.count"],
				),
			).toMatchObject({
				limit: 4,
			});

			expect(pagedSellerCollection).toHaveLength(4);
			expect(
				pagedSellerCollection.map((item) => ({
					resourceDefinitionId: item.resourceDefinitionId,
					limit: item.limit,
				})),
			).toEqual(
				expect.arrayContaining([
					{
						resourceDefinitionId:
							ResourceDefinitionEnumSchema.enum["seller:limit:listing.count"],
						limit: 2,
					},
					{
						resourceDefinitionId:
							ResourceDefinitionEnumSchema.enum["seller:limit:listing.count"],
						limit: 7,
					},
					{
						resourceDefinitionId:
							ResourceDefinitionEnumSchema.enum["buyer:limit:feed.count"],
						limit: 4,
					},
					{
						resourceDefinitionId:
							ResourceDefinitionEnumSchema.enum["seller:limit:listing.gallery.count"],
						limit: 10,
					},
				]),
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
