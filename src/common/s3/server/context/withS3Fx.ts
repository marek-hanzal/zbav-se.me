import { Effect } from "effect";
import { type S3Context, S3ContextFx } from "~/common/s3/server/context/S3ContextFx";

export function withS3Fx(context: S3Context) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(S3ContextFx, context));
	};
}
