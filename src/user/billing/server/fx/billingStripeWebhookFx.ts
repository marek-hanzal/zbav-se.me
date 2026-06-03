import { Effect } from "effect";
import type Stripe from "stripe";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { billingSubscriptionSyncFx } from "./billingSubscriptionSyncFx";
import { stripeClientFx } from "./stripeClientFx";

interface InvoiceSubscriptionFields {
	subscription?:
		| string
		| {
				id: string;
		  }
		| null;
}

export namespace billingStripeWebhookFx {
	export interface Props {
		event: Stripe.Event;
	}
}

export const billingStripeWebhookFx = Effect.fn("billingStripeWebhookFx")(function* ({
	event,
}: billingStripeWebhookFx.Props) {
	const logger = yield* getLoggerFx("billingStripeWebhookFx");
	logger.trace("billingStripeWebhookFx", {
		eventId: event.id,
		type: event.type,
	});

	const dateContext = yield* DateContextFx;
	const now = dateContext.now().toJSDate();

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const stripeEvent = yield* dbFx(async (kysely) => {
				return kysely
					.insertInto("stripe_event")
					.values({
						id: genId(),
						eventId: event.id,
						type: event.type,
						payload: event as unknown as Record<string, unknown>,
						createdAt: now,
						processedAt: null,
					})
					.onConflict((oc) => oc.column("eventId").doNothing())
					.returning([
						"id",
						"processedAt",
					])
					.executeTakeFirst();
			});

			if (!stripeEvent) {
				return {
					processed: false,
				};
			}

			yield* processStripeEventFx(event);

			yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("stripe_event")
					.set({
						processedAt: now,
					})
					.where("id", "=", stripeEvent.id)
					.execute();
			});

			return {
				processed: true,
			};
		}),
	);
});

/**
 * TODO: we've ts-pattern, use it
 * TODO: split individual events
 * TODO: split into individual files, this is huge piece of crap now
 */
const processStripeEventFx = Effect.fn("processStripeEventFx")(function* (event: Stripe.Event) {
	if (
		event.type === "customer.subscription.created" ||
		event.type === "customer.subscription.updated" ||
		event.type === "customer.subscription.deleted"
	) {
		const subscription = event.data.object as Stripe.Subscription;
		return yield* billingSubscriptionSyncFx({
			subscription,
		});
	}

	if (event.type === "checkout.session.completed") {
		const stripe = yield* stripeClientFx();
		const session = event.data.object as Stripe.Checkout.Session;

		if (!session.subscription) {
			return;
		}

		const subscriptionId =
			typeof session.subscription === "string"
				? session.subscription
				: session.subscription.id;
		const subscription = yield* Effect.tryPromise({
			try() {
				return stripe.subscriptions.retrieve(subscriptionId);
			},
			catch(error) {
				return new RuntimeErrorFx({
					message: "Stripe subscription retrieval failed",
					cause: error,
				});
			},
		});

		return yield* billingSubscriptionSyncFx({
			subscription,
		});
	}

	if (event.type === "invoice.paid") {
		const stripe = yield* stripeClientFx();
		const invoice = event.data.object as Stripe.Invoice;
		const invoiceSubscriptionFields = invoice as InvoiceSubscriptionFields;
		const subscriptionId =
			typeof invoiceSubscriptionFields.subscription === "string"
				? invoiceSubscriptionFields.subscription
				: invoiceSubscriptionFields.subscription?.id;

		if (!subscriptionId) {
			return;
		}

		const subscription = yield* Effect.tryPromise({
			try() {
				return stripe.subscriptions.retrieve(subscriptionId);
			},
			catch(error) {
				return new RuntimeErrorFx({
					message: "Stripe subscription retrieval failed",
					cause: error,
				});
			},
		});

		return yield* billingSubscriptionSyncFx({
			subscription,
		});
	}
});

export type billingStripeWebhookFx = ReturnType<typeof billingStripeWebhookFx>;
