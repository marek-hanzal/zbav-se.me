import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withResourceLimitSelectFx } from "~/user-resource-limit/db/withResourceLimitSelectFx";
import type { ResourceLimitQuerySchema } from "~/user-resource-limit/schema/ResourceLimitQuerySchema";
import type { ResourceLimitWhereSchema } from "~/user-resource-limit/schema/ResourceLimitWhereSchema";

export namespace resourceLimitFetchFx {
	export interface Props extends ResourceLimitQuerySchema.Type {
		scope: ResourceLimitWhereSchema.Type;
	}
}

export const resourceLimitFetchFx = Effect.fn("resourceLimitFetchFx")(function* ({
	where,
	scope,
	sort,
}: resourceLimitFetchFx.Props) {
	const logger = yield* getLoggerFx("resourceLimitFetchFx");
	logger.trace("resourceLimitFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "user_resource_bundle_limit",
		selectFx: withResourceLimitSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type resourceLimitFetchFx = ReturnType<typeof resourceLimitFetchFx>;
