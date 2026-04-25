import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";
import { uploadCollectionFx } from "~/user/upload/server/fx/uploadCollectionFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";
import { uploadFetchFx } from "~/user/upload/server/fx/uploadFetchFx";

describe("uploadCollectionFx", () => {
	it("returns only scoped uploads and stays consistent with fetch", async () => {
		const database = await testabase("uploadCollectionFx-contract");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const uploadContext = yield* UploadContextFx;
			const cdn = uploadContext.cdn.replace(/\/$/, "");

			const first = yield* uploadCreateFx({
				access: "private",
				userId: users.seller.id,
				url: `${cdn}/upload-a.jpg`,
			});
			const second = yield* uploadCreateFx({
				access: "private",
				userId: users.seller.id,
				url: `${cdn}/upload-b.jpg`,
			});
			yield* uploadCreateFx({
				access: "private",
				userId: users.stranger.id,
				url: `${cdn}/upload-hidden.jpg`,
			});

			const collection = yield* uploadCollectionFx({
				scope: {
					userId: users.seller.id,
				},
				cursor: {
					page: 0,
					size: 10,
				},
			});

			expect(collection.map((item) => item.id)).toEqual(
				expect.arrayContaining([
					first.id,
					second.id,
				]),
			);
			expect(collection).toHaveLength(2);

			const fetched = yield* uploadFetchFx({
				where: {
					id: collection[0]?.id,
				},
				scope: {
					userId: users.seller.id,
				},
			});

			expect(collection.map((item) => item.id)).toContain(fetched.id);

			const empty = yield* uploadCollectionFx({
				where: {
					id: "missing-upload-id",
				},
				scope: {
					userId: users.seller.id,
				},
			});

			expect(empty).toEqual([]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
