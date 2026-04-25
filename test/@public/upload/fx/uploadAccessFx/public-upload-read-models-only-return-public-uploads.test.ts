import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { uploadCollectionFx } from "~/public/upload/server/fx/uploadCollectionFx";
import { uploadFetchFx } from "~/public/upload/server/fx/uploadFetchFx";
import { testUploadUrl } from "~/test/common/fn/testUploadUrl";
import { expectErrorFx } from "~/test/common/fx/expectErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("public upload access", () => {
	it("returns public uploads and rejects private uploads", async () => {
		const database = await testabase("public-upload-access");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});

			const publicUpload = yield* uploadCreateFx({
				access: "public",
				userId: user.id,
				url: testUploadUrl("public-upload.jpg"),
			});
			const privateUpload = yield* uploadCreateFx({
				access: "private",
				userId: user.id,
				url: testUploadUrl("private-upload.jpg"),
			});
			const protectedUpload = yield* uploadCreateFx({
				access: "protected",
				userId: user.id,
				url: testUploadUrl("protected-upload.jpg"),
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
			const privateFetch = yield* Effect.either(
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
			expectErrorFx(privateFetch);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
