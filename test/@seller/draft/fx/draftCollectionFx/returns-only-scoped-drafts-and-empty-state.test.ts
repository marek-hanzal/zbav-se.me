import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCollectionFx } from "~/seller/draft/server/fx/draftCollectionFx";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createDbUserFx } from "~/test/user/fx/createDbUserFx";

describe("draftCollectionFx", () => {
	it("returns only scoped drafts and supports empty result", async () => {
		const database = await testabase("draftCollectionFx-contract");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "draft-collection-seller@test.cz",
				name: "Draft Collection Seller",
			});
			const stranger = yield* createDbUserFx({
				email: "draft-collection-stranger@test.cz",
				name: "Draft Collection Stranger",
			});

			const draftA = yield* draftCreateFx({
				userId: seller.id,
				title: "Seller draft A",
			});
			const draftB = yield* draftCreateFx({
				userId: seller.id,
				title: "Seller draft B",
			});
			yield* draftCreateFx({
				userId: stranger.id,
				title: "Foreign draft hidden",
			});

			const collection = yield* draftCollectionFx({
				scope: {
					userId: seller.id,
				},
				sort: [
					{
						field: "updatedAt",
						order: "desc",
					},
				],
			});

			expect(collection.map((item) => item.id)).toEqual(
				expect.arrayContaining([
					draftA.id,
					draftB.id,
				]),
			);
			expect(collection).toHaveLength(2);

			const empty = yield* draftCollectionFx({
				where: {
					id: "missing-draft-id",
				},
				scope: {
					userId: seller.id,
				},
			});

			expect(empty).toEqual([]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
