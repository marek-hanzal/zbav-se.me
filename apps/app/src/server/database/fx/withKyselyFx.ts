import { Effect } from "effect";
import { type KyselyContext, KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export const withKyselyFx =
	(kysely: KyselyContext) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(Effect.provideService(KyselyContextFx, kysely));
