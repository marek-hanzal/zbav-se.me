import { Effect } from "effect";
import { type DialectContext, DialectContextFx } from "./DialectContextFx";

export function withDialectFx(dialect: DialectContext) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(DialectContextFx, dialect));
	};
}
