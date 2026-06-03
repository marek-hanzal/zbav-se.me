import { Effect } from "effect";
import Stripe from "stripe";
import { getLoggerFx } from "@/lib/common/log";
import { ServerStripeSchema } from "~/server/env/ServerStripeSchema";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { billingStripeWebhookFx } from "./billingStripeWebhookFx";

export namespace billingStripeWebhookRequestFx {
	export interface Props {
		signature: string;
		content(): Promise<string>;
	}
}

export const billingStripeWebhookRequestFx = Effect.fn("billingStripeWebhookRequestFx")(function* ({
	signature,
	content,
}: billingStripeWebhookRequestFx.Props) {
	const logger = yield* getLoggerFx("billingStripeWebhookRequestFx");
	/**
	 * TODO: move stripconfig to StripeConfigFx so we'll yield the config instead of manuall crapping here
	 */
	const stripeConfig = ServerStripeSchema.parse(process.env);
	const stripe = new Stripe(stripeConfig.SERVER_STRIPE_SECRET);
	const event = yield* Effect.tryPromise({
		try: async () =>
			stripe.webhooks.constructEvent(
				await content(),
				signature,
				stripeConfig.SERVER_STRIPE_WEBHOOK_SECRET,
			),
		catch(error) {
			logger.warn("Invalid Stripe webhook signature", {
				error,
			});

			return new RuntimeErrorFx({
				message: "Invalid Stripe webhook signature",
				cause: error,
			});
		},
	});

	return yield* billingStripeWebhookFx({
		event,
	});
});

export type billingStripeWebhookRequestFx = ReturnType<typeof billingStripeWebhookRequestFx>;
