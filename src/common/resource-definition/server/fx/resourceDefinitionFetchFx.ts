import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withResourceDefinitionSelectFx } from "../db/withResourceDefinitionSelectFx";
import type { ResourceDefinitionQuerySchema } from "../schema/ResourceDefinitionQuerySchema";
import type { ResourceDefinitionWhereSchema } from "../schema/ResourceDefinitionWhereSchema";

export namespace resourceDefinitionFetchFx {
	export interface Props extends ResourceDefinitionQuerySchema.Type {
		scope?: ResourceDefinitionWhereSchema.Type;
	}
}

export const resourceDefinitionFetchFx = Effect.fn("resourceDefinitionFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
}: resourceDefinitionFetchFx.Props) {
	const logger = yield* getLoggerFx("resourceDefinitionFetchFx");
	logger.trace("resourceDefinitionFetchFx", {
		filter,
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "resource_definition",
		selectFx: withResourceDefinitionSelectFx({
			sort,
		}),
		filter,
		where,
		scope,
	});
});

export type resourceDefinitionFetchFx = ReturnType<typeof resourceDefinitionFetchFx>;
