import { Effect } from "effect";
import { match } from "ts-pattern";
import { AxiomContextFx } from "~/@common/axiom/context/AxiomContextFx";

export namespace traceLogFx {
	export type Level = "debug" | "error" | "info" | "trace" | "warning";

	export type Props = {
		level: Level;
		message: string;
	} & Record<string, unknown>;
}

export const traceLogFx = Effect.fn("traceLogFx")(function* (props: traceLogFx.Props) {
	const axiom = yield* AxiomContextFx;
	const { level, message, ...context } = props;

	yield* Effect.annotateLogsScoped({
		root: axiom.root,
		traceId: axiom.traceId,
		...context,
	});

	yield* match(level)
		.with("debug", () => Effect.logDebug(message))
		.with("info", () => Effect.logInfo(message))
		.with("warning", () => Effect.logWarning(message))
		.with("error", () => Effect.logError(message))
		.otherwise(() => Effect.log(message));
});
