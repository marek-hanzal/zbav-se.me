import { createDateContext, DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";

export const withDateFx = <A, E, R>(eff: Effect.Effect<A, E, R>) =>
	eff.pipe(Effect.provideService(DateContextFx, createDateContext()));
