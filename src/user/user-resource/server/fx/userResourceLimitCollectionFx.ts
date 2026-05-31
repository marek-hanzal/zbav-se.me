import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withUserResourceLimitSelectFx } from "../db/withUserResourceLimitSelectFx";
import type { UserResourceLimitQuerySchema } from "../schema/UserResourceLimitQuerySchema";
import type { UserResourceLimitWhereSchema } from "../schema/UserResourceLimitWhereSchema";

export namespace userResourceLimitCollectionFx {
	export interface Props extends UserResourceLimitQuerySchema.Type {
		scope: UserResourceLimitWhereSchema.Type;
	}
}

export const userResourceLimitCollectionFx = Effect.fn("userResourceLimitCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	limit,
}: userResourceLimitCollectionFx.Props) {
	const logger = yield* getLoggerFx("userResourceLimitCollectionFx");
	logger.trace("userResourceLimitCollectionFx", {
		where,
		scope,
		cursor,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withUserResourceLimitSelectFx({
			sort,
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type userResourceLimitCollectionFx = ReturnType<typeof userResourceLimitCollectionFx>;
