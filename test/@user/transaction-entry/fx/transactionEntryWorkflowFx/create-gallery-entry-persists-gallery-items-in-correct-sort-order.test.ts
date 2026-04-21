import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createOpenScenarioFx } from "~/test/transaction/fx/createOpenScenarioFx";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { transactionEntryCreateFx } from "~/user/transaction-entry/server/fx/transactionEntryCreateFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("transactionEntryWorkflowFx", () => {
	it("gallery entry persists gallery items in correct sort order", async () => {
		const database = await testabase("transactionEntryWorkflowFx-gallery-sort");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const buyer = yield* leaseTestUserFx({});

			const { transactionId } = yield* createOpenScenarioFx({
				sellerId: seller.id,
				buyerId: buyer.id,
			});

			const uploads = yield* Effect.all([
				uploadCreateFx({
					userId: buyer.id,
					url: testUploadUrl("gallery-sort-1.jpg"),
				}),
				uploadCreateFx({
					userId: buyer.id,
					url: testUploadUrl("gallery-sort-2.jpg"),
				}),
				uploadCreateFx({
					userId: buyer.id,
					url: testUploadUrl("gallery-sort-3.jpg"),
				}),
				uploadCreateFx({
					userId: buyer.id,
					url: testUploadUrl("gallery-sort-4.jpg"),
				}),
			]);

			const uploadIds = uploads.map((u) => u.id);

			const entry = yield* transactionEntryCreateFx({
				transactionId,
				userId: buyer.id,
				kind: "gallery",
				payload: {
					uploadIds,
				},
			});

			if (entry.kind !== "gallery") {
				throw new Error("Expected gallery entry");
			}

			const galleryItems = yield* Effect.promise(() =>
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

			expect(galleryItems).toHaveLength(4);
			expect(galleryItems[0]?.uploadId).toBe(uploadIds[0]);
			expect(galleryItems[1]?.uploadId).toBe(uploadIds[1]);
			expect(galleryItems[2]?.uploadId).toBe(uploadIds[2]);
			expect(galleryItems[3]?.uploadId).toBe(uploadIds[3]);
			expect(galleryItems[0]?.sort).toBe(0);
			expect(galleryItems[1]?.sort).toBe(1);
			expect(galleryItems[2]?.sort).toBe(2);
			expect(galleryItems[3]?.sort).toBe(3);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
