import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedGalleryCreateFx } from "~/buyer/feed-gallery/server/fx/feedGalleryCreateFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("feedGalleryCreateFx", () => {
	it("rejects empty upload list", async () => {
		const database = await testabase("feedGalleryCreateFx-empty");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			const feed = yield* feedCreateFx({
				userId: user.id,
				type: "search",
				name: "Empty gallery feed",
				query: {},
			});

			const result = yield* Effect.either(
				feedGalleryCreateFx({
					userId: user.id,
					feedId: feed.id,
					uploadIds: [],
				}),
			);

			expectTaggedErrorFx(result, {
				tag: "InvalidRequestErrorFx",
				message: "At least one upload is required",
			});

			const galleryItems = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("gallery_item")
					.select("id")
					.where("galleryId", "=", feed.id)
					.execute(),
			);

			expect(galleryItems).toHaveLength(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
