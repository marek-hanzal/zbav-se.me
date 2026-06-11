import { Effect, Either } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { genId } from "@/lib/common/gen-id";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { bundleCloseSyncFx } from "~/user/stripe/server/fx/sync/bundleCloseSyncFx";
import { bundleOpenSyncFx } from "~/user/stripe/server/fx/sync/bundleOpenSyncFx";

describe("bundleOpenSyncFx", () => {
	it("creates a dedicated purchase bundle and expires it by Stripe key", async () => {
		const database = await testabase("stripe-bundle-grant-sync-purchase");

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const key = "stripe:checkout:bundle_test";
			const createdAt = DateTime.fromISO("2026-06-02T10:00:00.000Z").toJSDate();
			const expiresAt = DateTime.fromISO("2026-06-03T10:00:00.000Z").toJSDate();
			const resourceBundle = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("resource_bundle")
					.select([
						"id",
					])
					.where("name", "=", "package:buyer")
					.executeTakeFirstOrThrow();
			});

			yield* bundleOpenSyncFx({
				userId: buyer.id,
				bundleId: resourceBundle.id,
				bundle: "package:buyer",
				key,
				createdAt,
			});
			const duplicate = yield* Effect.either(
				bundleOpenSyncFx({
					userId: buyer.id,
					bundleId: resourceBundle.id,
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
						"id",
						"availableAt",
						"expiresAt",
						"userId",
					])
					.where("resourceBundleId", "=", purchaseBundle.id)
					.executeTakeFirstOrThrow();
			});
			const purchaseItems = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle_item")
					.select([
						"amount",
						"expiresAt",
						"resourceDefinitionId",
					])
					.where("userResourceBundleId", "=", purchaseAssignment.id)
					.execute();
			});
			const purchaseLimits = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle_limit")
					.select([
						"limit",
						"resourceDefinitionId",
					])
					.where("userResourceBundleId", "=", purchaseAssignment.id)
					.execute();
			});
			const purchaseFeatures = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle_feature")
					.select([
						"resourceDefinitionId",
					])
					.where("userResourceBundleId", "=", purchaseAssignment.id)
					.execute();
			});
			const itemSources = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle_item_stripe")
					.select([
						"key",
					])
					.where("key", "=", key)
					.execute();
			});
			const featureSources = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle_feature_stripe")
					.select([
						"key",
					])
					.where("key", "=", key)
					.execute();
			});
			const limitSources = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle_limit_stripe")
					.select([
						"key",
					])
					.where("key", "=", key)
					.execute();
			});

			yield* bundleCloseSyncFx({
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
			const expiredChildRows = yield* Effect.promise(async () => {
				const [item, limit, feature] = await Promise.all([
					database.kysely
						.selectFrom("user_resource_bundle_item")
						.select(({ fn }) => [
							fn.countAll<string>().as("count"),
						])
						.where("userResourceBundleId", "=", purchaseAssignment.id)
						.where("expiresAt", "=", expiresAt)
						.executeTakeFirstOrThrow(),
					database.kysely
						.selectFrom("user_resource_bundle_limit")
						.select(({ fn }) => [
							fn.countAll<string>().as("count"),
						])
						.where("userResourceBundleId", "=", purchaseAssignment.id)
						.where("expiresAt", "=", expiresAt)
						.executeTakeFirstOrThrow(),
					database.kysely
						.selectFrom("user_resource_bundle_feature")
						.select(({ fn }) => [
							fn.countAll<string>().as("count"),
						])
						.where("userResourceBundleId", "=", purchaseAssignment.id)
						.where("expiresAt", "=", expiresAt)
						.executeTakeFirstOrThrow(),
				]);

				return {
					feature: Number(feature.count),
					item: Number(item.count),
					limit: Number(limit.count),
				};
			});

			expect(duplicate._tag).toBe("Left");
			if (!Either.isLeft(duplicate)) {
				throw new Error("Expected duplicate Stripe grant to be skipped");
			}
			expect(duplicate.left._tag).toBe("SyncSkipErrorFx");
			expect(purchaseAssignment).toMatchObject({
				availableAt: createdAt,
				expiresAt: null,
				userId: buyer.id,
			});
			expect(purchaseItems).toEqual([
				{
					amount: "3.00",
					expiresAt: null,
					resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:support"],
				},
				{
					amount: "150.00",
					expiresAt: null,
					resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:token"],
				},
				{
					amount: "150.00",
					expiresAt: null,
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["common:item:agent.usage"],
				},
			]);
			expect(purchaseLimits).toEqual([
				{
					limit: "10.00",
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["buyer:limit:feed.count"],
				},
				{
					limit: "10000.00",
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["common:limit:agent.token"],
				},
				{
					limit: "1500000.00",
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["common:limit:agent.handbrake"],
				},
			]);
			expect(purchaseFeatures).toEqual([
				{
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["buyer:feature:anti-topper"],
				},
				{
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["buyer:feature:history"],
				},
				{
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["buyer:feature:listing.early-discovery"],
				},
				{
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["buyer:feature:seller.info"],
				},
			]);
			expect(itemSources).toEqual([
				{
					key,
				},
				{
					key,
				},
				{
					key,
				},
			]);
			expect(limitSources).toEqual([
				{
					key,
				},
				{
					key,
				},
				{
					key,
				},
			]);
			expect(featureSources).toEqual([
				{
					key,
				},
				{
					key,
				},
				{
					key,
				},
				{
					key,
				},
			]);
			expect(expiredAssignment).toEqual({
				expiresAt,
			});
			expect(expiredChildRows).toEqual({
				feature: 4,
				item: 3,
				limit: 3,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});

	it("keeps subscription bundle item and purchased item active together", async () => {
		const database = await testabase("stripe-bundle-grant-sync-combined-item");

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const key = "stripe:checkout:item_token_small";
			const createdAt = DateTime.fromISO("2026-06-02T10:00:00.000Z").toJSDate();
			const resourceBundle = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("resource_bundle")
					.select([
						"id",
					])
					.where("name", "=", "package:buyer")
					.executeTakeFirstOrThrow();
			});

			yield* Effect.promise(async () => {
				const userResourceBundle = await database.kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genId(),
						userId: buyer.id,
						resourceBundleId: resourceBundle.id,
						createdAt,
						availableAt: createdAt,
						expiresAt: null,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				await database.kysely
					.insertInto("user_resource_bundle_item")
					.values({
						id: genId(),
						userResourceBundleId: userResourceBundle.id,
						resourceDefinitionId: "common:item:token",
						amount: 150,
						createdAt,
						availableAt: createdAt,
						expiresAt: null,
					})
					.execute();
			});
			yield* bundleOpenSyncFx({
				userId: buyer.id,
				bundleId: resourceBundle.id,
				bundle: "package:buyer",
				key,
				createdAt,
			});

			const activeTokenItems = yield* Effect.promise(() => {
				return database.kysely
					.selectFrom("user_resource_bundle as assignment")
					.innerJoin(
						"resource_bundle as bundle",
						"bundle.id",
						"assignment.resourceBundleId",
					)
					.innerJoin(
						"user_resource_bundle_item as resourceItem",
						"resourceItem.userResourceBundleId",
						"assignment.id",
					)
					.select([
						"bundle.name",
						"resourceItem.amount",
						"resourceItem.resourceDefinitionId",
					])
					.where("assignment.userId", "=", buyer.id)
					.where("assignment.expiresAt", "is", null)
					.where("resourceItem.expiresAt", "is", null)
					.where("resourceItem.resourceDefinitionId", "=", "common:item:token")
					.orderBy("bundle.name", "asc")
					.execute();
			});
			const tokenTotal = activeTokenItems.reduce((sum, item) => {
				return sum + Number(item.amount);
			}, 0);

			expect(activeTokenItems).toEqual([
				{
					name: "package:buyer",
					amount: "150.00",
					resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:token"],
				},
				{
					name: key,
					amount: "150.00",
					resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:token"],
				},
				{
					name: "welcome:founders:promo",
					amount: "300.00",
					resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:token"],
				},
			]);
			expect(tokenTotal).toBe(600);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
