import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import type { DateTime } from "luxon";

export const withSeedNowFx =
	(now: DateTime) =>
	<A, E, R>(effect: Effect.Effect<A, E, R>) =>
		effect.pipe(
			Effect.provideService(DateContextFx, {
				now: () => now,
			}),
		);
