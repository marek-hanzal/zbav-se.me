import { Layer } from "effect";
import { type UploadContext, UploadContextFx } from "~/@common/upload/context/UploadContextFx";

export const UploadContextLayer = (context: UploadContext) => {
	return Layer.succeed(UploadContextFx, context);
};
