import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withUserResourceLimitSelectFx } from "../db/withUserResourceLimitSelectFx";
import type { UserResourceLimitQuerySchema } from "../schema/UserResourceLimitQuerySchema";
import type { UserResourceLimitWhereSchema } from "../schema/UserResourceLimitWhereSchema";

export namespace userResourceLimitFetchFx {
	export interface Props extends UserResourceLimitQuerySchema.Type {
		scope: UserResourceLimitWhereSchema.Type;
	}
}

export const userResourceLimitFetchFx = Effect.fn("userResourceLimitFetchFx")(function* ({
	where,
	scope,
	sort,
}: userResourceLimitFetchFx.Props) {
	const logger = yield* getLoggerFx("userResourceLimitFetchFx");
	logger.trace("userResourceLimitFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "user_resource_limit",
		selectFx: withUserResourceLimitSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type userResourceLimitFetchFx = ReturnType<typeof userResourceLimitFetchFx>;
