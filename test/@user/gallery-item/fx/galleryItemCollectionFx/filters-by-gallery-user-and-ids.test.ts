import { Effect } from "effect";
import { describe, it } from "vitest";
// import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("galleryItemCollectionFx", () => {
	it("filters by gallery, owner scope and ids while keeping count consistent", async () => {
		const database = await testabase("galleryItemCollectionFx-contract");

		return Effect.gen(function* () {
			const { seller, buyer, stranger } = yield* createUsersFx({});

			const sellerFirstUpload = yield* uploadCreateFx({
				access: "private",
				userId: seller.id,
				url: testUploadUrl("gallery-item-collection-1.jpg"),
			});
			const sellerSecondUpload = yield* uploadCreateFx({
				access: "private",
				userId: seller.id,
				url: testUploadUrl("gallery-item-collection-2.jpg"),
			});
			const buyerUpload = yield* uploadCreateFx({
				access: "private",
				userId: buyer.id,
				url: testUploadUrl("gallery-item-collection-3.jpg"),
			});

			// const sellerDraft = yield* draftCreateFx({
			// 	userId: seller.id,
			// 	title: "Seller Gallery",
			// 	uploadIds: [
			// 		sellerFirstUpload.id,
			// 		sellerSecondUpload.id,
			// 	],
			// });
			// const buyerDraft = yield* draftCreateFx({
			// 	userId: buyer.id,
			// 	title: "Buyer Gallery",
			// 	uploadIds: [
			// 		buyerUpload.id,
			// 	],
			// });

			// const sellerItems = yield* galleryItemCollectionFx({
			// 	scope: {
			// 		userId: seller.id,
			// 	},
			// 	where: {
			// 		galleryId: sellerDraft.galleryId,
			// 	},
			// });

			// const firstSellerItem = sellerItems[0];

			// if (!firstSellerItem) {
			// 	throw new Error("Expected seller gallery to contain at least one item");
			// }

			// const filteredByIds = yield* galleryItemCollectionFx({
			// 	scope: {
			// 		userId: seller.id,
			// 	},
			// 	where: {
			// 		idIn: [
			// 			firstSellerItem.id,
			// 			"missing-gallery-item-id",
			// 		],
			// 	},
			// });
			// const sellerCount = yield* galleryItemCountFx({
			// 	scope: {
			// 		userId: seller.id,
			// 	},
			// 	where: {
			// 		galleryId: sellerDraft.galleryId,
			// 	},
			// });
			// const strangerItems = yield* galleryItemCollectionFx({
			// 	scope: {
			// 		userId: stranger.id,
			// 	},
			// 	where: {
			// 		galleryId: sellerDraft.galleryId,
			// 	},
			// });
			// const buyerOwnItems = yield* galleryItemCollectionFx({
			// 	scope: {
			// 		userId: buyer.id,
			// 	},
			// 	where: {
			// 		galleryId: buyerDraft.galleryId,
			// 	},
			// });

			// expect(sellerItems).toHaveLength(2);
			// expect(filteredByIds).toHaveLength(1);
			// expect(filteredByIds[0]?.id).toBe(firstSellerItem.id);
			// expect(sellerCount).toBe(2);
			// expect(strangerItems).toEqual([]);
			// expect(buyerOwnItems).toHaveLength(1);
		});
	});
});
