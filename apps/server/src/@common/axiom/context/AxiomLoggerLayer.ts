import { Effect, HashMap, List, Logger, type LogSpan } from "effect";
import { AxiomContextFx } from "~/@common/axiom/context/AxiomContextFx";
import { axiomClientFx } from "~/@common/axiom/fx/axiomClientFx";

const annotationsToObject = (hm: HashMap.HashMap<string, unknown>) =>
	Object.fromEntries(HashMap.toEntries(hm));

const toSpans = (spans: List.List<LogSpan.LogSpan>) => {
	return List.toArray(spans)
		.map((s) => ({
			label: s.label,
			time: Date.now() - s.startTime,
		}))
		.reverse();
};

export const AxiomLoggerLayer = Logger.replaceScoped(
	Logger.defaultLogger,
	Effect.gen(function* () {
		const { dataset } = yield* AxiomContextFx;
		const client = yield* axiomClientFx();

		return Logger.make(async (log) => {
			const event = {
				_time: log.date.toISOString(),
				level: log.logLevel.label,
				msg: log.message,
				spans: toSpans(log.spans),
				...annotationsToObject(log.annotations),
			};

			client.ingest(dataset, [
				event,
			]);

			await client.flush().catch(() => undefined);
		});
	}),
);
