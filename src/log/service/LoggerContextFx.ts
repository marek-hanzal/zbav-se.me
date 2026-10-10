import type { Logger } from "@logtape/logtape";
import { Context } from "effect";

export class LoggerContextFx extends Context.Service<LoggerContextFx, Logger>()("LoggerContextFx") {
	//
}
