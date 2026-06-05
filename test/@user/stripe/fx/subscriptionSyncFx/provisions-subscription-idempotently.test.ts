import { Effect } from "effect";
import { DateTime } from "luxon";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { genId } from "@/lib/common/gen-id";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { withStripeConfigFx } from "~/user/stripe/server/context/withStripeConfigFx";
import { withStripConfigEnv } from "~/user/stripe/server/env/withStripConfigEnv";
import { subscriptionSyncFx } from "~/user/stripe/server/fx/sync/subscriptionSyncFx";

const stripeMocks = vi.hoisted(() => {
	return {
		subscriptionRetrieve: vi.fn(),
	};
});

vi.mock("~/user/stripe/server/fx/stripeClientFx", async () => {
	const { Effect } = await import("effect");

	return {
		stripeClientFx: () =>
			Effect.succeed({
				subscriptions: {
					retrieve: stripeMocks.subscriptionRetrieve,
				},
			}),
	};
});

const customerId = "cus_test_buyer";
const subscriptionId = "sub_test_buyer";
const priceId = "price_1TdDMEJL7ONbiZVohUfwCus6";

describe("subscriptionSyncFx", () => {
	beforeEach(() => {
		stripeMocks.subscriptionRetrieve.mockReset();
	});

	it("provisions buyer bundle idempotently", async () => {
		const database = await testabase("stripe-subscription-sync-buyer");
		stripeMocks.subscriptionRetrieve.mockResolvedValue({
			id: subscriptionId,
			customer: customerId,
			status: "active",
			cancel_at_period_end: false,
			cancel_at: null,
			canceled_at: null,
			ended_at: null,
			metadata: {
				bundle: "package:buyer",
			},
			items: {
				data: [
					{
						current_period_end: 1_820_000_000,
						price: {
							id: priceId,
							metadata: {
								bundle: "package:buyer",
							},
						},
					},
				],
			},
		});

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const now = DateTime.fromISO("2026-06-02T10:00:00.000Z").toJSDate();

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

			yield* subscriptionSyncFx({
				subscription: subscriptionId,
			});
			yield* subscriptionSyncFx({
				subscription: subscriptionId,
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

	it("expires buyer bundle at period end when cancellation is scheduled", async () => {
		const database = await testabase("stripe-subscription-sync-cancel-period-end");
		stripeMocks.subscriptionRetrieve
			.mockResolvedValueOnce({
				id: subscriptionId,
				customer: customerId,
				status: "active",
				cancel_at_period_end: false,
				cancel_at: null,
				canceled_at: null,
				ended_at: null,
				metadata: {
					bundle: "package:buyer",
				},
				items: {
					data: [
						{
							current_period_end: 1_820_000_000,
							price: {
								id: priceId,
								metadata: {
									bundle: "package:buyer",
								},
							},
						},
					],
				},
			})
			.mockResolvedValueOnce({
				id: subscriptionId,
				customer: customerId,
				status: "active",
				cancel_at_period_end: true,
				cancel_at: null,
				canceled_at: null,
				ended_at: null,
				metadata: {
					bundle: "package:buyer",
				},
				items: {
					data: [
						{
							current_period_end: 1_820_000_000,
							price: {
								id: priceId,
								metadata: {
									bundle: "package:buyer",
								},
							},
						},
					],
				},
			});

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const now = DateTime.fromISO("2026-06-02T10:00:00.000Z").toJSDate();

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

			yield* subscriptionSyncFx({
				subscription: subscriptionId,
			});
			yield* subscriptionSyncFx({
				subscription: subscriptionId,
			});

			const buyerBundle = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.select([
						"urb.expiresAt",
						"rb.name",
					])
					.where("urb.userId", "=", buyer.id)
					.where("rb.name", "=", "package:buyer")
					.executeTakeFirst();
			});

			expect(buyerBundle).toEqual({
				expiresAt: DateTime.fromISO("2027-09-03T19:33:20.000Z").toJSDate(),
				name: "package:buyer",
			});
		}).pipe(
			withRuntimeFx(database),
			withStripeConfigFx(withStripConfigEnv()),
			Effect.runPromise,
		);
	});

	it("expires buyer bundle immediately when subscription is canceled immediately", async () => {
		const database = await testabase("stripe-subscription-sync-cancel-now");
		stripeMocks.subscriptionRetrieve
			.mockResolvedValueOnce({
				id: subscriptionId,
				customer: customerId,
				status: "active",
				cancel_at_period_end: false,
				cancel_at: null,
				canceled_at: null,
				ended_at: null,
				metadata: {
					bundle: "package:buyer",
				},
				items: {
					data: [
						{
							current_period_end: 1_820_000_000,
							price: {
								id: priceId,
								metadata: {
									bundle: "package:buyer",
								},
							},
						},
					],
				},
			})
			.mockResolvedValueOnce({
				id: subscriptionId,
				customer: customerId,
				status: "canceled",
				cancel_at_period_end: false,
				cancel_at: null,
				canceled_at: 1_717_000_000,
				ended_at: null,
				metadata: {
					bundle: "package:buyer",
				},
				items: {
					data: [
						{
							current_period_end: 1_820_000_000,
							price: {
								id: priceId,
								metadata: {
									bundle: "package:buyer",
								},
							},
						},
					],
				},
			});

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const now = DateTime.fromISO("2026-06-02T10:00:00.000Z").toJSDate();

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

			yield* subscriptionSyncFx({
				subscription: subscriptionId,
			});
			yield* subscriptionSyncFx({
				subscription: subscriptionId,
			});

			const buyerBundle = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.select([
						"urb.expiresAt",
						"rb.name",
					])
					.where("urb.userId", "=", buyer.id)
					.where("rb.name", "=", "package:buyer")
					.executeTakeFirst();
			});

			expect(buyerBundle).toEqual({
				expiresAt: DateTime.fromISO("2024-05-29T16:26:40.000Z").toJSDate(),
				name: "package:buyer",
			});
		}).pipe(
			withRuntimeFx(database),
			withStripeConfigFx(withStripConfigEnv()),
			Effect.runPromise,
		);
	});
});
