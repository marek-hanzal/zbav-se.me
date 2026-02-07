import { Effect } from "effect";
import type { UploadContext } from "~/@common/upload/context/UploadContextFx";
import { UploadContextLayer } from "~/@common/upload/context/UploadContextLayer";

export const withUploadFx =
	(context: UploadContext) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(Effect.provide(UploadContextLayer(context)));
