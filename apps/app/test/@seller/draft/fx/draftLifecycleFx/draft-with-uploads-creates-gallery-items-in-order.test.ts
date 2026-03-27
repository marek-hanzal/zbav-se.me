import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("draft lifecycle", () => {
	it("draft with uploads creates gallery items in order", async () => {
		const database = await testabase("draft-create-with-uploads");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@draft-uploads.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const draft = await Effect.gen(function* () {
			const upload1 = yield* uploadCreateFx({
				url: "https://cdn.zbav-se.me/test1.jpg",
				userId: seller.id,
			});
			const upload2 = yield* uploadCreateFx({
				url: "https://cdn.zbav-se.me/test2.jpg",
				userId: seller.id,
			});

			return yield* draftCreateFx({
				userId: seller.id,
				title: "Draft with uploads",
				uploadIds: [
					upload1.id,
					upload2.id,
				],
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		const galleryItems = await database.kysely
			.selectFrom("gallery_item")
			.select([
				"uploadId",
				"sort",
			])
			.where("galleryId", "=", draft.galleryId)
			.orderBy("sort", "asc")
			.execute();

		expect(galleryItems).toHaveLength(2);
		expect(galleryItems[0]?.sort).toBe(0);
		expect(galleryItems[1]?.sort).toBe(1);
	});
});
