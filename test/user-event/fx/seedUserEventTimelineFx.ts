import { Effect } from "effect";
import type { DateTime } from "luxon";
import { genId } from "@/lib/common/gen-id";
import { keyOf } from "@/lib/common/key-of";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import type { userEventCreateFx } from "~/user/user-event/server/fx/userEventCreateFx";

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
	const { kysely } = yield* KyselyContextFx;

	yield* tryDbFx(async () =>
		kysely
			.insertInto("user_event")
			.values(
				events.map((entry) => ({
					id: genId(),
					userId,
					group: keyOf(entry.group),
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
