import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { rateLimitEventFx } from "~/rate-limit/fx/rateLimitEventFx";
import { RateLimitEventCreateSchema } from "~/rate-limit/schema/RateLimitEventCreateSchema";
import { RateLimitEventSchema } from "~/rate-limit/schema/RateLimitEventSchema";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
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
			withKyselyFn(database),
			withDateServiceFn(),
			withLoggerFn(rootLogger),
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
