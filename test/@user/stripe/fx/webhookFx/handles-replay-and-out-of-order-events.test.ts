import { Effect } from "effect";
import { DateTime } from "luxon";
import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { genId } from "@/lib/common/gen-id";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { webhookFx } from "~/user/stripe/server/fx/webhookFx";

const stripeSecret = process.env.SERVER_STRIPE_SECRET;
const webhookSecret = "whsec_test";
const liveIt = stripeSecret ? it : it.skip;

interface WebhookEventInput {
	customerId: string;
	eventId: string;
	objectId: string;
	type: string;
}

const signedWebhook = (stripe: Stripe, input: WebhookEventInput) => {
	const payload = JSON.stringify({
		id: input.eventId,
		object: "event",
		api_version: "2026-06-30.preview",
		created: 1_801_398_000,
		data: {
			object: {
				id: input.objectId,
				object: "subscription",
				customer: input.customerId,
			},
		},
		livemode: false,
		pending_webhooks: 1,
		request: null,
		type: input.type,
	});
	const signature = stripe.webhooks.generateTestHeaderString({
		payload,
		secret: webhookSecret,
	});

	return {
		payload,
		signature,
	};
};

describe("webhookFx", () => {
	liveIt(
		"stores replayed events once and reconciles out-of-order events from current Stripe state",
		async () => {
			if (!stripeSecret) {
				throw new Error("SERVER_STRIPE_SECRET is required");
			}

			const database = await testabase("stripe-webhook-replay-out-of-order");
			const stripe = new Stripe(stripeSecret);
			const customerIds: string[] = [];
			const subscriptionIds: string[] = [];

			try {
				return await Effect.gen(function* () {
					const { buyer } = yield* createUsersFx({});
					const now = DateTime.fromISO("2026-06-02T10:00:00.000Z").toJSDate();
					const resourceBundle = yield* Effect.promise(() => {
						return database.kysely
							.selectFrom("resource_bundle")
							.select([
								"id",
							])
							.where("name", "=", "package:buyer")
							.executeTakeFirstOrThrow();
					});
					const prices = yield* Effect.promise(() => {
						return stripe.prices.list({
							active: true,
							lookup_keys: [
								"package:buyer",
							],
							limit: 2,
						});
					});
					const [price] = prices.data;

					if (!price) {
						throw new Error("Expected package:buyer Stripe price");
					}

					const customer = yield* Effect.promise(() => {
						return stripe.customers.create({
							metadata: {
								userId: buyer.id,
							},
						});
					});
					customerIds.push(customer.id);
					const subscription = yield* Effect.promise(() => {
						return stripe.subscriptions.create({
							customer: customer.id,
							items: [
								{
									price: price.id,
								},
							],
							metadata: {
								bundle: "package:buyer",
								resourceBundleId: resourceBundle.id,
							},
							trial_period_days: 1,
						});
					});
					subscriptionIds.push(subscription.id);

					yield* Effect.promise(() => {
						return database.kysely
							.insertInto("user_stripe")
							.values({
								id: genId(),
								userId: buyer.id,
								customerId: customer.id,
								createdAt: now,
							})
							.execute();
					});

					const deletedEvent = signedWebhook(stripe, {
						customerId: customer.id,
						eventId: "evt_test_deleted_replayed",
						objectId: subscription.id,
						type: "customer.subscription.deleted",
					});

					yield* webhookFx({
						signature: deletedEvent.signature,
						content() {
							return Promise.resolve(deletedEvent.payload);
						},
					});
					const replayResult = yield* webhookFx({
						signature: deletedEvent.signature,
						content() {
							return Promise.resolve(deletedEvent.payload);
						},
					});

					const activeBundle = yield* Effect.promise(() => {
						return database.kysely
							.selectFrom("user_resource_bundle as assignment")
							.innerJoin(
								"resource_bundle as bundle",
								"bundle.id",
								"assignment.resourceBundleId",
							)
							.select([
								"bundle.name",
								"assignment.expiresAt",
							])
							.where("assignment.userId", "=", buyer.id)
							.where("bundle.name", "=", "package:buyer")
							.executeTakeFirstOrThrow();
					});
					const replayedEventRows = yield* Effect.promise(() => {
						return database.kysely
							.selectFrom("stripe_event")
							.select(({ fn }) => [
								fn.countAll<string>().as("count"),
							])
							.where("eventId", "=", "evt_test_deleted_replayed")
							.executeTakeFirstOrThrow();
					});

					yield* Effect.promise(() => {
						return stripe.subscriptions.cancel(subscription.id);
					});

					const staleCreatedEvent = signedWebhook(stripe, {
						customerId: customer.id,
						eventId: "evt_test_created_stale",
						objectId: subscription.id,
						type: "customer.subscription.created",
					});
					yield* webhookFx({
						signature: staleCreatedEvent.signature,
						content() {
							return Promise.resolve(staleCreatedEvent.payload);
						},
					});

					const expiredBundle = yield* Effect.promise(() => {
						return database.kysely
							.selectFrom("user_resource_bundle as assignment")
							.innerJoin(
								"resource_bundle as bundle",
								"bundle.id",
								"assignment.resourceBundleId",
							)
							.select([
								"assignment.expiresAt",
							])
							.where("assignment.userId", "=", buyer.id)
							.where("bundle.name", "=", "package:buyer")
							.executeTakeFirstOrThrow();
					});
					const processedEvents = yield* Effect.promise(() => {
						return database.kysely
							.selectFrom("stripe_event")
							.select(({ fn }) => [
								fn.countAll<string>().as("count"),
							])
							.where("processedAt", "is not", null)
							.executeTakeFirstOrThrow();
					});

					expect(activeBundle).toEqual({
						name: "package:buyer",
						expiresAt: null,
					});
					expect(replayResult).toEqual({
						type: "warning",
						message: "Duplicate event [customer.subscription.deleted]",
					});
					expect(Number(replayedEventRows.count)).toBe(1);
					expect(expiredBundle.expiresAt).toBeInstanceOf(Date);
					expect(Number(processedEvents.count)).toBe(2);
				}).pipe(
					withRuntimeFx(database),
					withStripeConfigFx({
						secret: stripeSecret,
						webhook: webhookSecret,
					}),
					Effect.runPromise,
				);
			} finally {
				await Promise.allSettled(
					subscriptionIds.map((subscriptionId) => {
						return stripe.subscriptions.cancel(subscriptionId);
					}),
				);
				await Promise.allSettled(
					customerIds.map((customerId) => {
						return stripe.customers.del(customerId);
					}),
				);
			}
		},
	);
});
