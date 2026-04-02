import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCollectionFx } from "~/seller/draft/server/fx/draftCollectionFx";
import { draftCountFx } from "~/seller/draft/server/fx/draftCountFx";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createDbUserFx } from "~/test/user/fx/createDbUserFx";

describe("draftCountFx", () => {
	it("matches draft collection and supports empty filter", async () => {
		const database = await testabase("draftCountFx-contract");

		return Effect.gen(function* () {
			const seller = yield* createDbUserFx({
				email: "draft-count-seller@test.cz",
				name: "Draft Count Seller",
			});

			yield* draftCreateFx({
				userId: seller.id,
				title: "Draft count one",
			});
			yield* draftCreateFx({
				userId: seller.id,
				title: "Draft count two",
			});

			const collection = yield* draftCollectionFx({
				scope: {
					userId: seller.id,
				},
			});

			const count = yield* draftCountFx({
				scope: {
					userId: seller.id,
				},
			});

			expect(count.total).toBe(collection.length);
			expect(count.where).toBe(collection.length);
			expect(count.filter).toBe(collection.length);

			const empty = yield* draftCountFx({
				where: {
					id: "missing-draft-id",
				},
				scope: {
					userId: seller.id,
				},
			});

			expect(empty.where).toBe(0);
			expect(empty.isFilterEmpty).toBe(true);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
