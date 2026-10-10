import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { resourceDefinitionCollectionFx } from "~/resource-definition/fx/resourceDefinitionCollectionFx";
import { resourceDefinitionFetchFx } from "~/resource-definition/fx/resourceDefinitionFetchFx";
import { ResourceDefinitionEnumSchema } from "~/resource-definition/schema/ResourceDefinitionEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("resource definition read model", () => {
	it("collection and fetch filter seeded resource definitions with stable sorting", async () => {
		const database = await testabase("resourceDefinitionReadModel-seeded");

		return Effect.gen(function* () {
			const collection = yield* resourceDefinitionCollectionFx({
				where: {
					nameIn: [
						"seller:limit:listing.count",
						"buyer:limit:feed.count",
					],
				},
				sort: [
					{
						field: "name",
						order: "asc",
					},
				],
			});
			const fetched = yield* resourceDefinitionFetchFx({
				where: {
					name: "seller:limit:listing.gallery.count",
				},
			});

			expect(collection).toEqual([
				{
					id: ResourceDefinitionEnumSchema.enum["buyer:limit:feed.count"],
					name: ResourceDefinitionEnumSchema.enum["buyer:limit:feed.count"],
				},
				{
					id: ResourceDefinitionEnumSchema.enum["seller:limit:listing.count"],
					name: ResourceDefinitionEnumSchema.enum["seller:limit:listing.count"],
				},
			]);
			expect(fetched).toEqual({
				id: ResourceDefinitionEnumSchema.enum["seller:limit:listing.gallery.count"],
				name: ResourceDefinitionEnumSchema.enum["seller:limit:listing.gallery.count"],
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
