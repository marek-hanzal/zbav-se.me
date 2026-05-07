import type { Logger } from "@logtape/logtape";
import { Effect } from "effect";
import { LoggerContextFx } from "./LoggerContextFx";

export function withLoggerFx(context: Logger) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(Effect.provideService(LoggerContextFx, context));
	};
}
