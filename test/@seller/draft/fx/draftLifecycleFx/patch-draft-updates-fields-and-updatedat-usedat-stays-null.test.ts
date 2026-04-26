import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftPatchFx } from "~/seller/draft/server/fx/draftPatchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("draft lifecycle", () => {
	it("patch draft updates fields and updatedAt, usedAt stays null", async () => {
		const database = await testabase("draft-patch");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

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
				userId: seller.id,
				scope: {
					userId: seller.id,
				},
			});

			expect(patched.title).toBe("Updated title");
			expect(Number(patched.price)).toBe(999);
			expect(patched.usedAt).toBeNull();
			expect(new Date(patched.updatedAt).getTime()).toBeGreaterThanOrEqual(
				new Date(draft.updatedAt).getTime(),
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
