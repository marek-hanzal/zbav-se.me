import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withUserEventCollectionSelectFx } from "~/app/user-event/db/withUserEventCollectionSelectFx";
import { withUserEventQueryBuilderFx } from "~/app/user-event/db/withUserEventQueryBuilderFx";
import { UserEventDbSchema } from "~/app/user-event/schema/UserEventDbSchema";
import type { UserEventQuerySchema } from "~/app/user-event/schema/UserEventQuerySchema";
export namespace userEventCollectionFx {
	export type Props = UserEventQuerySchema.Type;
}

export const userEventCollectionFx = Effect.fn("userEventCollectionFx")(function* ({
	filter,
	where,
	cursor,
	sort,
}: userEventCollectionFx.Props) {
	return yield* withCollectionFx({
		select: yield* withUserEventCollectionSelectFx({
			sort,
		}),
		output: UserEventDbSchema,
		cursor: cursor ?? {
			page: 0,
			size: 10,
		},
		filter,
		where,
		queryFx: withUserEventQueryBuilderFx,
	});
});

export type userEventCollectionFx = ReturnType<typeof userEventCollectionFx>;
