import { type Effect, Layer } from "effect";
import { type RoutesContext, RoutesContextFx } from "~/app/routes/RoutesContextFx";

export const RoutesContextLayerFx = <E, R>(routesContextFx: Effect.Effect<RoutesContext, E, R>) => {
	return Layer.effect(RoutesContextFx, routesContextFx);
};
