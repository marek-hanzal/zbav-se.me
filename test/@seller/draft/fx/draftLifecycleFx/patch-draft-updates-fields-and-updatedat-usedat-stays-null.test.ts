import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftPatchFx } from "~/seller/draft/server/fx/draftPatchFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("draft lifecycle", () => {
	it("patch draft updates fields and updatedAt, usedAt stays null", async () => {
		const database = await testabase("draft-patch");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@draft-patch.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const draft = yield* draftCreateFx({
				userId: seller.id,
				title: "Original title",
			});

			const patched = yield* draftPatchFx({
				patch: {
					title: "Updated title",
					price: 999,
				},
				query: {
					where: {
						id: draft.id,
					},
				},
				scope: {
					userId: seller.id,
				},
			});

			expect(patched.title).toBe("Updated title");
			expect(Number(patched.price)).toBe(999);
			expect(patched.usedAt).toBeNull();
			expect(patched.updatedAt.getTime()).toBeGreaterThanOrEqual(draft.updatedAt.getTime());
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
