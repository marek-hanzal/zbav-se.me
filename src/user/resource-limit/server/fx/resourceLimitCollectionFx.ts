import { Effect } from "effect";
import { withCollectionFx } from "~/database-query/fx/withCollectionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withResourceLimitSelectFx } from "../db/withResourceLimitSelectFx";
import type { ResourceLimitQuerySchema } from "../schema/ResourceLimitQuerySchema";
import type { ResourceLimitWhereSchema } from "../schema/ResourceLimitWhereSchema";

export namespace resourceLimitCollectionFx {
	export interface Props extends ResourceLimitQuerySchema.Type {
		scope: ResourceLimitWhereSchema.Type;
	}
}

export const resourceLimitCollectionFx = Effect.fn("resourceLimitCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	where,
	scope,
	sort,
	limit,
}: resourceLimitCollectionFx.Props) {
	const logger = yield* getLoggerFx("resourceLimitCollectionFx");
	logger.trace("resourceLimitCollectionFx", {
		where,
		scope,
		cursor,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withResourceLimitSelectFx({
			sort,
		}),
		cursor,
		where,
		scope,
		limit,
	});
});

export type resourceLimitCollectionFx = ReturnType<typeof resourceLimitCollectionFx>;
