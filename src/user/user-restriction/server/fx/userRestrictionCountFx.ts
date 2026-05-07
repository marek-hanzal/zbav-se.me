import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withUserRestrictionSelectFx } from "../db/withUserRestrictionSelectFx";
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
		selectFx: withUserRestrictionSelectFx({
			sort: [],
		}),
		filter,
		where,
		scope,
	});
});

export type userRestrictionCountFx = ReturnType<typeof userRestrictionCountFx>;
