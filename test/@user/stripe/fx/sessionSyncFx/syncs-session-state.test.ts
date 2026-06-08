import { Effect, Either } from "effect";
import { DateTime } from "luxon";
import Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { sessionSyncFx } from "~/user/stripe/server/fx/sync/sessionSyncFx";

const stripeSecret = process.env.SERVER_STRIPE_SECRET;
const liveIt = stripeSecret ? it : it.skip;

describe("sessionSyncFx", () => {
	liveIt("fails loudly when live payment session is missing bundleKey metadata", async () => {
		if (!stripeSecret) {
			throw new Error("SERVER_STRIPE_SECRET is required");
		}

		const database = await testabase("stripe-session-sync-live-missing-bundle-key");
		const stripe = new Stripe(stripeSecret);
		const sessionIds: string[] = [];

		try {
			const { buyer } = await Effect.gen(function* () {
				return yield* createUsersFx({});
			}).pipe(withRuntimeFx(database), Effect.runPromise);
			const resourceBundle = await database.kysely
				.selectFrom("resource_bundle")
				.select([
					"id",
				])
				.where("name", "=", "package:buyer")
				.executeTakeFirstOrThrow();
			const prices = await stripe.prices.list({
				active: true,
				lookup_keys: [
					ResourceBundleEnumSchema.enum["extra:token:small"],
				],
				limit: 2,
			});
			const [price] = prices.data;

			if (!price) {
				throw new Error(
					`Expected ${ResourceBundleEnumSchema.enum["extra:token:small"]} Stripe price`,
				);
			}

			const session = await stripe.checkout.sessions.create({
				cancel_url: "https://app.test/cancel",
				client_reference_id: buyer.id,
				line_items: [
					{
						price: price.id,
						quantity: 1,
					},
				],
				metadata: {
					bundle: "package:buyer",
					resourceBundleId: resourceBundle.id,
					userId: buyer.id,
				},
				mode: "payment",
				success_url: "https://app.test/success",
			});
			sessionIds.push(session.id);

			const result = await sessionSyncFx({
				id: session.id,
				expiresAt: DateTime.fromISO("2026-06-04T10:00:00.000Z").toJSDate(),
			}).pipe(
				withRuntimeFx(database),
				withStripeConfigFx({
					secret: stripeSecret,
					webhook: "whsec_test",
				}),
				Effect.either,
				Effect.runPromise,
			);

			expect(Either.isLeft(result)).toBe(true);
			if (!Either.isLeft(result)) {
				throw new Error("Expected missing Stripe session metadata to fail");
			}
			if (result.left._tag !== "NotFoundErrorFx") {
				throw new Error("Expected NotFoundErrorFx");
			}
			expect(result.left.resource).toBe("stripe-session-resource-bundle-metadata");
		} finally {
			await Promise.allSettled(
				sessionIds.map((sessionId) => {
					return stripe.checkout.sessions.expire(sessionId);
				}),
			);
		}
	});

	liveIt("does not open a bundle for an incomplete live payment session", async () => {
		if (!stripeSecret) {
			throw new Error("SERVER_STRIPE_SECRET is required");
		}

		const database = await testabase("stripe-session-sync-live-incomplete-noop");
		const stripe = new Stripe(stripeSecret);
		const sessionIds: string[] = [];

		try {
			const { buyer } = await Effect.gen(function* () {
				return yield* createUsersFx({});
			}).pipe(withRuntimeFx(database), Effect.runPromise);
			const resourceBundle = await database.kysely
				.selectFrom("resource_bundle")
				.select([
					"id",
				])
				.where("name", "=", "package:buyer")
				.executeTakeFirstOrThrow();
			const prices = await stripe.prices.list({
				active: true,
				lookup_keys: [
					ResourceBundleEnumSchema.enum["extra:token:small"],
				],
				limit: 2,
			});
			const [price] = prices.data;

			if (!price) {
				throw new Error(
					`Expected ${ResourceBundleEnumSchema.enum["extra:token:small"]} Stripe price`,
				);
			}

			const bundleKey = `stripe:checkout:test-${buyer.id}`;
			const session = await stripe.checkout.sessions.create({
				cancel_url: "https://app.test/cancel",
				client_reference_id: buyer.id,
				line_items: [
					{
						price: price.id,
						quantity: 1,
					},
				],
				metadata: {
					bundle: "package:buyer",
					bundleKey,
					resourceBundleId: resourceBundle.id,
					userId: buyer.id,
				},
				mode: "payment",
				success_url: "https://app.test/success",
			});
			sessionIds.push(session.id);

			await sessionSyncFx({
				id: session.id,
				expiresAt: DateTime.fromISO("2026-06-04T10:00:00.000Z").toJSDate(),
			}).pipe(
				withRuntimeFx(database),
				withStripeConfigFx({
					secret: stripeSecret,
					webhook: "whsec_test",
				}),
				Effect.runPromise,
			);

			const purchaseBundle = await database.kysely
				.selectFrom("resource_bundle")
				.select([
					"id",
				])
				.where("name", "=", bundleKey)
				.executeTakeFirst();

			expect(purchaseBundle).toBeUndefined();
		} finally {
			await Promise.allSettled(
				sessionIds.map((sessionId) => {
					return stripe.checkout.sessions.expire(sessionId);
				}),
			);
		}
	});
});
