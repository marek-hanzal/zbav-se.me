import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { transactionEntryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryFetchFx";
import { transactionEntryGalleryFetchFx } from "~/user/transaction-entry/server/fx/transactionEntryGalleryFetchFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("transactionEntry workflow", () => {
	it("creates gallery entry with ordered items and blocks outsider access", async () => {
		const database = await testabase("transactionEntry-gallery-workflow");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const signUp = (email: string, name: string) =>
				Effect.promise(() =>
					api.signUpEmail({
						body: {
							email,
							name,
							password: "12345678",
						},
					}),
				);

			const { user: seller } = yield* signUp(
				"transaction-entry-gallery-seller@test.cz",
				"Transaction Gallery Seller",
			);
			const { user: buyer } = yield* signUp(
				"transaction-entry-gallery-buyer@test.cz",
				"Transaction Gallery Buyer",
			);
			const { user: outsider } = yield* signUp(
				"transaction-entry-gallery-outsider@test.cz",
				"Transaction Gallery Outsider",
			);

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const firstUpload = yield* uploadCreateFx({
				userId: buyer.id,
				url: "https://cdn.zbav-se.me/transaction-entry-gallery-1.jpg",
			});
			const secondUpload = yield* uploadCreateFx({
				userId: buyer.id,
				url: "https://cdn.zbav-se.me/transaction-entry-gallery-2.jpg",
			});

			const entry = yield* transactionEntryCreateFx({
				userId: buyer.id,
				transactionId,
				kind: "gallery",
				payload: {
					uploadIds: [
						firstUpload.id,
						secondUpload.id,
					],
				},
			});

			expect(entry.kind).toBe("gallery");
			expect(entry.direction).toBe("out");

			if (entry.kind !== "gallery") {
				throw new Error("Expected gallery entry");
			}

			const gallery = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("gallery_item")
					.select([
						"uploadId",
						"sort",
					])
					.where("galleryId", "=", entry.payload.galleryId)
					.orderBy("sort", "asc")
					.execute(),
			);

			expect(gallery).toEqual([
				{
					uploadId: firstUpload.id,
					sort: 0,
				},
				{
					uploadId: secondUpload.id,
					sort: 1,
				},
			]);

			const sellerView = yield* transactionEntryFetchFx({
				userId: seller.id,
				where: {
					id: entry.id,
				},
			});

			expect(sellerView.kind).toBe("gallery");
			expect(sellerView.direction).toBe("in");

			const buyerGallery = yield* transactionEntryGalleryFetchFx({
				userId: buyer.id,
				where: {
					transactionEntryId: entry.id,
				},
			});
			const sellerGallery = yield* transactionEntryGalleryFetchFx({
				userId: seller.id,
				where: {
					transactionEntryId: entry.id,
				},
			});

			expect(buyerGallery.id).toBe(entry.payload.galleryId);
			expect(buyerGallery.items.map((item) => item.uploadId)).toEqual([
				firstUpload.id,
				secondUpload.id,
			]);
			expect(sellerGallery.id).toBe(entry.payload.galleryId);

			const outsiderView = yield* Effect.either(
				transactionEntryFetchFx({
					userId: outsider.id,
					where: {
						id: entry.id,
					},
				}),
			);
			const outsiderGallery = yield* Effect.either(
				transactionEntryGalleryFetchFx({
					userId: outsider.id,
					where: {
						transactionEntryId: entry.id,
					},
				}),
			);

			expect(outsiderView._tag).toBe("Left");
			expect(outsiderGallery._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
