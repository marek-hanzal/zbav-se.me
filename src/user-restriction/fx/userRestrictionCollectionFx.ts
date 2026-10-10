import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withUserRestrictionSelectFx } from "~/user-restriction/db/withUserRestrictionSelectFx";
import type { UserRestrictionQuerySchema } from "~/user-restriction/schema/UserRestrictionQuerySchema";
import type { UserRestrictionWhereSchema } from "~/user-restriction/schema/UserRestrictionWhereSchema";

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
