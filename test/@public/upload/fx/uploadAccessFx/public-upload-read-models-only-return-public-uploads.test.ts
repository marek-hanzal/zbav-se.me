import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { uploadCollectionFx } from "~/public-upload/fx/uploadCollectionFx";
import { uploadFetchFx } from "~/public-upload/fx/uploadFetchFx";
import { testUploadUrlFn } from "~/test/common/fn/testUploadUrlFn";
import { expectErrorFn } from "~/test/common/fx/expectErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { uploadCreateFx } from "~/user-upload/fx/uploadCreateFx";

describe("public upload access", () => {
	it("returns public uploads and rejects private uploads", async () => {
		const database = await testabaseFn("public-upload-access");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			const publicUpload = yield* uploadCreateFx({
				access: "public",
				userId: user.id,
				url: testUploadUrlFn("public-upload.jpg"),
			});
			const privateUpload = yield* uploadCreateFx({
				access: "private",
				userId: user.id,
				url: testUploadUrlFn("private-upload.jpg"),
			});
			const protectedUpload = yield* uploadCreateFx({
				access: "protected",
				userId: user.id,
				url: testUploadUrlFn("protected-upload.jpg"),
			});

			const fetched = yield* uploadFetchFx({
				where: {
					id: publicUpload.id,
				},
				scope: {},
			});
			const collection = yield* uploadCollectionFx({
				scope: {},
			});
			const privateFetch = yield* Effect.result(
				uploadFetchFx({
					where: {
						id: privateUpload.id,
					},
					scope: {},
				}),
			);

			expect(fetched.id).toBe(publicUpload.id);
			expect(collection.map((item) => item.id)).toContain(publicUpload.id);
			expect(collection.map((item) => item.id)).not.toContain(privateUpload.id);
			expect(collection.map((item) => item.id)).not.toContain(protectedUpload.id);
			expectErrorFn(privateFetch);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
