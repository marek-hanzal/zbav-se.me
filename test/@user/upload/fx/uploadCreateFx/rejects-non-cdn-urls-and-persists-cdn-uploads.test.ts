import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { UploadContextFx } from "~/user/upload/server/context/UploadContextFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("uploadCreateFx", () => {
	it("rejects non-CDN URLs and persists CDN uploads", async () => {
		const database = await testabase("uploadCreateFx-cdn-gate");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const uploadContext = yield* UploadContextFx;
			const validUrl = `${uploadContext.cdn.replace(/\/$/, "")}/upload-create-valid.jpg`;

			const invalid = yield* Effect.either(
				uploadCreateFx({
					access: "private",
					userId: user.id,
					url: "https://evil.example.com/file.jpg",
				}),
			);

			expectTaggedErrorFx(invalid, {
				tag: "InvalidRequestErrorFx",
				message: "Only content from the CDN can be uploaded",
			});

			const invalidUpload = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("upload")
					.select("id")
					.where("url", "=", "https://evil.example.com/file.jpg")
					.execute(),
			);

			expect(invalidUpload).toHaveLength(0);

			const upload = yield* uploadCreateFx({
				access: "private",
				userId: user.id,
				url: validUrl,
			});

			expect(upload.url).toBe(validUrl);

			const storedUpload = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("upload")
					.select([
						"id",
						"userId",
						"url",
						"access",
					])
					.where("id", "=", upload.id)
					.executeTakeFirstOrThrow(),
			);

			expect(storedUpload).toEqual({
				id: upload.id,
				userId: user.id,
				url: validUrl,
				access: "private",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
