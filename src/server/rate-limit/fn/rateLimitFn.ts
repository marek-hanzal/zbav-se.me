import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { rateLimitFx } from "~/server/rate-limit/server/fx/rateLimitFx";
import { RateLimitQuerySchema } from "~/server/rate-limit/server/schema/RateLimitQuerySchema";
import { RateLimitSchema } from "~/server/rate-limit/server/schema/RateLimitSchema";

export namespace rateLimitFn {
	export type Error = Effect.Effect.Error<rateLimitFx>;
}

export const rateLimitFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
	])
	.inputValidator(RateLimitQuerySchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: RateLimitSchema,
			dataFx: rateLimitFx(data),
		}).pipe(
			withKyselyFx(database),
			withDateFx,
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
