import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { AxiomContextFx } from "~/@common/axiom/context/AxiomContextFx";

export const withTestAxiomFx = <A, E, R>(eff: Effect.Effect<A, E, R>) =>
	eff.pipe(
		Effect.provideService(AxiomContextFx, {
			dataset: "test",
			root: "test",
			traceId: genId(),
			token: "<nope>",
		}),
	);
