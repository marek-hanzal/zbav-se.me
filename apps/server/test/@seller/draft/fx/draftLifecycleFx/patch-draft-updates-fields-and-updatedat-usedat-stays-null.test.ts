import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/@seller/draft/fx/draftCreateFx";
import { draftPatchFx } from "~/@seller/draft/fx/draftPatchFx";
import { auth } from "~/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("draft lifecycle", () => {
	it("patch draft updates fields and updatedAt, usedAt stays null", async () => {
		const database = await testabase("draft-patch");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@draft-patch.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const draft = await Effect.gen(function* () {
			return yield* draftCreateFx({
				userId: seller.id,
				title: "Original title",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const patched = await Effect.gen(function* () {
			return yield* draftPatchFx({
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(patched.title).toBe("Updated title");
		expect(Number(patched.price)).toBe(999);
		expect(patched.usedAt).toBeNull();
		expect(patched.updatedAt.getTime()).toBeGreaterThanOrEqual(draft.updatedAt.getTime());
	});
});
