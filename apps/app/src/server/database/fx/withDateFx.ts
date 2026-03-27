import { createDateContext, DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";

export function withDateFx<A, E, R>(eff: Effect.Effect<A, E, R>) {
	return eff.pipe(Effect.provideService(DateContextFx, createDateContext()));
}
