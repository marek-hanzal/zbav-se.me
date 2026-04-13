import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
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
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	sort,
}: userEventCollectionFx.Props) {
	const logger = yield* getLoggerFx("userEventCollectionFx");
	logger.trace("userEventCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		limit,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withUserEventCollectionSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
		queryFx: withUserEventQueryBuilderFx,
	});
});

export type userEventCollectionFx = ReturnType<typeof userEventCollectionFx>;
