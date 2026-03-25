import { Effect } from "effect";
import { type DialectContext, DialectContextFx } from "./DialectContextFx";

export const withDialectFx =
	(dialect: DialectContext) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(Effect.provideService(DialectContextFx, dialect));
