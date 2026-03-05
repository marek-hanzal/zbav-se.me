import { Effect } from "effect";
import { AxiomContextFx } from "~/@common/axiom/context/AxiomContextFx";

export const withTraceFx = (item: unknown) =>
	Effect.gen(function* () {
		const axiom = yield* AxiomContextFx;

		yield* Effect.log("trace").pipe(
			Effect.annotateLogsScoped({
				root: axiom.root,
				trace: item,
				traceId: axiom.traceId,
			}),
		);
	});
