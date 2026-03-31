import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { withUserEventCollectionSelectFx } from "../db/withUserEventCollectionSelectFx";
import { withUserEventQueryBuilderFx } from "../db/withUserEventQueryBuilderFx";
import type { UserEventFilterSchema } from "../schema/UserEventFilterSchema";
import type { UserEventQuerySchema } from "../schema/UserEventQuerySchema";

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
