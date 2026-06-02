import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { flagCollectionFx } from "~/buyer/listing-flag/server/fx/flagCollectionFx";
import { flagCountFx } from "~/buyer/listing-flag/server/fx/flagCountFx";
import { flagToggleFx } from "~/buyer/listing-flag/server/fx/flagToggleFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

describe("flagCollectionFx", () => {
	it("filters by listing and idIn while staying scoped to the current user", async () => {
		const database = await testabase("flagCollectionFx-contract");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});
			const firstListing = yield* createListingFx(seller.id, {
				title: "Flag One",
			});
			const secondListing = yield* createListingFx(seller.id, {
				title: "Flag Two",
			});

			yield* flagToggleFx({
				userId: buyer.id,
				listingId: firstListing.id,
				toggle: true,
			});
			yield* flagToggleFx({
				userId: buyer.id,
				listingId: secondListing.id,
				toggle: true,
			});

			const all = yield* flagCollectionFx({
				scope: {
					userId: buyer.id,
				},
			});

			const firstFlag = all[0];

			if (!firstFlag) {
				throw new Error("Expected flag collection to contain at least one item");
			}

			const byListing = yield* flagCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: firstListing.id,
				},
			});
			const byIds = yield* flagCollectionFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					idIn: [
						firstFlag.id,
						"missing-flag-id",
					],
				},
			});
			const count = yield* flagCountFx({
				scope: {
					userId: buyer.id,
				},
				where: {
					listingId: firstListing.id,
				},
			});
			const strangerCollection = yield* flagCollectionFx({
				scope: {
					userId: stranger.id,
				},
			});

			expect(all).toHaveLength(2);
			expect(byListing).toHaveLength(1);
			expect(byListing[0]?.id).toBe(firstFlag.id);
			expect(byIds).toHaveLength(1);
			expect(byIds[0]?.id).toBe(firstFlag.id);
			expect(count).toBe(1);
			expect(strangerCollection).toEqual([]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
