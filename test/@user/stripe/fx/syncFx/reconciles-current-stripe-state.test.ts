import { Effect } from "effect";
import { DateTime } from "luxon";
import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { genId } from "@/lib/common/gen-id";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { syncFx } from "~/user/stripe/server/fx/sync/syncFx";

const stripeSecret = process.env.SERVER_STRIPE_SECRET;
const liveIt = stripeSecret ? it : it.skip;

type StripeCleanup = {
	customerIds: string[];
	priceIds: string[];
	productIds: string[];
	subscriptionIds: string[];
};

const cleanupStripe = async (stripe: Stripe, cleanup: StripeCleanup) => {
	await Promise.allSettled(
		cleanup.subscriptionIds.map((subscriptionId) => {
			return stripe.subscriptions.cancel(subscriptionId);
		}),
	);
	await Promise.allSettled(
		cleanup.priceIds.map((priceId) => {
			return stripe.prices.update(priceId, {
				active: false,
			});
		}),
	);
	await Promise.allSettled(
		cleanup.productIds.map((productId) => {
			return stripe.products.update(productId, {
				active: false,
			});
		}),
	);
	await Promise.allSettled(
		cleanup.customerIds.map((customerId) => {
			return stripe.customers.del(customerId);
		}),
	);
};

describe("syncFx", () => {
	liveIt("reconciles live Stripe customer state through list and retrieve calls", async () => {
		if (!stripeSecret) {
			throw new Error("SERVER_STRIPE_SECRET is required");
		}

		const database = await testabase("stripe-sync-engine-live-current-state");
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

				yield* syncFx({
					customerId: customer.id,
				});

				const subscriptionBundle = yield* Effect.promise(() => {
					return database.kysely
						.selectFrom("user_resource_bundle as urb")
						.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
						.select([
							"rb.name",
							"urb.expiresAt",
						])
						.where("urb.userId", "=", buyer.id)
						.where("rb.name", "=", "package:buyer")
						.executeTakeFirstOrThrow();
				});

				expect(subscriptionBundle).toEqual({
					name: "package:buyer",
					expiresAt: null,
				});
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

	liveIt(
		"keeps a bundle active while another subscription for the same bundle is live",
		async () => {
			if (!stripeSecret) {
				throw new Error("SERVER_STRIPE_SECRET is required");
			}

			const database = await testabase("stripe-sync-multiple-subscriptions");
			const stripe = new Stripe(stripeSecret);
			const cleanup: StripeCleanup = {
				customerIds: [],
				priceIds: [],
				productIds: [],
				subscriptionIds: [],
			};

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
					cleanup.customerIds.push(customer.id);

					const subscriptionMetadata = {
						bundle: "package:buyer",
						resourceBundleId: resourceBundle.id,
					};
					const activeSubscription = yield* Effect.promise(() => {
						return stripe.subscriptions.create({
							customer: customer.id,
							items: [
								{
									price: price.id,
								},
							],
							metadata: subscriptionMetadata,
							trial_period_days: 1,
						});
					});
					cleanup.subscriptionIds.push(activeSubscription.id);
					const canceledSubscription = yield* Effect.promise(() => {
						return stripe.subscriptions.create({
							customer: customer.id,
							items: [
								{
									price: price.id,
								},
							],
							metadata: subscriptionMetadata,
							trial_period_days: 1,
						});
					});
					cleanup.subscriptionIds.push(canceledSubscription.id);

					yield* Effect.promise(() => {
						return stripe.subscriptions.cancel(canceledSubscription.id);
					});
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

					yield* syncFx({
						customerId: customer.id,
					});

					const activeBundle = yield* Effect.promise(() => {
						return database.kysely
							.selectFrom("user_resource_bundle as urb")
							.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
							.innerJoin(
								"user_resource_bundle_stripe as urbs",
								"urbs.userResourceBundleId",
								"urb.id",
							)
							.select([
								"rb.name",
								"urb.expiresAt",
								"urbs.subscriptionId",
							])
							.where("urb.userId", "=", buyer.id)
							.where("rb.name", "=", "package:buyer")
							.executeTakeFirstOrThrow();
					});

					yield* Effect.promise(() => {
						return stripe.subscriptions.cancel(activeSubscription.id);
					});
					yield* syncFx({
						customerId: customer.id,
					});

					const expiredBundle = yield* Effect.promise(() => {
						return database.kysely
							.selectFrom("user_resource_bundle as urb")
							.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
							.select([
								"urb.expiresAt",
							])
							.where("urb.userId", "=", buyer.id)
							.where("rb.name", "=", "package:buyer")
							.executeTakeFirstOrThrow();
					});

					expect(activeBundle).toEqual({
						name: "package:buyer",
						expiresAt: null,
						subscriptionId: activeSubscription.id,
					});
					expect(expiredBundle.expiresAt).toBeInstanceOf(Date);
				}).pipe(
					withRuntimeFx(database),
					withStripeConfigFx({
						secret: stripeSecret,
						webhook: "whsec_test",
					}),
					Effect.runPromise,
				);
			} finally {
				await cleanupStripe(stripe, cleanup);
			}
		},
	);

	liveIt("syncs a subscription that carries multiple Stripe items", async () => {
		if (!stripeSecret) {
			throw new Error("SERVER_STRIPE_SECRET is required");
		}

		const database = await testabase("stripe-sync-multiple-subscription-items");
		const stripe = new Stripe(stripeSecret);
		const cleanup: StripeCleanup = {
			customerIds: [],
			priceIds: [],
			productIds: [],
			subscriptionIds: [],
		};

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
				const [buyerPrice] = prices.data;

				if (!buyerPrice) {
					throw new Error("Expected package:buyer Stripe price");
				}

				const supportProduct = yield* Effect.promise(() => {
					return stripe.products.create({
						name: "Zbav se.me buyer support add-on",
						metadata: {
							source: "stripe-sync-multiple-subscription-items",
						},
					});
				});
				cleanup.productIds.push(supportProduct.id);
				const supportPrice = yield* Effect.promise(() => {
					return stripe.prices.create({
						currency: "czk",
						product: supportProduct.id,
						recurring: {
							interval: "month",
						},
						unit_amount: 4900,
					});
				});
				cleanup.priceIds.push(supportPrice.id);

				const customer = yield* Effect.promise(() => {
					return stripe.customers.create({
						metadata: {
							userId: buyer.id,
						},
					});
				});
				cleanup.customerIds.push(customer.id);
				const subscription = yield* Effect.promise(() => {
					return stripe.subscriptions.create({
						customer: customer.id,
						items: [
							{
								price: buyerPrice.id,
							},
							{
								price: supportPrice.id,
							},
						],
						metadata: {
							bundle: "package:buyer",
							resourceBundleId: resourceBundle.id,
						},
						trial_period_days: 1,
					});
				});
				cleanup.subscriptionIds.push(subscription.id);

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

				yield* syncFx({
					customerId: customer.id,
				});

				const subscriptionBundle = yield* Effect.promise(() => {
					return database.kysely
						.selectFrom("user_resource_bundle as urb")
						.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
						.innerJoin(
							"user_resource_bundle_stripe as urbs",
							"urbs.userResourceBundleId",
							"urb.id",
						)
						.select([
							"rb.name",
							"urb.expiresAt",
							"urbs.subscriptionId",
						])
						.where("urb.userId", "=", buyer.id)
						.where("rb.name", "=", "package:buyer")
						.executeTakeFirstOrThrow();
				});
				const syncedSubscription = yield* Effect.promise(() => {
					return stripe.subscriptions.retrieve(subscription.id);
				});

				expect(syncedSubscription.items.data).toHaveLength(2);
				expect(subscriptionBundle).toEqual({
					name: "package:buyer",
					expiresAt: null,
					subscriptionId: subscription.id,
				});
			}).pipe(
				withRuntimeFx(database),
				withStripeConfigFx({
					secret: stripeSecret,
					webhook: "whsec_test",
				}),
				Effect.runPromise,
			);
		} finally {
			await cleanupStripe(stripe, cleanup);
		}
	});
});
