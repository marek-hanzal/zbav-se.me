import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withUserResourceLimitSelectFx } from "../db/withUserResourceLimitSelectFx";
import type { UserResourceLimitCountQuerySchema } from "../schema/UserResourceLimitCountQuerySchema";
import type { UserResourceLimitWhereSchema } from "../schema/UserResourceLimitWhereSchema";

export namespace userResourceLimitCountFx {
	export interface Props extends UserResourceLimitCountQuerySchema.Type {
		scope: UserResourceLimitWhereSchema.Type;
	}
}

export const userResourceLimitCountFx = Effect.fn("userResourceLimitCountFx")(function* ({
	where,
	scope,
}: userResourceLimitCountFx.Props) {
	const logger = yield* getLoggerFx("userResourceLimitCountFx");
	logger.trace("userResourceLimitCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withUserResourceLimitSelectFx({
			sort: [],
		}),
		where,
		scope,
	});
});

export type userResourceLimitCountFx = ReturnType<typeof userResourceLimitCountFx>;
