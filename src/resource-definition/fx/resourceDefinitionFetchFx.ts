import { Effect } from "effect";
import { withFetchFx } from "~/http/fx/withFetchFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { withResourceDefinitionSelectFx } from "~/resource-definition/db/withResourceDefinitionSelectFx";
import type { ResourceDefinitionQuerySchema } from "~/resource-definition/schema/ResourceDefinitionQuerySchema";
import type { ResourceDefinitionWhereSchema } from "~/resource-definition/schema/ResourceDefinitionWhereSchema";

export namespace resourceDefinitionFetchFx {
	export interface Props extends ResourceDefinitionQuerySchema.Type {
		scope?: ResourceDefinitionWhereSchema.Type;
	}
}

export const resourceDefinitionFetchFx = Effect.fn("resourceDefinitionFetchFx")(function* ({
	where,
	scope,
	sort,
}: resourceDefinitionFetchFx.Props) {
	const logger = yield* getLoggerFx("resourceDefinitionFetchFx");
	logger.trace("resourceDefinitionFetchFx", {
		where,
		scope,
		sort,
	});

	return yield* withFetchFx({
		resource: "resource_definition",
		selectFx: withResourceDefinitionSelectFx({
			sort,
		}),
		where,
		scope,
	});
});

export type resourceDefinitionFetchFx = ReturnType<typeof resourceDefinitionFetchFx>;
