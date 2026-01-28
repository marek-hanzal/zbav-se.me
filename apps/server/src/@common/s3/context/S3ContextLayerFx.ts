import { type Effect, Layer } from "effect";
import { type S3Context, S3ContextFx } from "~/@common/s3/context/S3ContextFx";

export const S3ContextLayerFx = <E, R>(s3ContextFx: Effect.Effect<S3Context, E, R>) => {
	return Layer.effect(S3ContextFx, s3ContextFx);
};
