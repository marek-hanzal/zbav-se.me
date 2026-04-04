import { Effect } from "effect";
import type { Dialect } from "kysely";
import { DialectContextFx } from "./DialectContextFx";

export function withDialectFx(dialect: Dialect) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(DialectContextFx, dialect));
	};
}
