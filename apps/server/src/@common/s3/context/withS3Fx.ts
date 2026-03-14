import { Effect } from "effect";
import { type S3Context, S3ContextFx } from "~/@common/s3/context/S3ContextFx";

export const withS3Fx =
	(context: S3Context) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(Effect.provideService(S3ContextFx, context));
