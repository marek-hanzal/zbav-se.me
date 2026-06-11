import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import type { UploadConfig } from "../context/UploadConfigFx";

export const withUploadConfigEnv = (): UploadConfig => {
	const { VITE_CONTENT_CDN } = ViteEnvSchema.parse(process.env);

	return {
		cdn: VITE_CONTENT_CDN,
	};
};
