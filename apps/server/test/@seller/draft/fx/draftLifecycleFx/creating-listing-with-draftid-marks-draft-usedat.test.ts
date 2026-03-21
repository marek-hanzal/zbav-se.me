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
	it("creating listing with draftId marks draft.usedAt", async () => {
		const database = await testabase("draft-to-listing");
		const { api } = auth(() => database.dialect);

		const { user: seller } = await api.signUpEmail({
			body: {
				email: "seller@draft-to-listing.cz",
				name: "Seller",
				password: "12345678",
			},
		});

		const { draft, listing } = await Effect.gen(function* () {
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

			const createdDraft = yield* draftCreateFx({
				userId: seller.id,
				title: "Draft ready for listing",
			});

			const createdListing = yield* listingCreateFx({
				userId: seller.id,
				draftId: createdDraft.id,
				title: "Listing from draft",
				price: 500,
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

			return {
				draft: createdDraft,
				listing: createdListing,
			};
		}).pipe(withRuntimeFx(database), Effect.runPromise);

		// Listing was created with status live
		expect(listing.status).toBe("live");

		// draft.usedAt must be set after listing creation
		const updatedDraft = await database.kysely
			.selectFrom("draft")
			.select([
				"usedAt",
				"updatedAt",
			])
			.where("id", "=", draft.id)
			.executeTakeFirstOrThrow();

		expect(updatedDraft.usedAt).not.toBeNull();

		// "listing.create" is in userEventCreateFx ignored list — intentionally not persisted
	});
});
