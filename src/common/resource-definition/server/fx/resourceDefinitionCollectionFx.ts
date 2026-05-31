import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { getLoggerFx } from "@/lib/common/log";
import { withResourceDefinitionSelectFx } from "../db/withResourceDefinitionSelectFx";
import type { ResourceDefinitionQuerySchema } from "../schema/ResourceDefinitionQuerySchema";
import type { ResourceDefinitionWhereSchema } from "../schema/ResourceDefinitionWhereSchema";

export namespace resourceDefinitionCollectionFx {
	export interface Props extends ResourceDefinitionQuerySchema.Type {
		scope?: ResourceDefinitionWhereSchema.Type;
	}
}

export const resourceDefinitionCollectionFx = Effect.fn("resourceDefinitionCollectionFx")(
	function* ({
		cursor = {
			page: 0,
			size: 10,
		},
		where,
		scope,
		sort,
		limit,
	}: resourceDefinitionCollectionFx.Props) {
		const logger = yield* getLoggerFx("resourceDefinitionCollectionFx");
		logger.trace("resourceDefinitionCollectionFx", {
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
			where,
			scope,
			limit,
		});
	},
);

export type resourceDefinitionCollectionFx = ReturnType<typeof resourceDefinitionCollectionFx>;
