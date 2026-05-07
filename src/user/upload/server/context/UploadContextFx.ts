import { Context } from "effect";

export interface UploadContext {
	/**
	 * CDN base URL for uploads
	 */
	cdn: string;
}

export class UploadContextFx extends Context.Tag("UploadContextFx")<
	UploadContextFx,
	UploadContext
>() {
	//
}
