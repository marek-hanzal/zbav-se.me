import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCollectionFx } from "~/seller/draft/server/fx/draftCollectionFx";
import { draftCountFx } from "~/seller/draft/server/fx/draftCountFx";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("draftCountFx", () => {
	it("matches draft collection and supports empty filter", async () => {
		const database = await testabase("draftCountFx-contract");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

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

			expect(count).toBe(collection.length);

			const empty = yield* draftCountFx({
				where: {
					id: "missing-draft-id",
				},
				scope: {
					userId: seller.id,
				},
			});

			expect(empty).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
