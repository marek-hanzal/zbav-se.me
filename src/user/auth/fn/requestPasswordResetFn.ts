import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withAuthMiddleware } from "~/server/middleware/withAuthMiddleware";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withRequestSourceMiddleware } from "~/server/middleware/withRequestSourceMiddleware";
import { rateLimitCheckFx } from "~/server/rate-limit/server/fx/rateLimitCheckFx";

const PASSWORD_RESET_REQUEST_RATE_LIMIT_RULE = "password-reset-request";
const PASSWORD_RESET_REQUEST_SOURCE_RATE_LIMIT_RULE = "password-reset-request-source";

export const requestPasswordResetFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withAuthMiddleware,
		withRequestSourceMiddleware,
	])
	.inputValidator(
		z
			.looseObject({
				email: z.email(),
				redirectTo: z.url(),
			})
			.strip(),
	)
	.handler(
		async ({
			data,
			context: { auth, database, requestSource, rootLogger },
			serverFnMeta: { name },
		}) => {
			const logger = rootLogger.getChild([
				"fn",
				name,
			]);
			const email = data.email.toLowerCase();

			return Effect.gen(function* () {
				yield* rateLimitCheckFx({
					rule: PASSWORD_RESET_REQUEST_RATE_LIMIT_RULE,
					key: [
						email,
					],
					message: "Too many password reset requests. Please try again later.",
				});
				yield* rateLimitCheckFx({
					rule: PASSWORD_RESET_REQUEST_SOURCE_RATE_LIMIT_RULE,
					key: [
						requestSource,
					],
					message: "Too many password reset requests. Please try again later.",
				});

				return yield* Effect.promise(() => {
					return auth.api.requestPasswordReset({
						body: {
							...data,
							email,
						},
					});
				});
			}).pipe(withKyselyFx(database), withDateFx, withLoggerFx(logger), Effect.runPromise);
		},
	);
