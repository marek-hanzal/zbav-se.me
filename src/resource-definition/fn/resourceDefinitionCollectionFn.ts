import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { resourceDefinitionCollectionFx } from "~/resource-definition/fx/resourceDefinitionCollectionFx";
import { ResourceDefinitionQuerySchema } from "~/resource-definition/schema/ResourceDefinitionQuerySchema";
import { ResourceDefinitionSchema } from "~/resource-definition/schema/ResourceDefinitionSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace resourceDefinitionCollectionFn {
	export type Error = Effect.Error<resourceDefinitionCollectionFx>;
}

export const resourceDefinitionCollectionFn = createServerFn()
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
			schema: z.array(ResourceDefinitionSchema),
			dataFx: resourceDefinitionCollectionFx(data),
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
