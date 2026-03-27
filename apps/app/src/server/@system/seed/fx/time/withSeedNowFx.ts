import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import type { DateTime } from "luxon";

export function withSeedNowFx(now: DateTime) {
	return <A, E, R>(effect: Effect.Effect<A, E, R>) => {
		return effect.pipe(
			Effect.provideService(DateContextFx, {
				now: () => now,
			}),
		);
	};
}
