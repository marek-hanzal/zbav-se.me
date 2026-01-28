import { type Effect, Layer } from "effect";
import { type RoutesContext, RoutesContextFx } from "~/@common/route/context/RoutesContextFx";

export const RoutesContextLayerFx = <E, R>(routesContextFx: Effect.Effect<RoutesContext, E, R>) => {
	return Layer.effect(RoutesContextFx, routesContextFx);
};
