import { Effect } from "effect";
import type Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { genId } from "@/lib/common/gen-id";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { withStripConfigEnv } from "~/user/stripe/server/env/withStripConfigEnv";
import { billingStripeWebhookFx } from "~/user/stripe/server/fx/billingStripeWebhookFx";

const customerId = "cus_test_buyer";
const subscriptionId = "sub_test_buyer";
const priceId = "price_1TdDMEJL7ONbiZVohUfwCus6";

const toSubscriptionEvent = (eventId: string): Stripe.Event =>
	({
		id: eventId,
		type: "customer.subscription.updated",
		data: {
			object: {
				id: subscriptionId,
				customer: customerId,
				status: "active",
				cancel_at_period_end: false,
				metadata: {
					bundle: "bundle:buyer",
				},
				current_period_end: 1_820_000_000,
				items: {
					data: [
						{
							price: {
								id: priceId,
								metadata: {
									bundle: "bundle:buyer",
								},
							},
						},
					],
				},
			},
		},
	}) as unknown as Stripe.Event;

const toCancelAtPeriodEndEvent = (eventId: string): Stripe.Event =>
	({
		id: eventId,
		type: "customer.subscription.updated",
		data: {
			object: {
				id: subscriptionId,
				customer: customerId,
				status: "active",
				cancel_at_period_end: true,
				metadata: {
					bundle: "bundle:buyer",
				},
				items: {
					data: [
						{
							current_period_end: 1_820_000_000,
							price: {
								id: priceId,
								metadata: {
									bundle: "bundle:buyer",
								},
							},
						},
					],
				},
			},
		},
	}) as unknown as Stripe.Event;

describe("billingStripeWebhookFx", () => {
	it("provisions buyer bundle from Stripe subscription event idempotently", async () => {
		const database = await testabase("billing-stripe-webhook-buyer");

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const now = new Date("2026-06-02T10:00:00.000Z");
			const event = toSubscriptionEvent(`evt_${genId()}`);

			yield* Effect.promise(async () => {
				await database.kysely
					.insertInto("user_stripe")
					.values({
						id: genId(),
						userId: buyer.id,
						customerId,
						createdAt: now,
					})
					.execute();
			});

			const first = yield* billingStripeWebhookFx({
				event,
			});
			const second = yield* billingStripeWebhookFx({
				event,
			});

			const buyerBundles = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.select([
						"urb.expiresAt",
						"rb.name",
					])
					.where("urb.userId", "=", buyer.id)
					.where("rb.name", "=", "package:buyer")
					.execute();
			});
			const stripeBundleRows = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle_stripe")
					.select([
						"subscriptionId",
					])
					.where("subscriptionId", "=", subscriptionId)
					.execute();
			});

			expect(first.processed).toBe(true);
			expect(second.processed).toBe(false);
			expect(buyerBundles).toEqual([
				{
					expiresAt: null,
					name: "package:buyer",
				},
			]);
			expect(stripeBundleRows).toEqual([
				{
					subscriptionId,
				},
			]);
		}).pipe(
			withRuntimeFx(database),
			withStripeConfigFx(withStripConfigEnv()),
			Effect.runPromise,
		);
	});

	it("expires buyer bundle at period end when subscription cancellation is scheduled", async () => {
		const database = await testabase("billing-stripe-webhook-buyer-cancel-at-period-end");

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const now = new Date("2026-06-02T10:00:00.000Z");
			const activeEvent = toSubscriptionEvent(`evt_${genId()}`);
			const cancelEvent = toCancelAtPeriodEndEvent(`evt_${genId()}`);

			yield* Effect.promise(async () => {
				await database.kysely
					.insertInto("user_stripe")
					.values({
						id: genId(),
						userId: buyer.id,
						customerId,
						createdAt: now,
					})
					.execute();
			});

			yield* billingStripeWebhookFx({
				event: activeEvent,
			});
			yield* billingStripeWebhookFx({
				event: cancelEvent,
			});

			const buyerBundles = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.select([
						"urb.expiresAt",
						"rb.name",
					])
					.where("urb.userId", "=", buyer.id)
					.where("rb.name", "=", "package:buyer")
					.execute();
			});

			expect(buyerBundles).toEqual([
				{
					expiresAt: new Date("2027-09-03T19:33:20.000Z"),
					name: "package:buyer",
				},
			]);
		}).pipe(
			withRuntimeFx(database),
			withStripeConfigFx(withStripConfigEnv()),
			Effect.runPromise,
		);
	});
});
