import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withUserEventCollectionSelectFx } from "~/@user/user-event/db/withUserEventCollectionSelectFx";
import { withUserEventQueryBuilderFx } from "~/@user/user-event/db/withUserEventQueryBuilderFx";
import type { UserEventFilterSchema } from "~/@user/user-event/schema/UserEventFilterSchema";
import type { UserEventQuerySchema } from "~/@user/user-event/schema/UserEventQuerySchema";

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
