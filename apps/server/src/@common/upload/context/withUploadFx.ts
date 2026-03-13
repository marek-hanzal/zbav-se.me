import { Effect } from "effect";
import { type UploadContext, UploadContextFx } from "~/@common/upload/context/UploadContextFx";

export const withUploadFx =
	(context: UploadContext) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(Effect.provideService(UploadContextFx, context));
