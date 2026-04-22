import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withUserRestrictionQueryBuilderFx } from "../db/withUserRestrictionQueryBuilderFx";
import { withUserRestrictionSourceSelectFx } from "../db/withUserRestrictionSourceSelectFx";
import type { UserRestrictionCountQuerySchema } from "../schema/UserRestrictionCountQuerySchema";
import type { UserRestrictionFilterSchema } from "../schema/UserRestrictionFilterSchema";

export namespace userRestrictionCountFx {
	export interface Props extends UserRestrictionCountQuerySchema.Type {
		scope: UserRestrictionFilterSchema.Type;
	}
}

export const userRestrictionCountFx = Effect.fn("userRestrictionCountFx")(function* ({
	filter,
	where,
	scope,
}: userRestrictionCountFx.Props) {
	const logger = yield* getLoggerFx("userRestrictionCountFx");
	logger.trace("userRestrictionCountFx", {
		filter,
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withUserRestrictionSourceSelectFx({
			sort: [],
		}),
		filter,
		where,
		scope,
		queryFx: withUserRestrictionQueryBuilderFx,
	});
});

export type userRestrictionCountFx = ReturnType<typeof userRestrictionCountFx>;
