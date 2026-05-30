import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withResourceDefinitionSelectFx } from "../db/withResourceDefinitionSelectFx";
import type { ResourceDefinitionFilterSchema } from "../schema/ResourceDefinitionFilterSchema";
import type { ResourceDefinitionQuerySchema } from "../schema/ResourceDefinitionQuerySchema";

export namespace resourceDefinitionCollectionFx {
	export interface Props extends ResourceDefinitionQuerySchema.Type {
		scope?: ResourceDefinitionFilterSchema.Type;
	}
}

export const resourceDefinitionCollectionFx = Effect.fn("resourceDefinitionCollectionFx")(function* ({
	cursor = {
		page: 0,
		size: 10,
	},
	filter,
	where,
	scope,
	sort,
	limit,
}: resourceDefinitionCollectionFx.Props) {
	const logger = yield* getLoggerFx("resourceDefinitionCollectionFx");
	logger.trace("resourceDefinitionCollectionFx", {
		filter,
		where,
		scope,
		cursor,
		sort,
		limit,
	});

	return yield* withCollectionFx({
		selectFx: withResourceDefinitionSelectFx({
			sort,
		}),
		cursor,
		filter,
		where,
		scope,
		limit,
	});
});

export type resourceDefinitionCollectionFx = ReturnType<typeof resourceDefinitionCollectionFx>;
