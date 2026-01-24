import { Layer } from "effect";
import { type UploadContext, UploadContextFx } from "~/@user/upload/context/UploadContextFx";

export const UploadContextLayer = (context: UploadContext) => {
	return Layer.succeed(UploadContextFx, context);
};
