import { Effect } from "effect";
import { DateTime } from "luxon";
import type Stripe from "stripe";
import { match, P } from "ts-pattern";
import { getLoggerFx } from "@/lib/common/log";
import { checkoutSessionCollectionSyncFx } from "./checkoutSessionCollectionSyncFx";
import { checkoutSessionSyncFx } from "./checkoutSessionSyncFx";
import { subscriptionSyncFx } from "./subscriptionSyncFx";

export namespace syncFx {
	export interface Props {
		/**
		 * Verified Stripe event from webhookFx.
		 */
		event: Stripe.Event;
	}
}

/**
 * Routes Stripe events to the smallest sync operation that can refetch current state.
 *
 * The event type is only a hint for which Stripe object ID to refetch. Local state
 * changes happen in the specialized sync Fxs, which makes event order irrelevant for
 * subscription state and one-off grant/rollback state.
 */
export const syncFx = Effect.fn("syncFx")(function* ({ event }: syncFx.Props) {
	const logger = yield* getLoggerFx("syncFx");
	logger.trace("syncFx", {
		id: event.id,
		type: event.type,
	});

	const expiresAt = DateTime.fromSeconds(event.created).toJSDate();

	/*
	 * Subscription and invoice events converge on the same subscription sync. Checkout
	 * and payment/refund events converge on Checkout Session sync because one-off
	 * fulfillment keys are derived from Checkout line items.
	 */
	const sync = Effect.gen(function* () {
		return yield* match(event)
			.with(
				{
					type: P.union(
						"customer.subscription.created",
						"customer.subscription.updated",
						"customer.subscription.deleted",
					),
				},
				(event) =>
					subscriptionSyncFx({
						subscription: event.data.object.id,
					}),
			)
			.with(
				{
					type: P.union(
						"invoice.paid",
						"invoice.payment_failed",
						"invoice.payment_succeeded",
					),
				},
				(event) =>
					match(event.data.object.parent?.subscription_details?.subscription)
						.with(P.string, (subscription) =>
							subscriptionSyncFx({
								subscription,
							}),
						)
						.with(
							{
								id: P.string,
							},
							(subscription) =>
								subscriptionSyncFx({
									subscription: subscription.id,
								}),
						)
						.otherwise(() => Effect.void),
			)
			.with(
				{
					type: P.union(
						"checkout.session.completed",
						"checkout.session.async_payment_succeeded",
						"checkout.session.async_payment_failed",
						"checkout.session.expired",
					),
				},
				(event) =>
					checkoutSessionSyncFx({
						id: event.data.object.id,
						expiresAt,
					}),
			)
			.with(
				{
					type: P.union(
						"payment_intent.succeeded",
						"payment_intent.payment_failed",
						"payment_intent.canceled",
					),
				},
				(event) =>
					checkoutSessionCollectionSyncFx({
						paymentIntentId: event.data.object.id,
						expiresAt,
					}),
			)
			.with(
				{
					type: "charge.refunded",
				},
				(event) =>
					match(event.data.object.payment_intent)
						.with(P.string, (paymentIntent) =>
							checkoutSessionCollectionSyncFx({
								paymentIntentId: paymentIntent,
								expiresAt,
							}),
						)
						.with(
							{
								id: P.string,
							},
							(paymentIntent) =>
								checkoutSessionCollectionSyncFx({
									paymentIntentId: paymentIntent.id,
									expiresAt,
								}),
						)
						.otherwise(() => Effect.void),
			)
			.otherwise(() => Effect.void);
	});

	return yield* sync.pipe(
		Effect.catchTag("SyncSkippedFx", (error) => {
			logger.warn("Stripe sync skipped", {
				eventId: event.id,
				eventType: event.type,
				reason: error.reason,
				cause: error.cause,
			});

			return Effect.void;
		}),
	);
});

export type syncFx = ReturnType<typeof syncFx>;
