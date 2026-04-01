import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { feedCreateFx } from "~/buyer/feed/server/fx/feedCreateFx";
import { feedGalleryCreateFx } from "~/buyer/feed-gallery/server/fx/feedGalleryCreateFx";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";

describe("feedGalleryCreateFx", () => {
	it("rejects empty upload list", async () => {
		const database = await testabase("feedGalleryCreateFx-empty");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "feed-gallery-empty@test.cz",
						name: "Feed Gallery Empty",
						password: "12345678",
					},
				}),
			);

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
