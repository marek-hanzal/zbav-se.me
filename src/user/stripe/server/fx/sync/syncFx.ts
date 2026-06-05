import { Effect } from "effect";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { stripeClientFx } from "../stripeClientFx";
import { sessionSyncFx } from "./sessionSyncFx";
import { subscriptionSyncFx } from "./subscriptionSyncFx";

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

	return Effect.all(
		[
			Effect.forEach(
				yield* Effect.promise(async () => {
					const subscriptions = await stripe.subscriptions.list({
						customer: customerId,
						status: "all",
						limit: 100,
					});
					return subscriptions.data;
				}),
				(subscription) => {
					return subscriptionSyncFx({
						subscription: subscription.id,
					}).pipe(Effect.ignore);
				},
				{
					discard: true,
					concurrency: 4,
				},
			),
			Effect.forEach(
				yield* Effect.promise(async () => {
					const sessions = await stripe.checkout.sessions.list({
						customer: customerId,
						limit: 100,
					});
					return sessions.data;
				}),
				(session) => {
					return sessionSyncFx({
						id: session.id,
						expiresAt,
					}).pipe(Effect.ignore);
				},
				{
					discard: true,
				},
			),
		],
		{
			discard: true,
		},
	);
});

export type syncFx = ReturnType<typeof syncFx>;
