import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { resourceDefinitionFetchFx } from "~/common/resource-definition/server/fx/resourceDefinitionFetchFx";
import { ResourceDefinitionQuerySchema } from "~/common/resource-definition/server/schema/ResourceDefinitionQuerySchema";
import { ResourceDefinitionSchema } from "~/common/resource-definition/server/schema/ResourceDefinitionSchema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";

export namespace resourceDefinitionFetchFn {
	export type Error = Effect.Effect.Error<resourceDefinitionFetchFx>;
}

export const resourceDefinitionFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(ResourceDefinitionQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: ResourceDefinitionSchema,
			dataFx: resourceDefinitionFetchFx(data),
		}).pipe(
			withKyselyFx(database),
			withLoggerFx(rootLogger),
			Effect.tapError((error) =>
				Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				}),
			),
			Effect.runPromise,
		);
	});
