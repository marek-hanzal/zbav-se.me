import { getLogger } from "@logtape/logtape";
import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { keyOf } from "@/lib/common/key-of";
import { withLoggerFx } from "@/lib/common/log";
import { withS3Fx } from "~/common/s3/server/context/withS3Fx";
import { s3PreSignFx } from "~/common/s3/server/fx/s3PreSignFx";
import { ServerS3Schema } from "~/server/env/ServerS3Schema";
import { ServerViteSchema } from "~/server/env/ServerViteSchema";
import { withUploadFx } from "~/user/upload/server/context/withUploadFx";

describe("s3PreSignFx", () => {
	it("generates signed url and CDN path using real S3 config", async () => {
		const s3Config = ServerS3Schema.parse(process.env);
		const viteConfig = ServerViteSchema.parse(process.env);
		const logger = getLogger("zbav-se.me");

		const result = await s3PreSignFx({
			userId: "user-for-s3",
			path: "listing/gallery",
			extension: "jpg",
		}).pipe(
			withS3Fx({
				api: s3Config.SERVER_S3_API,
				bucket: s3Config.SERVER_S3_BUCKET,
				key: s3Config.SERVER_S3_KEY,
				secret: s3Config.SERVER_S3_SECRET,
			}),
			withUploadFx({
				cdn: viteConfig.VITE_CONTENT_CDN,
			}),
			withLoggerFx(logger),
			Effect.runPromise,
		);

		expect(result.url).toContain(s3Config.SERVER_S3_API);
		expect(result.url).toContain("X-Amz-Algorithm");
		expect(result.cdn).toContain(viteConfig.VITE_CONTENT_CDN);
		expect(result.cdn).toContain(`/${keyOf("user-for-s3")}/listing/gallery/`);
		expect(result.cdn.endsWith(".jpg")).toBe(true);
	});
});
