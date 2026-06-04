import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import type { NoticeSchema } from "@/lib/common/schema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withRateLimitMiddleware } from "~/server/middleware/withRateLimitMiddleware";
import { billingStripeWebhookRequestFx } from "~/user/billing/server/fx/billingStripeWebhookRequestFx";

export const Route = createFileRoute("/api/stripe/webhook")({
	server: {
		middleware: [
			withLogMiddleware,
			withDatabaseMiddleware,
			withRateLimitMiddleware({
				rule: "billing:stripe-webhook",
				key: [],
				message: "Too many requests, bro, keep calm and get some coffee.",
			}),
		],
		handlers: {
			async POST({ request, context: { database, rootLogger } }) {
				const logger = rootLogger.getChild([
					"stripe",
					"webhook",
				]);
				const signature = request.headers.get("Stripe-Signature");

				if (!signature) {
					logger.warn("Called stripe webhoook without signature!");
					return Response.json(
						{
							type: "error",
							message: "Some mysterious header is missing here, guess which one.",
						} satisfies NoticeSchema.Type,
						{
							status: 400,
							statusText: "Hey bro, what are you trying?",
						},
					);
				}

				const result = await billingStripeWebhookRequestFx({
					signature,
					async content() {
						return request.text();
					},
				}).pipe(
					withKyselyFx(database),
					withDateFx,
					withLoggerFx(rootLogger),
					Effect.catchTag("RuntimeErrorFx", (error) => Effect.succeed(error)),
					Effect.runPromise,
				);

				if (result instanceof RuntimeErrorFx) {
					return Response.json(result.toJSON(), {
						status: 500,
					});
				}

				return Response.json(result);
			},
		},
	},
});
