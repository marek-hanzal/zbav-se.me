import { Effect } from "effect";
import type { DateTime } from "luxon";
import { dbFx } from "~/database/fx/dbFx";
import { keyOfFn } from "~/hash/fn/keyOfFn";
import { genIdFn } from "~/identity/fn/genIdFn";
import type { userEventCreateFx } from "~/user-event/fx/userEventCreateFx";

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
	yield* dbFx(async (kysely) =>
		kysely
			.insertInto("user_event")
			.values(
				events.map((entry) => ({
					id: genIdFn(),
					userId,
					group: keyOfFn(entry.group),
					scope: entry.scope,
					source: entry.source,
					event: entry.event,
					isTerminal: entry.isTerminal,
					createdAt: entry.at.toJSDate(),
				})),
			)
			.execute(),
	);
});
