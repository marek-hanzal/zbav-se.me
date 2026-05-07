import type { Logger } from "@logtape/logtape";
import { Context } from "effect";

export class LoggerContextFx extends Context.Tag("LoggerContextFx")<LoggerContextFx, Logger>() {
	//
}
