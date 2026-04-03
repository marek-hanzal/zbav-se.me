import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedGalleryCreateFx } from "~/buyer/feed-gallery/server/fx/feedGalleryCreateFx";
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

			expect(result._tag).toBe("Left");
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
