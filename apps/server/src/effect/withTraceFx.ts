import { Effect, HashMap, Option } from "effect";

export const withTraceFx = (item: unknown) =>
	Effect.gen(function* () {
		const annotations = yield* Effect.logAnnotations;

		const prev = HashMap.get(annotations, "$trace").pipe(
			Option.getOrElse(() => []),
		) as unknown[];

		yield* Effect.annotateLogsScoped("$trace", [
			...prev,
			item,
		]);
	});
