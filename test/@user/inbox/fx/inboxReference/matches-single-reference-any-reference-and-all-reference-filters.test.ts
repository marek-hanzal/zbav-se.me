import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCreateFx } from "~/seller/listing/server/fx/listingCreateFx";
import { categoryFetchFx } from "~/session/category/server/fx/categoryFetchFx";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { inboxCollectionFx } from "~/user/inbox/server/fx/inboxCollectionFx";
import { inboxCreateFx } from "~/user/inbox/server/fx/inboxCreateFx";
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
			url: "https://cdn.zbav-se.me/test.jpg",
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

describe("inbox reference", () => {
	it("matches single reference, any-reference and all-reference filters", async () => {
		const database = await testabase("inboxReference-query-filtering");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			const listingInbox = yield* inboxCreateFx({
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

			const otherInbox = yield* inboxCreateFx({
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

			const inboxIds = {
				listingInboxId: listingInbox.id,
				otherInboxId: otherInbox.id,
			};

			const singleReference = yield* inboxCollectionFx({
				where: {
					reference: "transaction-1",
				},
				scope: {
					userId: user.id,
				},
			});

			const anyReference = yield* inboxCollectionFx({
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

			const allReference = yield* inboxCollectionFx({
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
				inboxIds.listingInboxId,
			]);
			expect(anyReference.map(({ id }) => id)).toEqual([
				inboxIds.otherInboxId,
			]);
			expect(allReference.map(({ id }) => id)).toEqual([
				inboxIds.listingInboxId,
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
