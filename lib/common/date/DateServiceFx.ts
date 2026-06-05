import { Context } from "effect";
import type { DateTime } from "luxon";

export interface DateService {
	now(): DateTime;
	ofSeconds?(seconds: number): DateTime;
}

export class DateServiceFx extends Context.Tag("DateServiceFx")<DateServiceFx, DateService>() {
	//
}
