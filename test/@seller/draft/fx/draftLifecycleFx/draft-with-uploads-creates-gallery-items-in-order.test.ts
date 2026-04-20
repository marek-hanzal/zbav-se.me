import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("draft lifecycle", () => {
	it("draft with uploads creates gallery items in order", async () => {
		const database = await testabase("draft-create-with-uploads");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const upload1 = yield* uploadCreateFx({
				url: testUploadUrl("test1.jpg"),
				userId: seller.id,
			});
			const upload2 = yield* uploadCreateFx({
				url: testUploadUrl("test2.jpg"),
				userId: seller.id,
			});

			const draft = yield* draftCreateFx({
				userId: seller.id,
				title: "Draft with uploads",
				uploadIds: [
					upload1.id,
					upload2.id,
				],
			});

			const galleryItems = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("gallery_item")
					.select([
						"uploadId",
						"sort",
					])
					.where("galleryId", "=", draft.galleryId)
					.orderBy("sort", "asc")
					.execute(),
			);

			expect(galleryItems).toHaveLength(2);
			expect(galleryItems[0]?.sort).toBe(0);
			expect(galleryItems[1]?.sort).toBe(1);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
