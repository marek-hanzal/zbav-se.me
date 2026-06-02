import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { RateLimitErrorFx } from "~/server/error/RateLimitErrorFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { billingStripeWebhookRequestFx } from "~/user/billing/server/fx/billingStripeWebhookRequestFx";

export const Route = createFileRoute("/api/stripe/webhook")({
	server: {
		middleware: [
			withLogMiddleware,
			withDatabaseMiddleware,
		],
		handlers: {
			async POST({ request, context: { database, rootLogger } }) {
				const result = await billingStripeWebhookRequestFx({
					request,
				}).pipe(
					withKyselyFx(database),
					withDateFx,
					withLoggerFx(rootLogger),
					Effect.catchTag("RateLimitErrorFx", (error) => Effect.succeed(error)),
					Effect.catchTag("RuntimeErrorFx", (error) => Effect.succeed(error)),
					Effect.runPromise,
				);

				/**
				 * TODO: Move rate limit stuff into standalone middleware + extract rate limiting from billingWebhookFx
				 */
				if (result instanceof RateLimitErrorFx) {
					return Response.json(result.toJSON(), {
						status: 429,
						headers: {
							"Retry-After": String(result.window),
						},
					});
				}

				if (result instanceof RuntimeErrorFx) {
					return Response.json(result.toJSON(), {
						status: 400,
					});
				}

				return Response.json(result);
			},
		},
	},
});
