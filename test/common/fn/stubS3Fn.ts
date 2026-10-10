import { vi } from "vitest";
import type { s3Config } from "~/s3/context/s3ConfigFx";

export const stubS3Fn = () => {
	const config: s3Config = {
		api: "http://127.0.0.1:1",
		bucket: "test-uploads",
		key: "test-access",
		secret: "test-secret",
	};
	vi.stubEnv("SERVER_S3_API", config.api);
	vi.stubEnv("SERVER_S3_BUCKET", config.bucket);
	vi.stubEnv("SERVER_S3_KEY", config.key);
	vi.stubEnv("SERVER_S3_SECRET", config.secret);
	return config;
};
