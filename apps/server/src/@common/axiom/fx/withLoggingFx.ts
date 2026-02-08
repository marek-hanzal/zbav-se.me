import { Effect, Logger, LogLevel } from "effect";
import { AxiomContextLayer } from "~/@common/axiom/context/AxiomContextLayer";
import { AxiomLoggerLayer } from "~/@common/axiom/context/AxiomLoggerLayer";
import type { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";

export const withLoggingFx =
	(cfg: ServerAxiomSchema.Type, name: string) =>
	<A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			Effect.tap(() => Effect.log(name)),
			Effect.tapError((e) => {
				return Effect.gen(function* () {
					yield* Effect.annotateLogsScoped({
						$catch: e,
					});

					return yield* Effect.logError(name);
				});
			}),
			Effect.tapDefect((e) => {
				return Effect.gen(function* () {
					yield* Effect.annotateLogsScoped({
						$fatal: e,
					});

					return yield* Effect.logFatal(name);
				});
			}),
			//
			Effect.withLogSpan("runtime"),
			Effect.provide(AxiomLoggerLayer),
			Effect.provide(
				AxiomContextLayer({
					token: cfg.SERVER_AXIOM_TOKEN,
					dataset: cfg.SERVER_AXIOM_DATASET,
				}),
			),
			Effect.provide(Logger.minimumLogLevel(LogLevel.Info)),
			Effect.scoped,
		);
