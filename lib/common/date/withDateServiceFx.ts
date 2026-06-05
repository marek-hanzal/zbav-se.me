import { Effect } from "effect";
import { DateTime } from "luxon";
import { type DateService, DateServiceFx } from "./DateServiceFx";

export namespace withDateServiceFx {
	export interface Props extends Partial<DateService> {
		//
	}
}

export function withDateServiceFx(props?: withDateServiceFx.Props) {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) => {
		return eff.pipe(
			Effect.provideService(DateServiceFx, {
				now() {
					return DateTime.now();
				},
				ofSeconds(seconds: number) {
					return DateTime.fromSeconds(seconds, {
						zone: "utc",
					});
				},
				...props,
			}),
		);
	};
}
