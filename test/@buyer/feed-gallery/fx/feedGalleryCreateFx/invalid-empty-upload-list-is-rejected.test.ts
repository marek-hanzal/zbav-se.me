import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer-feed/fx/feedCreateFx";
import { feedGalleryCreateFx } from "~/buyer-feed-gallery/fx/feedGalleryCreateFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

describe("feedGalleryCreateFx", () => {
	it("rejects empty upload list", async () => {
		const database = await testabaseFn("feedGalleryCreateFx-empty");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			const feed = yield* feedCreateFx({
				userId: user.id,
				type: "search",
				name: "Empty gallery feed",
				query: {},
			});

			const result = yield* Effect.result(
				feedGalleryCreateFx({
					userId: user.id,
					feedId: feed.id,
					uploadIds: [],
				}),
			);

			expectTaggedErrorFn(result, {
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
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
