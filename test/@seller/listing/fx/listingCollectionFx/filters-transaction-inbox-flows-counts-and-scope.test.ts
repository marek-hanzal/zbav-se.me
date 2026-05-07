import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { transactionSuccessFx } from "~/buyer/transaction/server/fx/transactionSuccessFx";
import { listingCollectionFx } from "~/seller/listing/server/fx/listingCollectionFx";
import { listingCountFx } from "~/seller/listing/server/fx/listingCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { createPendingScenarioFx } from "~/test/transaction/fx/createPendingScenarioFx";
import { createResolvedScenarioFx } from "~/test/transaction/fx/createResolvedScenarioFx";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { activityArchiveFx } from "~/user/activity/server/fx/activityArchiveFx";

describe("seller listing inbox flows", () => {
	it("filters buyer-to-seller, seller-to-buyer and archived listings inside seller scope", async () => {
		const database = await testabase("seller-listing-flow-filters");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});

			const buyerToSeller = yield* createPendingScenarioFx({
				sellerId: users.seller.id,
				buyerId: users.buyer.id,
			});
			const sellerToBuyer = yield* createOpenScenarioFx({
				sellerId: users.seller.id,
				buyerId: users.buyer.id,
			});
			const archived = yield* createResolvedScenarioFx({
				sellerId: users.seller.id,
				buyerId: users.buyer.id,
			});
			yield* transactionSuccessFx({
				transactionId: archived.transactionId,
				userId: users.buyer.id,
			});
			const foreign = yield* createPendingScenarioFx({
				sellerId: users.stranger.id,
				buyerId: users.buyer.id,
			});

			yield* activityArchiveFx({
				scope: {
					userId: users.seller.id,
				},
				where: {
					family: "transaction",
					type: "buyer-message",
					reference: sellerToBuyer.listingId,
				},
			});
			yield* activityArchiveFx({
				scope: {
					userId: users.seller.id,
				},
				where: {
					family: "transaction",
					type: "buyer-message",
					reference: archived.listingId,
				},
			});

			const buyerToSellerCollection = yield* listingCollectionFx({
				userId: users.seller.id,
				scope: {
					userId: users.seller.id,
				},
				where: {
					flow: "buyer-to-seller",
					withTransaction: true,
				},
			});
			const sellerToBuyerCollection = yield* listingCollectionFx({
				userId: users.seller.id,
				scope: {
					userId: users.seller.id,
				},
				where: {
					flow: "seller-to-buyer",
					withTransaction: true,
				},
			});
			const archivedCollection = yield* listingCollectionFx({
				userId: users.seller.id,
				scope: {
					userId: users.seller.id,
				},
				where: {
					flow: "archived",
					withTransaction: true,
				},
			});
			const archivedCount = yield* listingCountFx({
				userId: users.seller.id,
				scope: {
					userId: users.seller.id,
				},
				where: {
					flow: "archived",
					withTransaction: true,
				},
			});

			expect(buyerToSellerCollection.map((item) => item.id)).toEqual([
				buyerToSeller.listingId,
			]);
			expect(buyerToSellerCollection[0]?.withUnreadCount).toBe(1);
			expect(sellerToBuyerCollection.map((item) => item.id)).toEqual([
				sellerToBuyer.listingId,
			]);
			expect(sellerToBuyerCollection[0]?.withUnreadCount).toBe(0);
			expect(archivedCollection.map((item) => item.id)).toEqual([
				archived.listingId,
			]);
			expect(archivedCollection[0]?.withUnreadCount).toBe(0);
			expect(archivedCount).toBe(archivedCollection.length);
			expect(
				[
					...buyerToSellerCollection,
					...sellerToBuyerCollection,
					...archivedCollection,
				].map((item) => item.id),
			).not.toContain(foreign.listingId);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
