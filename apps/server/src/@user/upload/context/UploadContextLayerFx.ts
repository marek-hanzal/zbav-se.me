import { type Effect, Layer } from "effect";
import { type UploadContext, UploadContextFx } from "~/@user/upload/context/UploadContextFx";

export const UploadContextLayerFx = <E, R>(contextFx: Effect.Effect<UploadContext, E, R>) => {
	return Layer.effect(UploadContextFx, contextFx);
};
