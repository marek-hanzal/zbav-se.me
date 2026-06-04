import { Effect } from "effect";
import type Stripe from "stripe";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import type { NoticeSchema } from "@/lib/common/schema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { billingSubscriptionSyncFx } from "./billingSubscriptionSyncFx";
import { eventCompletedFx } from "./event/checkout/session/eventCompletedFx";
import { stripeClientFx } from "./stripeClientFx";

interface InvoiceSubscriptionFields {
	subscription?:
		| string
		| {
				id: string;
		  }
		| null;
}

const toCheckoutBundleNames = (lineItems: Stripe.LineItem[]) => {
	const bundleNames = lineItems.flatMap((lineItem) => {
		const price = lineItem.price;
		const product = price?.product;

		return [
			lineItem.metadata?.bundle,
			price?.metadata.bundle,
			typeof product === "object" && !product.deleted ? product.metadata.bundle : null,
		].filter((bundle): bundle is string => Boolean(bundle));
	});

	return [
		...new Set(bundleNames),
	];
};

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
		yield* eventCompletedFx({
			event,
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
