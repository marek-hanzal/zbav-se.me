import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { genId } from "@/lib/common/gen-id";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { draftPatchFx } from "~/seller/draft/server/fx/draftPatchFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

const GALLERY_LIMIT = 3;

const seedGalleryLimitFx = (userId: string) =>
	Effect.promise(async () => {
		const bundleId = genId();
		const now = new Date();

		return {
			bundleId,
			createdAt: new Date("2030-01-01T00:00:00.000Z"),
			now,
			userId,
		};
	});

const seedUploadIdsFx = (count: number, userId: string) =>
	Effect.promise(async () => {
		return Array.from({
			length: count,
		}).map(() => ({
			id: genId(),
			userId,
			url: `https://cdn.zbav-se.me/${genId()}.jpg`,
			access: "private" as const,
			createdAt: new Date(),
		}));
	});

describe("draftPatchFx gallery limit", () => {
	it("allows gallery item count at the limit and rejects count above it", async () => {
		const database = await testabase("draft-patch-gallery-limit");

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});
			const limitSeed = yield* seedGalleryLimitFx(seller.id);
			const uploads = yield* seedUploadIdsFx(GALLERY_LIMIT + 1, seller.id);

			yield* Effect.promise(async () => {
				await database.kysely
					.insertInto("resource_bundle")
					.values({
						id: limitSeed.bundleId,
						name: `Draft gallery limit ${limitSeed.bundleId}`,
					})
					.execute();
				await database.kysely
					.insertInto("resource_bundle_limit")
					.values({
						id: genId(),
						resourceBundleId: limitSeed.bundleId,
						resourceDefinitionId: "seller:limit:listing.gallery.count",
						limit: GALLERY_LIMIT,
					})
					.execute();
				await database.kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genId(),
						userId: seller.id,
						resourceBundleId: limitSeed.bundleId,
						createdAt: limitSeed.createdAt,
						availableAt: limitSeed.now,
						expiresAt: null,
					})
					.execute();
				await database.kysely.insertInto("upload").values(uploads).execute();
			});

			const draft = yield* draftCreateFx({
				userId: seller.id,
			});

			const atLimitUploadIds = uploads.slice(0, GALLERY_LIMIT).map((upload) => upload.id);
			const aboveLimitUploadIds = uploads.map((upload) => upload.id);

			const patched = yield* draftPatchFx({
				userId: seller.id,
				query: {
					where: {
						id: draft.id,
					},
				},
				scope: {
					userId: seller.id,
				},
				patch: {
					uploadIds: atLimitUploadIds,
				},
			});
			const aboveLimit = yield* draftPatchFx({
				userId: seller.id,
				query: {
					where: {
						id: draft.id,
					},
				},
				scope: {
					userId: seller.id,
				},
				patch: {
					uploadIds: aboveLimitUploadIds,
				},
			}).pipe(Effect.either);
			const galleryItems = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("gallery_item")
					.select([
						"uploadId",
						"sort",
					])
					.where("galleryId", "=", draft.galleryId)
					.orderBy("sort", "asc")
					.execute(),
			);

			expect(patched.withUploadIds).toEqual(atLimitUploadIds);
			expectTaggedErrorFx(aboveLimit, {
				tag: "ResourceLimitErrorFx",
				message: `Resource limit exceeded for [${ResourceDefinitionEnumSchema.enum["seller:limit:listing.gallery.count"]}]`,
			});
			expect(galleryItems).toEqual(
				atLimitUploadIds.map((uploadId, sort) => ({
					uploadId,
					sort,
				})),
			);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
