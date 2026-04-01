import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { auth } from "~/server/auth/auth";
import { testabase } from "~/test/testabase";
import { withRuntimeFx } from "~/test/utils/withRuntimeFx";
import { uploadCreateFx } from "~/user/upload/server/fx/uploadCreateFx";

describe("uploadCreateFx", () => {
	it("rejects non-CDN URLs and persists CDN uploads", async () => {
		const database = await testabase("uploadCreateFx-cdn-gate");
		const { api } = auth(() => database.dialect);

		return Effect.gen(function* () {
			const { user } = yield* Effect.promise(() =>
				api.signUpEmail({
					body: {
						email: "upload-create-user@test.cz",
						name: "Upload Create User",
						password: "12345678",
					},
				}),
			);

			const invalid = yield* Effect.either(
				uploadCreateFx({
					userId: user.id,
					url: "https://evil.example.com/file.jpg",
				}),
			);

			expect(invalid._tag).toBe("Left");

			const upload = yield* uploadCreateFx({
				userId: user.id,
				url: "https://cdn.zbav-se.me/upload-create-valid.jpg",
			});

			expect(upload.url).toBe("https://cdn.zbav-se.me/upload-create-valid.jpg");

			const storedUpload = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("upload")
					.select([
						"id",
						"userId",
						"url",
					])
					.where("id", "=", upload.id)
					.executeTakeFirstOrThrow(),
			);

			expect(storedUpload).toEqual({
				id: upload.id,
				userId: user.id,
				url: "https://cdn.zbav-se.me/upload-create-valid.jpg",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
