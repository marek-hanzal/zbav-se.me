import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withUserRestrictionQueryBuilderFx } from "../db/withUserRestrictionQueryBuilderFx";
import { withUserRestrictionSelectFx } from "../db/withUserRestrictionSelectFx";
import type { UserRestrictionFilterSchema } from "../schema/UserRestrictionFilterSchema";
import type { UserRestrictionQuerySchema } from "../schema/UserRestrictionQuerySchema";

export namespace userRestrictionFetchFx {
	export interface Props extends UserRestrictionQuerySchema.Type {
		scope: UserRestrictionFilterSchema.Type;
	}
}

export const userRestrictionFetchFx = Effect.fn("userRestrictionFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: userRestrictionFetchFx.Props) {
	const logger = yield* getLoggerFx("userRestrictionFetchFx");
	logger.trace("userRestrictionFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "user_restriction",
		selectFx: withUserRestrictionSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
		queryFx: withUserRestrictionQueryBuilderFx,
	});
});

export type userRestrictionFetchFx = ReturnType<typeof userRestrictionFetchFx>;
