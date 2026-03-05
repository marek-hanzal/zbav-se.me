import { Effect, HashMap, Logger } from "effect";
import { AxiomContextFx } from "~/@common/axiom/context/AxiomContextFx";
import { axiomClientFx } from "~/@common/axiom/fx/axiomClientFx";

const annotationsToObject = (hm: HashMap.HashMap<string, unknown>) =>
	Object.fromEntries(HashMap.toEntries(hm));

export const AxiomLoggerLayer = Logger.replaceScoped(
	Logger.defaultLogger,
	Effect.gen(function* () {
		const { dataset, root, traceId } = yield* AxiomContextFx;
		const client = yield* Effect.acquireRelease(axiomClientFx(), (client) => {
			return Effect.promise(() => client.flush()).pipe(Effect.catchAll(() => Effect.void));
		});

		return Logger.make(async (log) => {
			const event = {
				_time: log.date.toISOString(),
				level: log.logLevel.label,
				msg: Array.isArray(log.message) ? log.message.join(", ") : log.message,
				root,
				traceId,
				...annotationsToObject(log.annotations),
			};

			client.ingest(dataset, [
				event,
			]);
		});
	}),
);
