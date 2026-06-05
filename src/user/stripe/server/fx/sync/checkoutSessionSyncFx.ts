import { Effect } from "effect";
import { DateTime } from "luxon";
import { match, P } from "ts-pattern";
import { getLoggerFx } from "@/lib/common/log";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { SyncSkippedFx } from "../../error/SyncSkippedFx";
import { stripeClientFx } from "../stripeClientFx";
import { bundleExpireFx } from "./bundleExpireFx";
import { bundleGrantSyncFx } from "./bundleGrantSyncFx";
import { subscriptionSyncFx } from "./subscriptionSyncFx";

export namespace checkoutSessionSyncFx {
	export interface Props {
		/**
		 * Checkout Session ID to refetch from Stripe.
		 */
		id: string;
		/**
		 * Event timestamp used if the current Stripe state says the one-off purchase is
		 * no longer valid.
		 */
		expiresAt: Date;
	}
}

/**
 * Syncs the latest state of one Stripe Checkout Session into local resources.
 *
 * Webhooks can arrive out of order, so this Fx does not trust the event payload. It
 * refetches the session, checks the linked PaymentIntent/Charge for refund state,
 * and then either materializes one-off purchase bundles or expires them.
 */
export const checkoutSessionSyncFx = Effect.fn("checkoutSessionSyncFx")(function* ({
	id,
	expiresAt,
}: checkoutSessionSyncFx.Props) {
	const logger = yield* getLoggerFx("checkoutSessionSyncFx");
	logger.trace("checkoutSessionSyncFx", {
		id,
	});

	const stripe = yield* stripeClientFx();
	const session = yield* Effect.tryPromise({
		try() {
			return stripe.checkout.sessions.retrieve(id);
		},
		catch(error) {
			return new RuntimeErrorFx({
				message: "Stripe checkout session retrieval failed",
				cause: error,
			});
		},
	});
	const subscriptionId = match(session.subscription)
		.with(P.string, (subscription) => subscription)
		.with(
			{
				id: P.string,
			},
			(subscription) => subscription.id,
		)
		.otherwise(() => null);
	const subscription = subscriptionId
		? yield* subscriptionSyncFx({
				subscription: subscriptionId,
			})
		: null;

	/*
	 * Subscription checkout sessions are handled by subscriptionSyncFx. One-off grant
	 * bundles are only for payment-mode Checkout Sessions.
	 */
	if (subscriptionId || session.mode !== "payment") {
		return {
			subscription,
			oneOffs: [],
		};
	}

	const paymentIntentId = match(session.payment_intent)
		.with(P.string, (paymentIntent) => paymentIntent)
		.with(
			{
				id: P.string,
			},
			(paymentIntent) => paymentIntent.id,
		)
		.otherwise(() => null);
	/*
	 * Checkout Session payment_status remains paid after some refund flows. The linked
	 * PaymentIntent's latest charge is the practical source for deciding whether our
	 * local one-off purchase should be expired.
	 */
	const paymentIntent = paymentIntentId
		? yield* Effect.tryPromise({
				try() {
					return stripe.paymentIntents.retrieve(paymentIntentId, {
						expand: [
							"latest_charge",
						],
					});
				},
				catch(error) {
					return new RuntimeErrorFx({
						message: "Stripe payment intent retrieval failed",
						cause: error,
					});
				},
			})
		: null;
	const isRefunded = match(paymentIntent?.latest_charge)
		.with(
			{
				refunded: true,
			},
			() => true,
		)
		.with(
			{
				amount_refunded: P.when((amount) => amount > 0),
			},
			() => true,
		)
		.otherwise(() => false);
	const shouldExpire =
		session.payment_status !== "paid" ||
		session.status === "expired" ||
		paymentIntent?.status === "canceled" ||
		isRefunded;
	const userId = session.client_reference_id ?? session.metadata?.userId ?? null;

	if (!userId) {
		logger.warn("Cannot resolve userId from a Stripe checkout session", {
			id: session.id,
		});

		return yield* new SyncSkippedFx({
			message: "Stripe checkout session user is missing",
			reason: "checkout user missing",
			cause: {
				sessionId: session.id,
			},
		});
	}

	const lineItems = yield* Effect.tryPromise({
		try() {
			return stripe.checkout.sessions.listLineItems(session.id, {
				expand: [
					"data.price.product",
				],
				limit: 100,
			});
		},
		catch(error) {
			return new RuntimeErrorFx({
				message: "Stripe checkout line item retrieval failed",
				cause: error,
			});
		},
	});
	const oneOffs = yield* Effect.forEach(
		lineItems.data.flatMap((lineItem) => {
			const priceProduct = lineItem.price?.product;
			/*
			 * Prefer line item metadata, then price metadata, then expanded product metadata.
			 * This keeps Stripe product setup flexible while still resolving to one local
			 * source resource bundle.
			 */
			const productBundle = match(priceProduct)
				.with(
					{
						metadata: {
							bundle: P.string,
						},
					},
					(product) => product.metadata.bundle,
				)
				.otherwise(() => null);
			const bundle =
				lineItem.metadata?.bundle ?? lineItem.price?.metadata.bundle ?? productBundle;

			if (!bundle) {
				return [];
			}

			return [
				{
					bundle,
					key: `stripe:checkout-session-line-item:${session.id}:${lineItem.id}`,
				},
			];
		}),
		(lineItem) =>
			(shouldExpire
				? bundleExpireFx({
						key: lineItem.key,
						expiresAt,
					})
				: bundleGrantSyncFx({
						userId,
						bundle: lineItem.bundle,
						key: lineItem.key,
						createdAt: DateTime.fromSeconds(session.created).toJSDate(),
					})
			).pipe(Effect.catchTag("SyncSkippedFx", () => Effect.succeed(null))),
	);

	return {
		subscription,
		oneOffs,
	};
});

export type checkoutSessionSyncFx = ReturnType<typeof checkoutSessionSyncFx>;
