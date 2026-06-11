import { Effect } from "effect";
import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { checkoutFx } from "~/user/stripe/server/fx/checkoutFx";

const stripeSecret = process.env.SERVER_STRIPE_SECRET;
const liveIt = stripeSecret ? it : it.skip;

describe("checkoutFx", () => {
	liveIt("creates live Stripe checkout session with sync metadata", async () => {
		if (!stripeSecret) {
			throw new Error("SERVER_STRIPE_SECRET is required");
		}

		const database = await testabase("stripe-checkout-sync-metadata");
		const stripe = new Stripe(stripeSecret);
		const sessionIds: string[] = [];
		const customerIds: string[] = [];

		try {
			return await Effect.gen(function* () {
				const { buyer } = yield* createUsersFx({});
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

				const result = yield* checkoutFx({
					userId: buyer.id,
					bundle: "package:buyer",
					locale: "cs",
					urlSuccess() {
						return "https://app.test/success";
					},
					urlCancel() {
						return "https://app.test/cancel";
					},
				});
				const userStripe = yield* Effect.promise(() => {
					return database.kysely
						.selectFrom("user_stripe")
						.select([
							"customerId",
						])
						.where("userId", "=", buyer.id)
						.executeTakeFirstOrThrow();
				});
				customerIds.push(userStripe.customerId);

				const sessions = yield* Effect.promise(() => {
					return stripe.checkout.sessions.list({
						customer: userStripe.customerId,
						limit: 10,
					});
				});
				const session = sessions.data.find((session) => {
					return session.metadata?.userId === buyer.id;
				});

				if (!session) {
					throw new Error("Expected live Stripe checkout session to exist");
				}

				sessionIds.push(session.id);

				expect(result.url).toMatch(/^https:\/\/checkout\.stripe\.com\//);
				expect(session.mode).toBe("subscription");
				expect(session.client_reference_id).toBe(buyer.id);
				expect(session.metadata).toMatchObject({
					bundle: resourceBundle.name,
					customerId: userStripe.customerId,
					resourceBundleId: resourceBundle.id,
					userId: buyer.id,
				});
				expect(session.metadata?.bundleKey).toMatch(/^stripe:checkout:/);
				expect(session.metadata?.priceId).toBeTruthy();
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
				sessionIds.map((sessionId) => {
					return stripe.checkout.sessions.expire(sessionId);
				}),
			);
			await Promise.allSettled(
				customerIds.map((customerId) => {
					return stripe.customers.del(customerId);
				}),
			);
		}
	});
	liveIt("creates live Stripe extra checkout session with sync metadata", async () => {
		if (!stripeSecret) {
			throw new Error("SERVER_STRIPE_SECRET is required");
		}

		const database = await testabase("stripe-checkout-extra-sync-metadata");
		const stripe = new Stripe(stripeSecret);
		const sessionIds: string[] = [];
		const customerIds: string[] = [];

		try {
			return await Effect.gen(function* () {
				const { buyer } = yield* createUsersFx({});
				const resourceBundle = yield* Effect.promise(() => {
					return database.kysely
						.selectFrom("resource_bundle")
						.select([
							"id",
							"name",
						])
						.where("name", "=", "extra:token:small")
						.executeTakeFirstOrThrow();
				});

				const result = yield* checkoutFx({
					userId: buyer.id,
					bundle: "extra:token:small",
					locale: "cs",
					urlSuccess() {
						return "https://app.test/success";
					},
					urlCancel() {
						return "https://app.test/cancel";
					},
				});
				const userStripe = yield* Effect.promise(() => {
					return database.kysely
						.selectFrom("user_stripe")
						.select([
							"customerId",
						])
						.where("userId", "=", buyer.id)
						.executeTakeFirstOrThrow();
				});
				customerIds.push(userStripe.customerId);

				const sessions = yield* Effect.promise(() => {
					return stripe.checkout.sessions.list({
						customer: userStripe.customerId,
						limit: 10,
					});
				});
				const session = sessions.data.find((session) => {
					return session.metadata?.userId === buyer.id;
				});

				if (!session) {
					throw new Error("Expected live Stripe extra checkout session to exist");
				}

				sessionIds.push(session.id);

				expect(result.url).toMatch(/^https:\/\/checkout\.stripe\.com\//);
				expect(session.mode).toBe("payment");
				expect(session.client_reference_id).toBe(buyer.id);
				expect(session.metadata).toMatchObject({
					bundle: resourceBundle.name,
					customerId: userStripe.customerId,
					resourceBundleId: resourceBundle.id,
					userId: buyer.id,
				});
				expect(session.metadata?.bundleKey).toMatch(/^stripe:checkout:/);
				expect(session.metadata?.priceId).toBeTruthy();
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
				sessionIds.map((sessionId) => {
					return stripe.checkout.sessions.expire(sessionId);
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
