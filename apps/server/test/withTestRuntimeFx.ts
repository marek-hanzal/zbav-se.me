import type { Effect } from "effect";

export const withTestRuntimeFx = <A, E, R>(eff: Effect.Effect<A, E, R>) => eff;
