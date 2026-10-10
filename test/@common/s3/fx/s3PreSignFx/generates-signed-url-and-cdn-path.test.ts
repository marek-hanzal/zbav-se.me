import { getLogger } from "@logtape/logtape";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ViteEnvSchema } from "~/application-env/schema/ViteEnvSchema";
import { keyOf } from "~/hash/fn/keyOf";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withS3ConfigFx } from "~/s3/context/withS3ConfigFx";
import { s3PreSignFx } from "~/s3/fx/s3PreSignFx";
import { withS3ConfigEnv } from "~/s3/schema/withS3ConfigEnv";
import { ServerS3Schema } from "~/server-env/schema/ServerS3Schema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { withUploadConfigFx } from "~/user-upload/context/withUploadConfigFx";
import { withUploadConfigEnv } from "~/user-upload/schema/withUploadConfigEnv";

describe("s3PreSignFx", () => {
	it("generates signed url and CDN path using real S3 config", async () => {
		const database = await testabase("se-pre-sign");

		const s3Config = ServerS3Schema.parse(process.env);
		const viteConfig = ViteEnvSchema.parse(process.env);
		const logger = getLogger("zbav-se.me");

		const result = await s3PreSignFx({
			userId: "user-for-s3",
			path: "listing/gallery",
			extension: "jpg",
		}).pipe(
			withS3ConfigFx(withS3ConfigEnv()),
			withUploadConfigFx(withUploadConfigEnv()),
			withLoggerFx(logger),
			withRuntimeFx(database),
			Effect.runPromise,
		);

		expect(result.url).toContain(s3Config.SERVER_S3_API);
		expect(result.url).toContain("X-Amz-Algorithm");
		expect(result.cdn).toContain(viteConfig.VITE_CONTENT_CDN);
		expect(result.cdn).toContain(`/${keyOf("user-for-s3")}/listing/gallery/`);
		expect(result.cdn.endsWith(".jpg")).toBe(true);
	});
});
