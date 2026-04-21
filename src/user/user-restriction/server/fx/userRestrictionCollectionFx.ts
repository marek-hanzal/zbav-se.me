import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withUserRestrictionCollectionSelectFx } from "../db/withUserRestrictionCollectionSelectFx";
import { withUserRestrictionQueryBuilderFx } from "../db/withUserRestrictionQueryBuilderFx";
import type { UserRestrictionFilterSchema } from "../schema/UserRestrictionFilterSchema";
import type { UserRestrictionQuerySchema } from "../schema/UserRestrictionQuerySchema";

export namespace userRestrictionCollectionFx {
	export interface Props extends UserRestrictionQuerySchema.Type {
		scope: UserRestrictionFilterSchema.Type;
	}
}

export const userRestrictionCollectionFx = Effect.fn("userRestrictionCollectionFx")(function* ({
	filter,
	where,
	scope,
	cursor = {
		page: 0,
		size: 10,
	},
	limit,
	sort,
}: userRestrictionCollectionFx.Props) {
	const logger = yield* getLoggerFx("userRestrictionCollectionFx");
	logger.trace("userRestrictionCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		limit,
		sort,
	});

	return yield* withCollectionFx({
		selectFx: withUserRestrictionCollectionSelectFx({
			sort,
		}),
		cursor,
		limit,
		filter,
		where,
		scope,
		queryFx: withUserRestrictionQueryBuilderFx,
	});
});

export type userRestrictionCollectionFx = ReturnType<typeof userRestrictionCollectionFx>;
