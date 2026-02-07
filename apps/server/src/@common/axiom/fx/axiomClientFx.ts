import { Axiom } from "@axiomhq/js";
import { Effect } from "effect";
import { AxiomContextFx } from "~/@common/axiom/context/AxiomContextFx";

export const axiomClientFx = Effect.fn("axiomClientFx")(function* () {
	const { token } = yield* AxiomContextFx;
	return new Axiom({
		token,
	});
});

export type axiomClientFx = ReturnType<typeof axiomClientFx>;
