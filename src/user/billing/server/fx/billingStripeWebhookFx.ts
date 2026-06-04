import { Effect } from "effect";
import type Stripe from "stripe";
import { match } from "ts-pattern";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { NoticeSchema } from "@/lib/common/schema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { subscriptionFetchFx } from "~/user/stripe/server/fx/subscriptionFetchFx";
import { StripeConfigFx } from "../context/StripeConfigFx";
import { billingSubscriptionSyncFx } from "./billingSubscriptionSyncFx";
import { eventCompletedFx } from "./event/checkout/session/eventCompletedFx";
import { stripeClientFx } from "./stripeClientFx";

export namespace billingStripeWebhookFx {
	export interface Props {
		signature: string;
		content(): Promise<string>;
	}
}

export const billingStripeWebhookFx = Effect.fn("billingStripeWebhookFx")(function* ({
	signature,
	content,
}: billingStripeWebhookFx.Props) {
	const logger = yield* getLoggerFx("billingStripeWebhookFx");
	logger.trace("billingStripeWebhookFx");

	const stripeConfig = yield* StripeConfigFx;
	const stripe = yield* stripeClientFx();
	const event = yield* Effect.tryPromise({
		try: async () => {
			return stripe.webhooks.constructEvent(await content(), signature, stripeConfig.webhook);
		},
		catch(error) {
			logger.warn("Invalid Stripe webhook signature", {
				error,
			});

			return new RuntimeErrorFx({
				message: "Invalid Stripe webhook signature",
				cause: error,
			});
		},
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateContext = yield* DateContextFx;

			const stripeEvent = yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("stripe_event")
					.values({
						id: genId(),
						eventId: event.id,
						type: event.type,
						payload: event as unknown as Record<string, unknown>,
						createdAt: dateContext.now().toJSDate(),
						processedAt: null,
					})
					.onConflict((oc) => {
						return oc.column("eventId").doNothing();
					})
					.returning([
						"id",
						"processedAt",
					])
					.executeTakeFirst();
			});

			if (!stripeEvent) {
				return {
					type: "warning",
					message: `Duplicate event [${event.type}]`,
				} satisfies NoticeSchema.Type;
			}

			yield* processStripeEventFx(event);

			yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("stripe_event")
					.set({
						processedAt: dateContext.now().toJSDate(),
					})
					.where("id", "=", stripeEvent.id)
					.execute();
			});

			return {
				type: "info",
				message: "Success",
			} satisfies NoticeSchema.Type;
		}),
	);
});

/**
 * TODO: we've ts-pattern, use it
 * TODO: split individual events
 * TODO: split into individual files, this is huge piece of crap now
 */
const processStripeEventFx = Effect.fn("processStripeEventFx")(function* (event: Stripe.Event) {
	/**
	 * TODO: What about to simplify the whole event stuff just to sync user's stuff from Stripe, including one-off items?
	 * TODO: there is also "charge.succeeded" so we need to use most minimal stripe setup
	 * TODO: do we've to handle invoice paid too, if we've session.completed?
	 */

	return yield* match(event)
		.with(
			{
				type: "customer.subscription.created",
			},
			{
				type: "customer.subscription.updated",
			},
			{
				type: "customer.subscription.deleted",
			},
			(event) => {
				return billingSubscriptionSyncFx({
					subscription: event.data.object,
				});
			},
		)
		.with(
			{
				type: "checkout.session.completed",
			},
			(event) => {
				return eventCompletedFx({
					event,
				});
			},
		)
		.with(
			{
				type: "invoice.paid",
			},
			(event) => {
				return Effect.gen(function* () {
					return yield* billingSubscriptionSyncFx({
						subscription: yield* subscriptionFetchFx({
							id: event.data.object.subscription,
						}),
					});
				});
			},
		)
		.otherwise(() => Effect.void);
});

export type billingStripeWebhookFx = ReturnType<typeof billingStripeWebhookFx>;
