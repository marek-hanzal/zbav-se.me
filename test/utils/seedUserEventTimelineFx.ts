import { Effect } from "effect";
import type { DateTime } from "luxon";
import { DateContextFx } from "@/lib/common/date";
import { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

export namespace seedUserEventTimelineFx {
	export interface Event {
		at: DateTime;
		group: string;
		scope: userEventCreateFx.Props["scope"];
		source: userEventCreateFx.Props["source"];
		event: userEventCreateFx.Props["event"];
		isTerminal: boolean;
	}

	export interface Props {
		userId: string;
		events: Event[];
	}
}

export const seedUserEventTimelineFx = Effect.fn("seedUserEventTimelineFx")(function* ({
	userId,
	events,
}: seedUserEventTimelineFx.Props) {
	for (const entry of events) {
		yield* userEventCreateFx({
			userId,
			group: entry.group,
			scope: entry.scope,
			source: entry.source,
			event: entry.event,
			isTerminal: entry.isTerminal,
		}).pipe(
			Effect.provideService(DateContextFx, {
				now: () => entry.at,
			}),
		);
	}
});
