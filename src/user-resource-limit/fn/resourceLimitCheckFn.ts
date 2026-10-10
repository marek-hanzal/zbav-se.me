import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { resourceLimitCheckFx } from "~/user-resource-limit/fx/resourceLimitCheckFx";
import { ResourceLimitCheckSchema } from "~/user-resource-limit/schema/ResourceLimitCheckSchema";
import { ResourceLimitInfoSchema } from "~/user-resource-limit/schema/ResourceLimitInfoSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace resourceLimitCheckFn {
	export type Error = Effect.Error<resourceLimitCheckFx>;
}

export const resourceLimitCheckFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(ResourceLimitCheckSchema)
	.handler(async ({ data, context: { database, user, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: ResourceLimitInfoSchema,
			dataFx: resourceLimitCheckFx({
				...data,
				userId: user.id,
			}),
		}).pipe(
			withKyselyFx(database),
			withDateServiceFx(),
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
