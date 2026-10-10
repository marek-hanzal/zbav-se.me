import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withDateServiceFx } from "~/date/fx/withDateServiceFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { rateLimitEventFx } from "~/server/rate-limit/server/fx/rateLimitEventFx";
import { RateLimitEventCreateSchema } from "~/server/rate-limit/server/schema/RateLimitEventCreateSchema";
import { RateLimitEventSchema } from "~/server/rate-limit/server/schema/RateLimitEventSchema";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace rateLimitEventFn {
	export type Error = Effect.Error<rateLimitEventFx>;
}

export const rateLimitEventFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.validator(RateLimitEventCreateSchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: RateLimitEventSchema,
			dataFx: rateLimitEventFx(data),
		}).pipe(
			withKyselyFx(database),
			withDateServiceFx(),
			withLoggerFx(rootLogger),
			Effect.tapError((error) => {
				return Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				});
			}),
			Effect.runPromise,
		);
	});
