import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { categoryFetchFx } from "~/session/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("draft lifecycle", () => {
	it("creating listing without draftId does not set usedAt on any draft", async () => {
		const database = await testabase("listing-no-draft");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});

			const category = yield* categoryFetchFx({
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			});
			const location = yield* locationAutocompleteFx({
				lang: "cs",
				text: "Praha",
				limit: 1,
			});
			const upload = yield* uploadCreateFx({
				url: testUploadUrl("test.jpg"),
				userId: seller.id,
			});

			// Create draft but do NOT pass draftId to listingCreateFx
			yield* draftCreateFx({
				userId: seller.id,
				title: "Unused draft",
			});

			yield* listingCreateFx({
				userId: seller.id,
				title: "Listing without draft",
				price: 100,
				priceType: "open",
				condition: 1,
				age: 1,
				restriction: "none",
				expiresAt: "1-month",
				categoryId: category.id,
				// biome-ignore lint/style/noNonNullAssertion: asserted by locationAutocompleteFx
				locationId: location[0]!.id,
				uploadIds: [
					upload.id,
				],
			});

			const draft = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("draft")
					.select("usedAt")
					.where("userId", "=", seller.id)
					.executeTakeFirstOrThrow(),
			);

			expect(draft.usedAt).toBeNull();
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
