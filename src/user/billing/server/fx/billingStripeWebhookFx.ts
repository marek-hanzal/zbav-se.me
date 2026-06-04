import { Effect } from "effect";
import type Stripe from "stripe";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { RuntimeErrorFx } from "~/server/error/RuntimeErrorFx";
import { resourceBundleEnsureFx } from "~/user/resource-bundle/server/fx/resourceBundleEnsureFx";
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
		const session = event.data.object as Stripe.Checkout.Session;
		const userId = session.client_reference_id ?? session.metadata?.userId ?? null;

		if (userId) {
			const lineItems = session.line_items
				? session.line_items.data
				: yield* Effect.gen(function* () {
						const stripe = yield* stripeClientFx();

						return yield* Effect.tryPromise({
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
									message: "Stripe checkout session line item retrieval failed",
									cause: error,
								});
							},
						});
					}).pipe(Effect.map((lineItems) => lineItems.data));
			const bundleNames = toCheckoutBundleNames(lineItems);

			if (bundleNames.length > 0) {
				const bundleItem = yield* dbFx(async (kysely) => {
					return kysely
						.selectFrom("resource_bundle as rb")
						.innerJoin("resource_bundle_item as rbi", "rbi.resourceBundleId", "rb.id")
						.select("rbi.id")
						.where("rb.name", "in", bundleNames)
						.executeTakeFirst();
				});

				if (bundleItem) {
					yield* resourceBundleEnsureFx({
						userId,
					});
				}
			}
		}

		if (!session.subscription) {
			return;
		}

		const stripe = yield* stripeClientFx();
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
