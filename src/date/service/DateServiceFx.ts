import { Context } from "effect";
import type { DateTime } from "luxon";

export interface DateService {
	nowFn(): DateTime;
	ofSecondsFn(seconds: number): DateTime;
}

export class DateServiceFx extends Context.Service<DateServiceFx, DateService>()("DateServiceFx") {
	//
}
