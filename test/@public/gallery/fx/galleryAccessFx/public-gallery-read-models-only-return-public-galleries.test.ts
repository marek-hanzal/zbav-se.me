import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { galleryCollectionFx } from "~/public/gallery/server/fx/galleryCollectionFx";
import { galleryFetchFx } from "~/public/gallery/server/fx/galleryFetchFx";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { galleryInsertFx } from "~/user/gallery/server/fx/galleryInsertFx";

describe("public gallery access", () => {
	it("returns public galleries and rejects private galleries", async () => {
		const database = await testabase("public-gallery-access");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			const publicGallery = yield* galleryInsertFx({
				access: "public",
				userId: user.id,
			});
			const privateGallery = yield* galleryInsertFx({
				access: "private",
				userId: user.id,
			});
			const protectedGallery = yield* galleryInsertFx({
				access: "protected",
				userId: user.id,
			});

			const fetched = yield* galleryFetchFx({
				where: {
					id: publicGallery.id,
				},
				scope: {},
			});
			const collection = yield* galleryCollectionFx({
				scope: {},
			});
			const privateFetch = yield* Effect.either(
				galleryFetchFx({
					where: {
						id: privateGallery.id,
					},
					scope: {},
				}),
			);

			expect(fetched.id).toBe(publicGallery.id);
			expect(collection.map((item) => item.id)).toContain(publicGallery.id);
			expect(collection.map((item) => item.id)).not.toContain(privateGallery.id);
			expect(collection.map((item) => item.id)).not.toContain(protectedGallery.id);
			expectErrorFx(privateFetch);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
