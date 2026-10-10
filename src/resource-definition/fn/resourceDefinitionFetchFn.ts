import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { resourceDefinitionFetchFx } from "~/resource-definition/fx/resourceDefinitionFetchFx";
import { ResourceDefinitionQuerySchema } from "~/resource-definition/schema/ResourceDefinitionQuerySchema";
import { ResourceDefinitionSchema } from "~/resource-definition/schema/ResourceDefinitionSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace resourceDefinitionFetchFn {
	export type Error = Effect.Error<resourceDefinitionFetchFx>;
}

export const resourceDefinitionFetchFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(ResourceDefinitionQuerySchema)
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
			withKyselyFn(database),
			withLoggerFn(rootLogger),
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
