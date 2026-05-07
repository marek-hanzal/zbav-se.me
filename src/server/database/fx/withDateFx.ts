import { Effect } from "effect";
import { createDateContext, DateContextFx } from "@/lib/common/date";

export function withDateFx<A, E, R>(eff: Effect.Effect<A, E, R>) {
	return eff.pipe(Effect.provideService(DateContextFx, createDateContext()));
}
