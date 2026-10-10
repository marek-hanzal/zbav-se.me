import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { UploadConfigFx } from "~/user-upload/context/UploadConfigFx";
import { uploadCreateFx } from "~/user-upload/fx/uploadCreateFx";
import { uploadFetchFx } from "~/user-upload/fx/uploadFetchFx";

describe("uploadFetchFx", () => {
	it("fetches scoped upload and rejects missing or foreign upload", async () => {
		const database = await testabaseFn("uploadFetchFx-contract");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const uploadConfig = yield* UploadConfigFx;
			const cdn = uploadConfig.cdn.replace(/\/$/, "");
			const ownUploadUrl = `${cdn}/own-upload.jpg`;

			const ownUpload = yield* uploadCreateFx({
				access: "private",
				userId: users.seller.id,
				url: ownUploadUrl,
			});
			const foreignUpload = yield* uploadCreateFx({
				access: "private",
				userId: users.stranger.id,
				url: `${cdn}/foreign-upload.jpg`,
			});

			const fetched = yield* uploadFetchFx({
				where: {
					id: ownUpload.id,
				},
				scope: {
					userId: users.seller.id,
				},
			});

			expect(fetched.id).toBe(ownUpload.id);
			expect(fetched.url).toBe(ownUploadUrl);

			const foreign = yield* Effect.result(
				uploadFetchFx({
					where: {
						id: foreignUpload.id,
					},
					scope: {
						userId: users.seller.id,
					},
				}),
			);
			expectErrorFn(foreign);

			const missing = yield* Effect.result(
				uploadFetchFx({
					where: {
						id: "missing-upload-id",
					},
					scope: {
						userId: users.seller.id,
					},
				}),
			);
			expectErrorFn(missing);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
