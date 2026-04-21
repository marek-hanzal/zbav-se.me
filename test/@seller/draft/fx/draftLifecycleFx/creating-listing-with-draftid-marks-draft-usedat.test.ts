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
	it("creating listing with draftId marks draft.usedAt", async () => {
		const database = await testabase("draft-to-listing");

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
		}).pipe(
			withRuntimeFx(database),
			Effect.flatMap(({ draft, listing }) =>
				Effect.gen(function* () {
					expect(listing.status).toBe("live");

					const updatedDraft = yield* Effect.promise(() =>
						database.kysely
							.selectFrom("draft")
							.select([
								"usedAt",
								"updatedAt",
							])
							.where("id", "=", draft.id)
							.executeTakeFirstOrThrow(),
					);

					expect(updatedDraft.usedAt).not.toBeNull();
				}),
			),
			Effect.runPromise,
		);
	});
});
