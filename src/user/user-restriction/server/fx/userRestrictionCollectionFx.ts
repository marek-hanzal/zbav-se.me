import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withUserRestrictionSelectFx } from "../db/withUserRestrictionSelectFx";
import type { UserRestrictionQuerySchema } from "../schema/UserRestrictionQuerySchema";
import type { UserRestrictionWhereSchema } from "../schema/UserRestrictionWhereSchema";

export namespace userRestrictionCollectionFx {
	export interface Props extends UserRestrictionQuerySchema.Type {
		scope: UserRestrictionWhereSchema.Type;
	}
}

export const userRestrictionCollectionFx = Effect.fn("userRestrictionCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	limit,
}: userRestrictionCollectionFx.Props) {
	const logger = yield* getLoggerFx("userRestrictionCollectionFx");
	logger.trace("userRestrictionCollectionFx", {
		where,
		scope,
		cursor,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withUserRestrictionSelectFx({
			sort,
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type userRestrictionCollectionFx = ReturnType<typeof userRestrictionCollectionFx>;
