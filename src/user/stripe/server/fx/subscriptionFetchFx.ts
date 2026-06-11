import { Effect } from "effect";
import type { Stripe } from "stripe";
import { stripeClientFx } from "./stripeClientFx";

export namespace subscriptionFetchFx {
	export interface Props {
		id: string | Stripe.Subscription;
	}
}

/**
 * Fetches the current Stripe subscription object.
 *
 * Stripe can hand subscriptions around either as an ID or as an already expanded
 * object. Callers may pass both shapes, but this Fx still resolves only the ID and
 * refetches current data from Stripe API so sync never trusts a stale webhook payload.
 */
export const subscriptionFetchFx = Effect.fn("subscriptionFetchFx")(function* ({
	id,
}: subscriptionFetchFx.Props) {
	const stripe = yield* stripeClientFx();
	const subscriptionId = typeof id === "string" ? id : id.id;

	return yield* Effect.promise(() => stripe.subscriptions.retrieve(subscriptionId));
});

export type subscriptionFetchFx = ReturnType<typeof subscriptionFetchFx>;
