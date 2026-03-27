import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/server/@seller/draft/fx/draftCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("draft lifecycle", () => {
	it("draft creates with gallery, usedAt is null", async () => {
		const database = await testabase("draft-create-basic");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@draft-create.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const draft = await Effect.gen(function* () {
			return yield* draftCreateFx({
				userId: seller.id,
				title: "Draft title",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		expect(draft.galleryId).toBeDefined();
		expect(draft.usedAt).toBeNull();

		// Gallery record must exist
		const gallery = await database.kysely
			.selectFrom("gallery")
			.select("id")
			.where("id", "=", draft.galleryId)
			.executeTakeFirst();

		expect(gallery).toBeDefined();
	});
});
