import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { categoryFetchFx } from "~/session/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

interface ListingFixture {
	listingId: string;
	sellerId: string;
	buyerId: string;
}

const _createListingFixtureFx = ({ buyerId, sellerId }: Omit<ListingFixture, "listingId">) =>
	Effect.gen(function* () {
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

		expect(location).toHaveLength(1);

		const upload = yield* uploadCreateFx({
			url: testUploadUrl("test.jpg"),
			userId: sellerId,
		});

		const listing = yield* listingCreateFx({
			age: 1,
			condition: 1,
			categoryId: category.id,
			expiresAt: "1-month",
			// biome-ignore lint/style/noNonNullAssertion: Asserted above.
			locationId: location[0]!.id,
			price: 100,
			priceType: "open",
			restriction: "none",
			title: "Reference fixture listing",
			uploadIds: [
				upload.id,
			],
			userId: sellerId,
		});

		return {
			buyerId,
			listingId: listing.id,
			sellerId,
		} satisfies ListingFixture;
	});

describe("activity reference", () => {
	it("persists normalized reference during direct activity creation", async () => {
		const database = await testabase("activityReference-direct-create");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			const activity = yield* activityCreateFx({
				userId: user.id,
				reference: [
					"listing-direct",
					"transaction-direct",
				],
				family: "reaction",
				type: "favourite",
				payload: {
					listingId: "listing-direct",
				},
				priority: "common",
			});

			expect(activity.reference).toEqual([
				"listing-direct",
				"transaction-direct",
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
