import { Effect } from "effect";
import type { Dialect } from "kysely";
import { DialectContextFx } from "~/database-query/service/DialectContextFx";

export function withDialectFn(dialect: Dialect) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(DialectContextFx, dialect));
	};
}
