import { ViteEnvSchema } from "~/application-env/schema/ViteEnvSchema";
import type { UploadConfig } from "~/user-upload/context/UploadConfigFx";

export const withUploadConfigEnv = (): UploadConfig => {
	const { VITE_CONTENT_CDN } = ViteEnvSchema.parse(process.env);

	return {
		cdn: VITE_CONTENT_CDN,
	};
};
