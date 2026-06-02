import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingEventCollectionFx } from "~/buyer/listing-event/server/fx/listingEventCollectionFx";
import { listingEventCountFx } from "~/buyer/listing-event/server/fx/listingEventCountFx";
import { listingEventCreateFx } from "~/buyer/listing-event/server/fx/listingEventCreateFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("listingEvent read model", () => {
	it("filters events by listing and ids while keeping count consistent", async () => {
		const database = await testabase("listingEvent-collection-contract");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});
			const listing = yield* createListingFx(seller.id, {
				title: "Listing Event Primary",
			});
			const otherListing = yield* createListingFx(stranger.id, {
				title: "Listing Event Secondary",
			});

			const impression = yield* listingEventCreateFx({
				userId: buyer.id,
				listingId: listing.id,
				event: "impression",
			});
			const favourite = yield* listingEventCreateFx({
				userId: buyer.id,
				listingId: listing.id,
				event: "listing.favourite",
			});
			yield* listingEventCreateFx({
				userId: buyer.id,
				listingId: otherListing.id,
				event: "view",
			});

			const collection = yield* listingEventCollectionFx({
				scope: {},
				where: {
					listingId: listing.id,
				},
				sort: [
					{
						field: "createdAt",
						order: "asc",
					},
				],
				cursor: {
					page: 0,
					size: 10,
				},
			});
			const count = yield* listingEventCountFx({
				scope: {},
				where: {
					listingId: listing.id,
				},
			});
			const onlyFavourite = yield* listingEventCollectionFx({
				scope: {},
				where: {
					idIn: [
						favourite.id,
					],
				},
				cursor: {
					page: 0,
					size: 10,
				},
			});
			const empty = yield* listingEventCollectionFx({
				scope: {},
				where: {
					listingId: "missing-listing-id",
				},
				cursor: {
					page: 0,
					size: 10,
				},
			});

			expect(collection).toHaveLength(2);
			expect(collection.map((event) => event.id)).toEqual([
				impression.id,
				favourite.id,
			]);
			expect(count).toBe(2);
			expect(onlyFavourite).toHaveLength(1);
			expect(onlyFavourite[0]?.id).toBe(favourite.id);
			expect(empty).toEqual([]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
