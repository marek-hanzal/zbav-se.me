import { Effect } from "effect";
import { withCountFx } from "~/database-query/fx/withCountFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withResourceLimitSelectFx } from "~/user-resource-limit/db/withResourceLimitSelectFx";
import type { ResourceLimitCountQuerySchema } from "~/user-resource-limit/schema/ResourceLimitCountQuerySchema";
import type { ResourceLimitWhereSchema } from "~/user-resource-limit/schema/ResourceLimitWhereSchema";

export namespace resourceLimitCountFx {
	export interface Props extends ResourceLimitCountQuerySchema.Type {
		scope: ResourceLimitWhereSchema.Type;
	}
}

export const resourceLimitCountFx = Effect.fn("resourceLimitCountFx")(function* ({
	where,
	scope,
}: resourceLimitCountFx.Props) {
	const logger = yield* getLoggerFx("resourceLimitCountFx");
	logger.trace("resourceLimitCountFx", {
		where,
		scope,
	});

	return yield* withCountFx({
		selectFx: withResourceLimitSelectFx({
			sort: [],
		}),
		where,
		scope,
	});
});

export type resourceLimitCountFx = ReturnType<typeof resourceLimitCountFx>;
