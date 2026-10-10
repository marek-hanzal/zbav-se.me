import { getLogger } from "@logtape/logtape";
import { Effect } from "effect";
import { expect, it, vi } from "vitest";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withS3ConfigFn } from "~/s3/fn/withS3ConfigFn";
import { s3ClientFx } from "~/s3/fx/s3ClientFx";

it.each([
	[
		"de-s3.storage.bunnycdn.com",
		"https://de-s3.storage.bunnycdn.com",
	],
	[
		"https://storage.example.test:9443",
		"https://storage.example.test:9443",
	],
	[
		"http://127.0.0.1:18333",
		"http://127.0.0.1:18333",
	],
])("preserves the protocol and port when signing for %s", async (api, origin) => {
	const client = await s3ClientFx().pipe(
		withS3ConfigFn({
			api,
			bucket: "uploads",
			key: "test-access",
			secret: "test-secret",
		}),
		withLoggerFn(getLogger("zbav-se.me")),
		Effect.runPromise,
	);
	// Region discovery is the only network operation needed to sign a URL.
	vi.spyOn(client, "getBucketRegionAsync").mockResolvedValue("us-east-1");
	const url = new URL(await client.presignedPutObject("uploads", "image.jpg"));
	expect(url.origin).toBe(origin);
	expect(url.pathname).toBe("/uploads/image.jpg");
	expect(url.searchParams.get("X-Amz-Algorithm")).toBe("AWS4-HMAC-SHA256");
});
