import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftDeleteFx } from "~/seller/draft/server/fx/draftDeleteFx";
import { draftFetchFx } from "~/seller/draft/server/fx/draftFetchFx";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("draftDeleteFx", () => {
	it("deletes scoped draft and makes subsequent fetch fail", async () => {
		const database = await testabase("draftDeleteFx-contract");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			const draft = yield* draftCreateFx({
				userId: users.seller.id,
				title: "Draft to delete",
			});

			const deleted = yield* draftDeleteFx({
				where: {
					id: draft.id,
				},
				scope: {
					userId: users.seller.id,
				},
			});

			expect(deleted.id).toBe(draft.id);

			const afterDelete = yield* Effect.either(
				draftFetchFx({
					where: {
						id: draft.id,
					},
					scope: {
						userId: users.seller.id,
					},
				}),
			);

			expectErrorFx(afterDelete);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
