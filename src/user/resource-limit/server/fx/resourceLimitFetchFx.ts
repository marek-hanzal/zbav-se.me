import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withResourceLimitSelectFx } from "../db/withResourceLimitSelectFx";
import type { ResourceLimitQuerySchema } from "../schema/ResourceLimitQuerySchema";
import type { ResourceLimitWhereSchema } from "../schema/ResourceLimitWhereSchema";

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
		resource: "resource_bundle_limit",
		selectFx: withResourceLimitSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type resourceLimitFetchFx = ReturnType<typeof resourceLimitFetchFx>;
