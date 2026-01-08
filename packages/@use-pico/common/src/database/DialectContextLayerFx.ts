import { type Effect, Layer } from "effect";
import { type DialectContext, DialectContextFx } from "./DialectContextFx";

export const DialectContextLayerFx = <E, R>(dialectFx: Effect.Effect<DialectContext, E, R>) => {
	return Layer.effect(DialectContextFx, dialectFx);
};
