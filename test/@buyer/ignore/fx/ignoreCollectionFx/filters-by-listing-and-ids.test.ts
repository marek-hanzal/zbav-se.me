import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ignoreCollectionFx } from "~/buyer/listing-ignore/server/fx/ignoreCollectionFx";
import { ignoreCountFx } from "~/buyer/listing-ignore/server/fx/ignoreCountFx";
import { ignoreToggleFx } from "~/buyer/listing-ignore/server/fx/ignoreToggleFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("ignoreCollectionFx", () => {
	it("filters by listing and idIn while staying scoped to the current user", async () => {
		const database = await testabase("ignoreCollectionFx-contract");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});
			const firstListing = yield* createListingFx(seller.id, {
				title: "Ignore One",
			});
			const secondListing = yield* createListingFx(seller.id, {
				title: "Ignore Two",
			});

			yield* ignoreToggleFx({
				userId: buyer.id,
				listingId: firstListing.id,
				toggle: true,
			});
			yield* ignoreToggleFx({
				userId: buyer.id,
				listingId: secondListing.id,
				toggle: true,
			});

			const all = yield* ignoreCollectionFx({
				scope: {
					userId: buyer.id,
				},
			});

			const firstIgnore = all[0];

			if (!firstIgnore) {
				throw new Error("Expected ignore collection to contain at least one item");
			}

			const byListing = yield* ignoreCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: firstListing.id,
				},
			});
			const byIds = yield* ignoreCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					idIn: [
						firstIgnore.id,
						"missing-ignore-id",
					],
				},
			});
			const count = yield* ignoreCountFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: firstListing.id,
				},
			});
			const strangerCollection = yield* ignoreCollectionFx({
				scope: {
					userId: stranger.id,
				},
			});

			expect(all).toHaveLength(2);
			expect(byListing).toHaveLength(1);
			expect(byListing[0]?.id).toBe(firstIgnore.id);
			expect(byIds).toHaveLength(1);
			expect(byIds[0]?.id).toBe(firstIgnore.id);
			expect(count).toBe(1);
			expect(strangerCollection).toEqual([]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
