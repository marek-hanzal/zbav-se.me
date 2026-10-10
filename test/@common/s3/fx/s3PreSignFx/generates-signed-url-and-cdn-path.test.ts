import { getLogger } from "@logtape/logtape";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { ViteEnvSchema } from "~/application-env/schema/ViteEnvSchema";
import { keyOfFn } from "~/hash/fn/keyOfFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withS3ConfigEnvFn } from "~/s3/fn/withS3ConfigEnvFn";
import { withS3ConfigFn } from "~/s3/fn/withS3ConfigFn";
import { s3PreSignFx } from "~/s3/fx/s3PreSignFx";
import { ServerS3Schema } from "~/server-env/schema/ServerS3Schema";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { withUploadConfigEnvFn } from "~/user-upload/fn/withUploadConfigEnvFn";
import { withUploadConfigFn } from "~/user-upload/fn/withUploadConfigFn";

describe("s3PreSignFx", () => {
	it("generates signed url and CDN path using real S3 config", async () => {
		const database = await testabaseFn("se-pre-sign");

		const s3Config = ServerS3Schema.parse(process.env);
		const viteConfig = ViteEnvSchema.parse(process.env);
		const logger = getLogger("zbav-se.me");

		const result = await s3PreSignFx({
			userId: "user-for-s3",
			path: "listing/gallery",
			extension: "jpg",
		}).pipe(
			withS3ConfigFn(withS3ConfigEnvFn()),
			withUploadConfigFn(withUploadConfigEnvFn()),
			withLoggerFn(logger),
			withRuntimeFn(database),
			Effect.runPromise,
		);

		expect(result.url).toContain(s3Config.SERVER_S3_API);
		expect(result.url).toContain("X-Amz-Algorithm");
		expect(result.cdn).toContain(viteConfig.VITE_CONTENT_CDN);
		expect(result.cdn).toContain(`/${keyOfFn("user-for-s3")}/listing/gallery/`);
		expect(result.cdn.endsWith(".jpg")).toBe(true);
	});
});
