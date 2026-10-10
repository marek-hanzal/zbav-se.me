import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { resourceDefinitionCollectionFx } from "~/common/resource-definition/server/fx/resourceDefinitionCollectionFx";
import { ResourceDefinitionQuerySchema } from "~/common/resource-definition/server/schema/ResourceDefinitionQuerySchema";
import { ResourceDefinitionSchema } from "~/common/resource-definition/server/schema/ResourceDefinitionSchema";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
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
