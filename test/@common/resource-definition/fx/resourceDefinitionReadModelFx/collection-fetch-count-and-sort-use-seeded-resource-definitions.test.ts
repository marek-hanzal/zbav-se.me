import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { resourceDefinitionCollectionFx } from "~/common/resource-definition/server/fx/resourceDefinitionCollectionFx";
import { resourceDefinitionFetchFx } from "~/common/resource-definition/server/fx/resourceDefinitionFetchFx";
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
					id: "feed.count",
					name: "feed.count",
				},
				{
					id: "listing.count",
					name: "listing.count",
				},
			]);
			expect(fetched).toEqual({
				id: "listing.gallery.count",
				name: "listing.gallery.count",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
