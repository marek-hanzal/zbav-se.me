import { Effect } from "effect";
import type { Stripe } from "stripe";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { stripeClientFx } from "../stripeClientFx";
import { sessionSyncFx } from "./sessionSyncFx";
import { subscriptionSyncFx } from "./subscriptionSyncFx";

type SubscriptionPriority = {
	priority: number;
	timestamp: number;
};

const subscriptionPeriodEnd = (subscription: Stripe.Subscription) => {
	return (
		subscription.items.data
			.map((item) => item.current_period_end)
			.find((periodEnd) => Boolean(periodEnd)) ??
		subscription.cancel_at ??
		subscription.ended_at ??
		subscription.canceled_at ??
		subscription.created
	);
};

const subscriptionPriority = (subscription: Stripe.Subscription): SubscriptionPriority => {
	if (subscription.status === "active" || subscription.status === "trialing") {
		return {
			priority: subscription.cancel_at_period_end ? 2 : 3,
			timestamp: subscriptionPeriodEnd(subscription),
		};
	}

	return {
		priority: 1,
		timestamp:
			subscription.ended_at ??
			subscription.canceled_at ??
			subscription.cancel_at ??
			subscription.created,
	};
};

const pickCurrentSubscription = (subscriptions: Stripe.Subscription[]) => {
	return subscriptions.toSorted((left, right) => {
		const leftPriority = subscriptionPriority(left);
		const rightPriority = subscriptionPriority(right);

		return (
			rightPriority.priority - leftPriority.priority ||
			rightPriority.timestamp - leftPriority.timestamp ||
			right.created - left.created
		);
	})[0];
};

const pickCurrentSubscriptions = (subscriptions: Stripe.Subscription[]) => {
	const subscriptionsByBundleId = Map.groupBy(subscriptions, (subscription) => {
		return subscription.metadata.resourceBundleId;
	});

	subscriptionsByBundleId.delete(undefined);
	subscriptionsByBundleId.delete("");

	return Array.from(subscriptionsByBundleId.values()).flatMap((subscriptions) => {
		const subscription = pickCurrentSubscription(subscriptions);

		return subscription
			? [
					subscription,
				]
			: [];
	});
};

export namespace syncFx {
	export interface Props {
		/**
		 * Stripe Customer ID that should be reconciled from the current Stripe API state.
		 */
		customerId: string;
	}
}

/**
 * Reconciles one Stripe customer from Stripe API state into local resources.
 *
 * Webhooks are only pings that tell us which customer changed. This Fx deliberately
 * ignores event payloads and lists current Stripe objects for the customer instead,
 * so event delivery order cannot drive local state transitions.
 */
export const syncFx = Effect.fn("syncFx")(function* ({ customerId }: syncFx.Props) {
	const logger = yield* getLoggerFx("syncFx");
	logger.trace("syncFx", {
		customerId,
	});

	const dateService = yield* DateServiceFx;
	const expiresAt = dateService.now().toJSDate();
	const stripe = yield* stripeClientFx();

	const subscriptionsSyncFx = Effect.promise(async () => {
		const subscriptions = await stripe.subscriptions.list({
			customer: customerId,
			status: "all",
			limit: 100,
		});

		return subscriptions.data;
	}).pipe(
		Effect.flatMap((subscriptions) => {
			return Effect.forEach(
				pickCurrentSubscriptions(subscriptions),
				(subscription) => {
					return subscriptionSyncFx({
						subscription: subscription.id,
					}).pipe(Effect.ignore);
				},
				{
					discard: true,
					concurrency: 4,
				},
			);
		}),
	);

	const sessionsSyncFx = Effect.promise(async () => {
		const sessions = await stripe.checkout.sessions.list({
			customer: customerId,
			limit: 100,
		});

		return sessions.data;
	}).pipe(
		Effect.flatMap((sessions) => {
			return Effect.forEach(
				sessions,
				(session) => {
					return sessionSyncFx({
						id: session.id,
						expiresAt,
					}).pipe(Effect.ignore);
				},
				{
					discard: true,
					concurrency: 4,
				},
			);
		}),
	);

	return yield* Effect.all(
		[
			subscriptionsSyncFx,
			sessionsSyncFx,
		],
		{
			discard: true,
			concurrency: 2,
		},
	);
});
