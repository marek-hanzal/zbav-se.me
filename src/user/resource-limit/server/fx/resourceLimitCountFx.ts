import { Effect } from "effect";
import { withCountFx } from "@/lib/common/count";
import { getLoggerFx } from "@/lib/common/log";
import { withResourceLimitSelectFx } from "../db/withResourceLimitSelectFx";
import type { ResourceLimitCountQuerySchema } from "../schema/ResourceLimitCountQuerySchema";
import type { ResourceLimitWhereSchema } from "../schema/ResourceLimitWhereSchema";

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
