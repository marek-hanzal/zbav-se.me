import { Effect, HashMap, List, Logger, type LogSpan } from "effect";
import { AxiomContextFx } from "~/@common/axiom/context/AxiomContextFx";
import { axiomClientFx } from "~/@common/axiom/fx/axiomClientFx";

const annotationsToObject = (hm: HashMap.HashMap<string, unknown>) =>
	Object.fromEntries(HashMap.toEntries(hm));

const toSpans = (spans: List.List<LogSpan.LogSpan>) => {
	return List.toArray(spans).reduce<Record<string, number>>((acc, value) => {
		acc[value.label] = Date.now() - value.startTime;
		return acc;
	}, {});
};

export const AxiomLoggerLayer = Logger.replaceScoped(
	Logger.defaultLogger,
	Effect.gen(function* () {
		const { dataset, root, traceId } = yield* AxiomContextFx;
		const client = yield* axiomClientFx();

		return Logger.make(async (log) => {
			const event = {
				_time: log.date.toISOString(),
				level: log.logLevel.label,
				msg: Array.isArray(log.message) ? log.message.join(", ") : log.message,
				spans: toSpans(log.spans),
				root,
				traceId,
				...annotationsToObject(log.annotations),
			};

			client.ingest(dataset, [
				event,
			]);

			await client.flush().catch(() => undefined);
		});
	}),
);
