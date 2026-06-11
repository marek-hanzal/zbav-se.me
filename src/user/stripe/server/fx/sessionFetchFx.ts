import { Effect } from "effect";
import type { Stripe } from "stripe";
import { stripeClientFx } from "./stripeClientFx";

export namespace sessionFetchFx {
	export interface Props {
		id: string | Stripe.Checkout.Session;
	}
}

/**
 * Fetches the current Stripe Checkout Session object.
 *
 * Sync code may receive a session ID from our customer-wide scan or an expanded
 * Session-shaped object from another Stripe call. Both shapes are accepted, but the
 * returned value always comes from a fresh Stripe API read.
 */
export const sessionFetchFx = Effect.fn("sessionFetchFx")(function* ({ id }: sessionFetchFx.Props) {
	const stripe = yield* stripeClientFx();
	const sessionId = typeof id === "string" ? id : id.id;

	return yield* Effect.promise(() => stripe.checkout.sessions.retrieve(sessionId));
});

export type sessionFetchFx = ReturnType<typeof sessionFetchFx>;
