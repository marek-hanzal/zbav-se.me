import { Context } from "effect";

export interface UploadConfig {
	/**
	 * CDN base URL for uploads
	 */
	cdn: string;
}

export class UploadConfigFx extends Context.Tag("UploadConfigFx")<
	UploadConfigFx,
	UploadConfig
>() {
	//
}
