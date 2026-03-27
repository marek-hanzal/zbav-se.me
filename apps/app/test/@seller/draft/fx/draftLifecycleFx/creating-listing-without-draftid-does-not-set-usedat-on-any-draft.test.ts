import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { draftCreateFx } from "~/@seller/draft/fx/draftCreateFx";
import { listingCreateFx } from "~/@seller/listing/fx/listingCreateFx";
import { categoryFetchFx } from "~/@session/category/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/@session/location/fx/locationAutocompleteFx";
import { uploadCreateFx } from "~/@user/upload/fx/uploadCreateFx";
import { auth } from "~/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("draft lifecycle", () => {
	it("creating listing without draftId does not set usedAt on any draft", async () => {
		const database = await testabase("listing-no-draft");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@listing-no-draft.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		await Effect.gen(function* () {
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
				url: "https://cdn.zbav-se.me/test.jpg",
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
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// The draft should have usedAt = null (not touched)
		const draft = await database.kysely
			.selectFrom("draft")
			.select("usedAt")
			.where("userId", "=", seller.id)
			.executeTakeFirstOrThrow();

		expect(draft.usedAt).toBeNull();
	});
});
