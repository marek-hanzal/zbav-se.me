import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { withDateServiceFx } from "@/lib/common/date";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { rateLimitEventFx } from "~/server/rate-limit/server/fx/rateLimitEventFx";
import { RateLimitEventCreateSchema } from "~/server/rate-limit/server/schema/RateLimitEventCreateSchema";
import { RateLimitEventSchema } from "~/server/rate-limit/server/schema/RateLimitEventSchema";

export namespace rateLimitEventFn {
	export type Error = Effect.Effect.Error<rateLimitEventFx>;
}

export const rateLimitEventFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(RateLimitEventCreateSchema)
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
