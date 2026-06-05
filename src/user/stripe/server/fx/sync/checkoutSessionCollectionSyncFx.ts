import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { stripeClientFx } from "../stripeClientFx";
import { checkoutSessionSyncFx } from "./checkoutSessionSyncFx";

export namespace checkoutSessionCollectionSyncFx {
	export interface Props {
		/**
		 * PaymentIntent ID from Stripe events that do not directly carry Checkout Session ID.
		 */
		paymentIntentId: string;
		/**
		 * Stripe event timestamp forwarded to the concrete session sync.
		 */
		expiresAt: Date;
	}
}

/**
 * Resolves Checkout Sessions from a PaymentIntent and syncs each session.
 *
 * Refund and payment-intent events point at PaymentIntent/Charge objects, but our
 * deterministic fulfillment keys are based on Checkout Session line items. This Fx
 * is only a lookup bridge back into checkoutSessionSyncFx.
 */
export const checkoutSessionCollectionSyncFx = Effect.fn("checkoutSessionCollectionSyncFx")(
	function* ({ paymentIntentId, expiresAt }: checkoutSessionCollectionSyncFx.Props) {
		const logger = yield* getLoggerFx("checkoutSessionCollectionSyncFx");
		logger.trace("checkoutSessionCollectionSyncFx", {
			paymentIntentId,
		});

		const stripe = yield* stripeClientFx();
		const sessions = yield* Effect.tryPromise({
			try() {
				return stripe.checkout.sessions.list({
					limit: 100,
					payment_intent: paymentIntentId,
				});
			},
			catch(error) {
				return new RuntimeErrorFx({
					message: "Stripe checkout sessions by payment intent retrieval failed",
					cause: error,
				});
			},
		});

		return yield* Effect.forEach(sessions.data, (session) =>
			checkoutSessionSyncFx({
				id: session.id,
				expiresAt,
			}),
		);
	},
);

export type checkoutSessionCollectionSyncFx = ReturnType<typeof checkoutSessionCollectionSyncFx>;
