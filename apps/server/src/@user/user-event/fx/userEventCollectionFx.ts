import { withCollectionFx } from "@use-pico/common/collection";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withUserEventCollectionSelectFx } from "~/app/user-event/db/withUserEventCollectionSelectFx";
import { withUserEventQueryBuilderFx } from "~/app/user-event/db/withUserEventQueryBuilderFx";
import type { UserEventFilterSchema } from "~/app/user-event/schema/UserEventFilterSchema";
import type { UserEventQuerySchema } from "~/app/user-event/schema/UserEventQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
export namespace userEventCollectionFx {
	export interface Props extends UserEventQuerySchema.Type {
		scope?: UserEventFilterSchema.Type;
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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<userEventCollectionFx>, UserContextFx>>;
