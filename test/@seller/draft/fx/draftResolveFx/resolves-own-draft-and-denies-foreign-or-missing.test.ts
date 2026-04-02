import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftResolveFx } from "~/seller/draft/server/fx/draftResolveFx";
import { auth } from "~/server/auth/auth";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("draftResolveFx", () => {
	it("resolves own draft and denies foreign or missing draft", async () => {
		const database = await testabase("draftResolveFx-contract");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const users = yield* createUsersFx({
				api,
				slug: "draft-resolve",
			});

			const ownDraft = yield* draftCreateFx({
				userId: users.seller.id,
				title: "Resolvable draft",
			});
			const foreignDraft = yield* draftCreateFx({
				userId: users.stranger.id,
				title: "Foreign draft",
			});

			const resolved = yield* draftResolveFx({
				userId: users.seller.id,
				draftId: ownDraft.id,
			});

			expect(resolved.id).toBe(ownDraft.id);

			const foreign = yield* Effect.either(
				draftResolveFx({
					userId: users.seller.id,
					draftId: foreignDraft.id,
				}),
			);
			expectErrorFx(foreign);

			const missing = yield* Effect.either(
				draftResolveFx({
					userId: users.seller.id,
					draftId: "missing-draft-id",
				}),
			);
			expectErrorFx(missing);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
