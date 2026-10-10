import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { galleryCollectionFx } from "~/public-gallery/fx/galleryCollectionFx";
import { galleryFetchFx } from "~/public-gallery/fx/galleryFetchFx";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { galleryInsertFx } from "~/user-gallery/fx/galleryInsertFx";

describe("public gallery access", () => {
	it("returns public galleries and rejects private galleries", async () => {
		const database = await testabaseFn("public-gallery-access");

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
			const privateFetch = yield* Effect.result(
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
			expectErrorFn(privateFetch);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
