import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftFetchFx } from "~/seller/draft/server/fx/draftFetchFx";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("draftFetchFx", () => {
	it("fetches own draft and rejects foreign draft", async () => {
		const database = await testabase("draftFetchFx-scope");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const stranger = yield* leaseTestUserFx({});

			const ownDraft = yield* draftCreateFx({
				userId: seller.id,
				title: "Own draft title",
			});
			const foreignDraft = yield* draftCreateFx({
				userId: stranger.id,
				title: "Foreign draft title",
			});

			const fetched = yield* draftFetchFx({
				where: {
					id: ownDraft.id,
				},
				scope: {
					userId: seller.id,
				},
			});

			expect(fetched.id).toBe(ownDraft.id);
			expect(fetched.title).toBe("Own draft title");

			const foreign = yield* Effect.either(
				draftFetchFx({
					where: {
						id: foreignDraft.id,
					},
					scope: {
						userId: seller.id,
					},
				}),
			);

			expectErrorFx(foreign);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
