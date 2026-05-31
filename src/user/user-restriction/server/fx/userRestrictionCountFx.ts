import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withUserRestrictionSelectFx } from "../db/withUserRestrictionSelectFx";
import type { UserRestrictionCountQuerySchema } from "../schema/UserRestrictionCountQuerySchema";
import type { UserRestrictionWhereSchema } from "../schema/UserRestrictionWhereSchema";

export namespace userRestrictionCountFx {
	export interface Props extends UserRestrictionCountQuerySchema.Type {
		scope: UserRestrictionWhereSchema.Type;
	}
}

export const userRestrictionCountFx = Effect.fn("userRestrictionCountFx")(function* ({
	where,
	scope,
}: userRestrictionCountFx.Props) {
	const logger = yield* getLoggerFx("userRestrictionCountFx");
	logger.trace("userRestrictionCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withUserRestrictionSelectFx({
			sort: [],
		}),
		where,
		scope,
	});
});

export type userRestrictionCountFx = ReturnType<typeof userRestrictionCountFx>;
