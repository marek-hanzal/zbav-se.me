import { Effect, Either } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { bundleExpireFx } from "~/user/stripe/server/fx/sync/bundleExpireFx";
import { bundleGrantSyncFx } from "~/user/stripe/server/fx/sync/bundleGrantSyncFx";

describe("bundleGrantSyncFx", () => {
	it("creates a dedicated purchase bundle and expires it by Stripe key", async () => {
		const database = await testabase("stripe-bundle-grant-sync-purchase");

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const key = "stripe:checkout-session-line-item:cs_test:li_test";
			const createdAt = DateTime.fromISO("2026-06-02T10:00:00.000Z").toJSDate();
			const expiresAt = DateTime.fromISO("2026-06-03T10:00:00.000Z").toJSDate();

			yield* bundleGrantSyncFx({
				userId: buyer.id,
				bundle: "package:buyer",
				key,
				createdAt,
			});
			const duplicate = yield* Effect.either(
				bundleGrantSyncFx({
					userId: buyer.id,
					bundle: "package:buyer",
					key,
					createdAt,
				}),
			);

			const purchaseBundle = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("resource_bundle")
					.selectAll()
					.where("name", "=", key)
					.executeTakeFirstOrThrow();
			});
			const purchaseAssignment = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle")
					.select([
						"availableAt",
						"expiresAt",
						"userId",
					])
					.where("resourceBundleId", "=", purchaseBundle.id)
					.executeTakeFirstOrThrow();
			});
			const purchaseItems = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("resource_bundle_item")
					.select([
						"amount",
						"expiration",
						"resourceDefinitionId",
					])
					.where("resourceBundleId", "=", purchaseBundle.id)
					.execute();
			});
			const purchaseLimits = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("resource_bundle_limit")
					.select([
						"limit",
						"resourceDefinitionId",
					])
					.where("resourceBundleId", "=", purchaseBundle.id)
					.execute();
			});
			const itemSources = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("resource_bundle_item_stripe")
					.select([
						"key",
					])
					.where("key", "=", key)
					.execute();
			});
			const limitSources = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("resource_bundle_limit_stripe")
					.select([
						"key",
					])
					.where("key", "=", key)
					.execute();
			});

			yield* bundleExpireFx({
				key,
				expiresAt,
			});

			const expiredAssignment = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle")
					.select([
						"expiresAt",
					])
					.where("resourceBundleId", "=", purchaseBundle.id)
					.executeTakeFirstOrThrow();
			});

			expect(duplicate._tag).toBe("Left");
			if (!Either.isLeft(duplicate)) {
				throw new Error("Expected duplicate Stripe grant to be skipped");
			}
			expect(duplicate.left._tag).toBe("SyncSkippedFx");
			expect(purchaseAssignment).toEqual({
				availableAt: createdAt,
				expiresAt: null,
				userId: buyer.id,
			});
			expect(purchaseItems).toEqual([
				{
					amount: "1.00",
					expiration: null,
					resourceDefinitionId: "item:token-small",
				},
			]);
			expect(purchaseLimits).toEqual([
				{
					limit: "15.00",
					resourceDefinitionId: "feed.count",
				},
			]);
			expect(itemSources).toEqual([
				{
					key,
				},
			]);
			expect(limitSources).toEqual([
				{
					key,
				},
			]);
			expect(expiredAssignment).toEqual({
				expiresAt,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
