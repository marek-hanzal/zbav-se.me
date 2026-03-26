import { Effect } from "effect";
import { type UploadContext, UploadContextFx } from "./UploadContextFx";

export function withUploadFx(context: UploadContext) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(UploadContextFx, context));
	};
}
