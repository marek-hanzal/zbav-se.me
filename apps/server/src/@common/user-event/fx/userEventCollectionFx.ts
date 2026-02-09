import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withUserEventCollectionSelectFx } from "~/@common/user-event/db/withUserEventCollectionSelectFx";
import { withUserEventQueryBuilderFx } from "~/@common/user-event/db/withUserEventQueryBuilderFx";
import type { UserEventFilterSchema } from "~/@common/user-event/schema/UserEventFilterSchema";
import type { UserEventQuerySchema } from "~/@common/user-event/schema/UserEventQuerySchema";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace userEventCollectionFx {
	export interface Props extends UserEventQuerySchema.Type {
		scope: UserEventFilterSchema.Type;
	}
}

export const userEventCollectionFx = Effect.fn("userEventCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor,
	sort,
}: userEventCollectionFx.Props) {
	yield* withTraceFx({
		fx: "userEventCollectionFx",
		input: {
			filter,
			where,
			scope,
			cursor,
			sort,
		},
	});

	return yield* withCollectionFx({
		selectFx: withUserEventCollectionSelectFx({
			sort,
		}),
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		scope,
		queryFx: withUserEventQueryBuilderFx,
	});
});

export type userEventCollectionFx = ReturnType<typeof userEventCollectionFx>;
