import { Effect } from "effect";
import { type S3Context, S3ContextFx } from "~/server/@common/s3/context/S3ContextFx";

export function withS3Fx(context: S3Context) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(S3ContextFx, context));
	};
}
