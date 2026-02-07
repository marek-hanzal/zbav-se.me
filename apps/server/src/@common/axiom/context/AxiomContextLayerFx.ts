import { type Effect, Layer } from "effect";
import { type AxiomContext, AxiomContextFx } from "~/@common/axiom/context/AxiomContextFx";

export const AxiomContextLayerFx = <E, R>(axiomContextFx: Effect.Effect<AxiomContext, E, R>) => {
	return Layer.effect(AxiomContextFx, axiomContextFx);
};
