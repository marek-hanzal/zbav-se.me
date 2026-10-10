import { Effect } from "effect";
import { type UploadConfig, UploadConfigFx } from "~/user-upload/context/UploadConfigFx";

export function withUploadConfigFn(config: UploadConfig) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(UploadConfigFx, config));
	};
}
