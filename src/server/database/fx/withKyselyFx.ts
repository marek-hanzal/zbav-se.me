import { Effect } from "effect";
import { type KyselyContext, KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export function withKyselyFx(kysely: KyselyContext) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(KyselyContextFx, kysely));
	};
}
