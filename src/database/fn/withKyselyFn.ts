import { Effect } from "effect";
import { type KyselyContext, KyselyContextFx } from "~/database/context/KyselyContextFx";

export function withKyselyFn(kysely: KyselyContext) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(KyselyContextFx, kysely));
	};
}
