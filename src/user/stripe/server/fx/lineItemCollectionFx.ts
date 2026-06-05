import { Effect } from "effect";
import type { Stripe } from "stripe";
import { match, P } from "ts-pattern";
import { getLoggerFx } from "@/lib/common/log";
import { stripeClientFx } from "./stripeClientFx";

export namespace lineItemCollectionFx {
	export interface Props {
		session: string | Stripe.Checkout.Session;
	}
}

/**
 * Lists Checkout Session line items with expanded products.
 *
 * Stripe product metadata is one of the fallback places where one-off purchase
 * bundles can be configured, so callers get line items already expanded enough to
 * resolve bundle metadata without doing another Stripe API call.
 */
export const lineItemCollectionFx = Effect.fn("lineItemCollectionFx")(function* ({
	session,
}: lineItemCollectionFx.Props) {
	const sessionId = match(session)
		.with(P.string, (id) => id)
		.with(
			{
				id: P.string,
			},
			(session) => session.id,
		)
		.exhaustive();
	const logger = yield* getLoggerFx("lineItemCollectionFx");
	logger.trace("lineItemCollectionFx", {
		sessionId,
	});

	const stripe = yield* stripeClientFx();

	return yield* Effect.promise(() => {
		return stripe.checkout.sessions.listLineItems(
			sessionId,
			{
				expand: [
					"data.price.product",
				],
				limit: 100,
			},
		);
	});
});

export type lineItemCollectionFx = ReturnType<typeof lineItemCollectionFx>;
