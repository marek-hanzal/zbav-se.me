import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withUserEventSelectFx } from "../db/withUserEventSelectFx";
import type { UserEventQuerySchema } from "../schema/UserEventQuerySchema";
import type { UserEventWhereSchema } from "../schema/UserEventWhereSchema";

export namespace userEventCollectionFx {
	export interface Props extends UserEventQuerySchema.Type {
		scope: UserEventWhereSchema.Type;
	}
}

export const userEventCollectionFx = Effect.fn("userEventCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	limit,
}: userEventCollectionFx.Props) {
	const logger = yield* getLoggerFx("userEventCollectionFx");
	logger.trace("userEventCollectionFx", {
		where,
		scope,
		cursor,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withUserEventSelectFx({
			sort,
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type userEventCollectionFx = ReturnType<typeof userEventCollectionFx>;
