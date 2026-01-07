import { Context, Effect } from "effect";

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

export const UploadContextProvider = (context: UploadContext) => {
	return Effect.provideService(UploadContextFx, context);
};
