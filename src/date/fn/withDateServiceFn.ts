import { Effect } from "effect";
import { DateTime } from "luxon";
import { type DateService, DateServiceFx } from "~/date/service/DateServiceFx";

export namespace withDateServiceFn {
	export interface Props extends Partial<DateService> {
		//
	}
}

export function withDateServiceFn(props?: withDateServiceFn.Props) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(
			Effect.provideService(DateServiceFx, {
				nowFn() {
					return DateTime.now();
				},
				ofSecondsFn(seconds: number) {
					return DateTime.fromSeconds(seconds, {
						zone: "utc",
					});
				},
				...props,
			}),
		);
	};
}
