import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { withDateServiceFx } from "@/lib/common/date";
import { withLoggerFx } from "@/lib/common/log";
import type { NoticeSchema } from "@/lib/common/schema";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withRateLimitMiddleware } from "~/server/middleware/withRateLimitMiddleware";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { withStripConfigEnv } from "~/user/stripe/server/env/withStripConfigEnv";
import { webhookFx } from "~/user/stripe/server/fx/webhookFx";

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

				return webhookFx({
					signature,
					async content() {
						return request.text();
					},
				})
					.pipe(
						withKyselyFx(database),
						withDateServiceFx(),
						withStripeConfigFx(withStripConfigEnv()),
						withLoggerFx(rootLogger),
						Effect.runPromise,
					)
					.then(Response.json)
					.catch((error) => {
						logger.error("Stripe webhook failed", {
							error,
						});

						return Response.json(
							{
								type: "error",
								message: "Stripe webhook failed",
							} satisfies NoticeSchema.Type,
							{
								status: 500,
							},
						);
					});
			},
		},
	},
});
