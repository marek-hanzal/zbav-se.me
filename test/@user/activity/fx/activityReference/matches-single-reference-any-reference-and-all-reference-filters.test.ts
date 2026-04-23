import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { activityCollectionFx } from "~/user/activity/server/fx/activityCollectionFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";
import { categoryFetchFx } from "~/user/category/server/fx/categoryFetchFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

interface ListingFixture {
	listingId: string;
	sellerId: string;
	buyerId: string;
}

const _createListingFixtureFx = ({ buyerId, sellerId }: Omit<ListingFixture, "listingId">) =>
	Effect.gen(function* () {
		const category = yield* categoryFetchFx({
			userId: sellerId,
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
			access: "private",
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
			delivery: null,
			warranty: null,
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
	it("matches single reference, any-reference and all-reference filters", async () => {
		const database = await testabase("activityReference-query-filtering");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			const listingActivity = yield* activityCreateFx({
				userId: user.id,
				reference: [
					"listing-1",
					"transaction-1",
				],
				family: "transaction",
				type: "transaction",
				payload: {
					listingId: "listing-1",
					target: "seller",
					transactionId: "transaction-1",
				},
				priority: "high",
			});

			const otherActivity = yield* activityCreateFx({
				userId: user.id,
				reference: [
					"listing-2",
					"transaction-2",
				],
				family: "transaction",
				type: "transaction",
				payload: {
					listingId: "listing-2",
					target: "seller",
					transactionId: "transaction-2",
				},
				priority: "high",
			});

			const activityIds = {
				listingActivityId: listingActivity.id,
				otherActivityId: otherActivity.id,
			};

			const singleReference = yield* activityCollectionFx({
				where: {
					reference: "transaction-1",
				},
				scope: {
					userId: user.id,
				},
			});

			const anyReference = yield* activityCollectionFx({
				where: {
					referenceIn: [
						"listing-3",
						"listing-2",
					],
				},
				scope: {
					userId: user.id,
				},
			});

			const allReference = yield* activityCollectionFx({
				where: {
					referenceAllIn: [
						"listing-1",
						"transaction-1",
					],
				},
				scope: {
					userId: user.id,
				},
			});

			expect(singleReference.map(({ id }) => id)).toEqual([
				activityIds.listingActivityId,
			]);
			expect(anyReference.map(({ id }) => id)).toEqual([
				activityIds.otherActivityId,
			]);
			expect(allReference.map(({ id }) => id)).toEqual([
				activityIds.listingActivityId,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
