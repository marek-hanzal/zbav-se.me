import { Effect } from "effect";
import Stripe from "stripe";
import { StripeConfigFx } from "../context/StripeConfigFx";

export const stripeClientFx = Effect.fn("stripeClientFx")(function* () {
	const { secret } = yield* StripeConfigFx;

	return new Stripe(secret);
});

export type stripeClientFx = ReturnType<typeof stripeClientFx>;
