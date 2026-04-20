import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";
import { uploadFetchFx } from "~/user/upload/server/fx/uploadFetchFx";

describe("uploadFetchFx", () => {
	it("fetches scoped upload and rejects missing or foreign upload", async () => {
		const database = await testabase("uploadFetchFx-contract");

		return Effect.gen(function* () {
			const users = yield* createUsersFx({});
			const uploadContext = yield* UploadContextFx;
			const cdn = uploadContext.cdn.replace(/\/$/, "");
			const ownUploadUrl = `${cdn}/own-upload.jpg`;

			const ownUpload = yield* uploadCreateFx({
				userId: users.seller.id,
				url: ownUploadUrl,
			});
			const foreignUpload = yield* uploadCreateFx({
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

			const foreign = yield* Effect.either(
				uploadFetchFx({
					where: {
						id: foreignUpload.id,
					},
					scope: {
						userId: users.seller.id,
					},
				}),
			);
			expectErrorFx(foreign);

			const missing = yield* Effect.either(
				uploadFetchFx({
					where: {
						id: "missing-upload-id",
					},
					scope: {
						userId: users.seller.id,
					},
				}),
			);
			expectErrorFx(missing);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
