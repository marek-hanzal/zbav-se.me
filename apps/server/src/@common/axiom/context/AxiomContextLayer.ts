import { Layer } from "effect";
import { type AxiomContext, AxiomContextFx } from "~/@common/axiom/context/AxiomContextFx";

export const AxiomContextLayer = (context: AxiomContext) => {
	return Layer.succeed(AxiomContextFx, context);
};
