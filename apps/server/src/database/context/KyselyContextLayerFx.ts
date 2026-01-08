import { type Effect, Layer } from "effect";
import { type KyselyContext, KyselyContextFx } from "~/database/context/KyselyContextFx";

export const KyselyContextLayerFx = <E, R>(databaseFx: Effect.Effect<KyselyContext, E, R>) => {
	return Layer.effect(KyselyContextFx, databaseFx);
};
