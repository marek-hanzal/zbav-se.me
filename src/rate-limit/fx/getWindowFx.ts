import { Effect } from "effect";
import type { DateTime } from "luxon";

export namespace getWindowFx {
	export interface Props {
		now: DateTime;
		seconds: number;
	}
}

export const getWindowFx = Effect.fn("getWindowFx")(function* ({
	now,
	seconds,
}: getWindowFx.Props) {
	return yield* Effect.succeed(
		now
			.minus({
				seconds: Math.floor(now.toSeconds()) % seconds,
			})
			.startOf("second"),
	);
});

export type getWindowFx = ReturnType<typeof getWindowFx>;
