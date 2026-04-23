import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { listingCollectionFx } from "~/public/listing/server/fx/listingCollectionFx";
import { listingFetchFx } from "~/public/listing/server/fx/listingFetchFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";

type JsonRecord = Record<string, unknown>;

const hasUserIdKey = (value: unknown): boolean => {
	if (Array.isArray(value)) {
		return value.some(hasUserIdKey);
	}

	if (value && typeof value === "object") {
		const record = value as JsonRecord;

		return "userId" in record || Object.values(record).some(hasUserIdKey);
	}

	return false;
};

describe("public listing gallery privacy", () => {
	it("only exposes gallery data attached to visible listings and never includes user ids", async () => {
		const database = await testabase("public-listing-gallery-privacy");

		return Effect.gen(function* () {
			const seller = yield* leaseTestUserFx({});
			const otherUser = yield* leaseTestUserFx({});
			const uploadContext = yield* UploadContextFx;

			const listing = yield* createListingFx(seller.id, {
				title: "Privacy checked listing",
			});

			const orphanUploadId = "upl_public_listing_privacy_orphan";
			const orphanGalleryId = "gal_public_listing_privacy_orphan";
			const orphanGalleryItemId = "gali_public_listing_privacy_orphan";
			const orphanUrl = `${uploadContext.cdn.replace(/\/$/, "")}/orphan-private.jpg`;
			const now = new Date();

			yield* Effect.promise(() =>
				database.kysely
					.insertInto("upload")
					.values({
						id: orphanUploadId,
						userId: otherUser.id,
						url: orphanUrl,
						access: "private",
						createdAt: now,
					})
					.execute(),
			);
			yield* Effect.promise(() =>
				database.kysely
					.insertInto("gallery")
					.values({
						id: orphanGalleryId,
						userId: otherUser.id,
						access: "private",
						createdAt: now,
					})
					.execute(),
			);
			yield* Effect.promise(() =>
				database.kysely
					.insertInto("gallery_item")
					.values({
						id: orphanGalleryItemId,
						galleryId: orphanGalleryId,
						uploadId: orphanUploadId,
						sort: 0,
						createdAt: now,
					})
					.execute(),
			);

			const fetched = yield* listingFetchFx({
				where: {
					id: listing.id,
				},
				scope: {},
			});
			const collection = yield* listingCollectionFx({
				where: {
					id: listing.id,
				},
				scope: {},
			});
			const serialized = JSON.stringify([
				fetched,
				collection,
			]);

			expect(fetched.gallery.id).toBe(listing.gallery.id);
			expect(fetched.gallery.items).toHaveLength(1);
			expect(fetched.gallery.items.map((item) => item.upload.url)).not.toContain(orphanUrl);
			expect(serialized).not.toContain(orphanUploadId);
			expect(serialized).not.toContain(orphanGalleryId);
			expect(serialized).not.toContain(orphanGalleryItemId);
			expect(serialized).not.toContain(otherUser.id);
			expect(hasUserIdKey(fetched)).toBe(false);
			expect(hasUserIdKey(collection)).toBe(false);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
