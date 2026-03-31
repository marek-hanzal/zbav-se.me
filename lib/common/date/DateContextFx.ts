import { Context } from "effect";
import type { DateTime } from "luxon";

export interface DateContext {
	now(): DateTime;
}

export class DateContextFx extends Context.Tag("DateContextFx")<DateContextFx, DateContext>() {
	//
}
