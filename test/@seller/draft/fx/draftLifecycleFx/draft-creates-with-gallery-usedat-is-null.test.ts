import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("draft lifecycle", () => {
	it("draft creates with gallery, usedAt is null", async () => {
		const database = await testabase("draft-create-basic");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user: seller } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "seller@draft-create.cz",
						name: "Seller",
						password: "12345678",
					},
				}),
			);

			const draft = yield* draftCreateFx({
				userId: seller.id,
				title: "Draft title",
			});

			expect(draft.galleryId).toBeDefined();
			expect(draft.usedAt).toBeNull();

			const gallery = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("gallery")
					.select("id")
					.where("id", "=", draft.galleryId)
					.executeTakeFirst(),
			);

			expect(gallery).toBeDefined();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
