import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCollectionFx } from "~/seller/draft/server/fx/draftCollectionFx";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("draftCollectionFx", () => {
	it("returns only scoped drafts and supports empty result", async () => {
		const database = await testabase("draftCollectionFx-contract");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const users = yield* createUsersFx({
				api,
				slug: "draft-collection",
			});

			const draftA = yield* draftCreateFx({
				userId: users.seller.id,
				title: "Seller draft A",
			});
			const draftB = yield* draftCreateFx({
				userId: users.seller.id,
				title: "Seller draft B",
			});
			yield* draftCreateFx({
				userId: users.stranger.id,
				title: "Foreign draft hidden",
			});

			const collection = yield* draftCollectionFx({
				scope: {
					userId: users.seller.id,
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
					userId: users.seller.id,
				},
			});

			expect(empty).toEqual([]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
