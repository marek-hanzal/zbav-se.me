import { getLogger } from "@logtape/logtape";
import { Effect } from "effect";
import { describe, expect, it, onTestFinished } from "vitest";
import { keyOfFn } from "~/hash/fn/keyOfFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withS3ConfigFn } from "~/s3/fn/withS3ConfigFn";
import { s3ClientFx } from "~/s3/fx/s3ClientFx";
import { s3PreSignFx } from "~/s3/fx/s3PreSignFx";
import { withTestS3Fn } from "~/test/common/fn/withTestS3Fn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { withUploadConfigFn } from "~/user-upload/fn/withUploadConfigFn";

describe("s3PreSignFx", () => {
	it("uploads through a signed URL to local S3 and generates the CDN path", async () => {
		const { config, cleanupFn } = await withTestS3Fn();
		onTestFinished(cleanupFn);
		const database = await testabaseFn("se-pre-sign");
		const cdn = "https://cdn.example.test";
		const logger = getLogger("zbav-se.me");

		const result = await s3PreSignFx({
			userId: "user-for-s3",
			path: "listing/gallery",
			extension: "jpg",
		}).pipe(
			withS3ConfigFn(config),
			withUploadConfigFn({
				cdn,
			}),
			withLoggerFn(logger),
			withRuntimeFn(database),
			Effect.runPromise,
		);

		expect(result.url).toContain(config.api);
		expect(result.url).toContain("X-Amz-Algorithm");
		expect(result.cdn).toContain(cdn);
		expect(result.cdn).toContain(`/${keyOfFn("user-for-s3")}/listing/gallery/`);
		expect(result.cdn.endsWith(".jpg")).toBe(true);

		const body = "local S3 integration upload";
		const response = await fetch(result.url, {
			method: "PUT",
			body,
		});
		expect(response.status).toBe(200);
		const client = await s3ClientFx().pipe(
			withS3ConfigFn(config),
			withLoggerFn(logger),
			Effect.runPromise,
		);
		const key = new URL(result.url).pathname.slice(`/${config.bucket}/`.length);
		expect(result.cdn).toBe(`${cdn}/${key}`);
		const stored = await client.getObject(config.bucket, key);
		const chunks: Buffer[] = [];
		for await (const chunk of stored) chunks.push(chunk);
		expect(Buffer.concat(chunks).toString()).toBe(body);

		const invalid = new URL(result.url);
		invalid.searchParams.set("X-Amz-Signature", "0".repeat(64));
		const rejected = await fetch(invalid, {
			method: "PUT",
			body: "invalid signature",
		});
		expect(rejected.status).toBe(403);
		await client.removeObject(config.bucket, key);
		await expect(client.statObject(config.bucket, key)).rejects.toMatchObject({
			code: "NotFound",
		});
	}, 60_000);
});
