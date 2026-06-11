import { Effect } from "effect";
import { DateTime } from "luxon";
import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { genId } from "@/lib/common/gen-id";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { subscriptionCancelFx } from "~/user/stripe/server/fx/subscriptionCancelFx";
import { subscriptionSyncFx } from "~/user/stripe/server/fx/sync/subscriptionSyncFx";

const stripeSecret = process.env.SERVER_STRIPE_SECRET;
const liveIt = stripeSecret ? it : it.skip;

describe("subscriptionCancelFx", () => {
	liveIt("cancels renewal but keeps the paid period active locally", async () => {
		if (!stripeSecret) {
			throw new Error("SERVER_STRIPE_SECRET is required");
		}

		const database = await testabase("stripe-subscription-cancel-renewal");
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
							"name",
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
							bundle: resourceBundle.name,
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

				yield* subscriptionSyncFx({
					subscription: subscription.id,
				});

				const result = yield* subscriptionCancelFx({
					userId: buyer.id,
					bundle: "package:buyer",
				});
				const stripeSubscription = yield* Effect.promise(() => {
					return stripe.subscriptions.retrieve(subscription.id);
				});
				const bundle = yield* Effect.promise(() => {
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

				expect(stripeSubscription.cancel_at_period_end).toBe(true);
				expect(result.expiresAt).toBeInstanceOf(Date);
				expect(bundle.expiresAt).toBeInstanceOf(Date);
			}).pipe(
				withRuntimeFx(database),
				withStripeConfigFx({
					secret: stripeSecret,
					webhook: "whsec_test",
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
	});
});
