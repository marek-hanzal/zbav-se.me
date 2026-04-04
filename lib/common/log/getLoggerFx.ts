import { Effect } from "effect";
import { LoggerContextFx } from "./LoggerContextFx";

export const getLoggerFx = Effect.fn("getLoggerFx")(function* (name: string) {
	return (yield* LoggerContextFx).getChild(name);
});
