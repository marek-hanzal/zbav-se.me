import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("draft lifecycle", () => {
	it("draft creates with gallery, usedAt is null", async () => {
		const database = await testabase("draft-create-basic");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

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
