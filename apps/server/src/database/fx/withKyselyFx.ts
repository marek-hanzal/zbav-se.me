import { Effect } from "effect";
import type { KyselyContext } from "~/database/context/KyselyContextFx";
import { KyselyContextLayer } from "~/database/context/KyselyContextLayer";

export const withKyselyFx =
	(kysely: KyselyContext) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(Effect.provide(KyselyContextLayer(kysely)));
