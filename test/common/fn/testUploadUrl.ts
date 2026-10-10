import { ViteEnvSchema } from "~/application-env/schema/ViteEnvSchema";

export const testUploadUrl = (path: string) => {
	const viteConfig = ViteEnvSchema.parse(process.env);
	const cdn = viteConfig.VITE_CONTENT_CDN.replace(/\/$/, "");
	const normalizedPath = path.replace(/^\//, "");

	return `${cdn}/${normalizedPath}`;
};
