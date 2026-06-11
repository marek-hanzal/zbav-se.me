import { Effect } from "effect";
import type { Stripe } from "stripe";
import { match, P } from "ts-pattern";
import { stripeClientFx } from "./stripeClientFx";

export namespace paymentIntentFetchFx {
	export interface Props {
		id: string | Stripe.PaymentIntent;
	}
}

/**
 * Fetches the current Stripe PaymentIntent object with its latest charge expanded.
 *
 * Checkout Sessions can expose PaymentIntent as a plain ID or an expanded object.
 * Callers can pass either shape, but refund/cancel decisions must use fresh Stripe
 * API state instead of whatever arrived in a webhook-shaped object.
 */
export const paymentIntentFetchFx = Effect.fn("paymentIntentFetchFx")(function* ({
	id,
}: paymentIntentFetchFx.Props) {
	const stripe = yield* stripeClientFx();

	return yield* Effect.promise(() => {
		return stripe.paymentIntents.retrieve(
			match(id)
				.with(P.string, (id) => id)
				.with(
					{
						id: P.string,
					},
					(paymentIntent) => paymentIntent.id,
				)
				.exhaustive(),
			{
				expand: [
					"latest_charge",
				],
			},
		);
	});
});

export type paymentIntentFetchFx = ReturnType<typeof paymentIntentFetchFx>;
