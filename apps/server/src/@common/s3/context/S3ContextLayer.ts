import { Layer } from "effect";
import { type S3Context, S3ContextFx } from "~/@common/s3/context/S3ContextFx";

export const S3ContextLayer = (context: S3Context) => {
	return Layer.succeed(S3ContextFx, context);
};
