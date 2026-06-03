import { Effect } from "effect";
import Stripe from "stripe";
import { ServerStripeSchema } from "~/server/env/ServerStripeSchema";

export const stripeClientFx = Effect.fn("stripeClientFx")(() =>
	Effect.sync(() => {
		const stripeConfig = ServerStripeSchema.parse(process.env);

		return new Stripe(stripeConfig.SERVER_STRIPE_SECRET);
	}),
);

export type stripeClientFx = ReturnType<typeof stripeClientFx>;
