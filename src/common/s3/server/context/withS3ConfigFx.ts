import { Effect } from "effect";
import { type s3Config, s3ConfigFx } from "./s3ConfigFx";

export function withS3ConfigFx(config: s3Config) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(s3ConfigFx, config));
	};
}
