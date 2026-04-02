import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftFetchFx } from "~/seller/draft/server/fx/draftFetchFx";
import { auth } from "~/server/auth/auth";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("draftFetchFx", () => {
	it("fetches own draft and rejects foreign draft", async () => {
		const database = await testabase("draftFetchFx-scope");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const users = yield* createUsersFx({
				api,
				slug: "draft-fetch",
			});

			const ownDraft = yield* draftCreateFx({
				userId: users.seller.id,
				title: "Own draft title",
			});
			const foreignDraft = yield* draftCreateFx({
				userId: users.stranger.id,
				title: "Foreign draft title",
			});

			const fetched = yield* draftFetchFx({
				where: {
					id: ownDraft.id,
				},
				scope: {
					userId: users.seller.id,
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
						userId: users.seller.id,
					},
				}),
			);

			expectErrorFx(foreign);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
