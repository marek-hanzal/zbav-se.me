import { type Effect, Layer } from "effect";
import { type DateContext, DateContextFx } from "./DateContextFx";

export const DateContextLayerFx = <E, R>(dateFx: Effect.Effect<DateContext, E, R>) => {
	return Layer.effect(DateContextFx, dateFx);
};
