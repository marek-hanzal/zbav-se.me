import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { ResourceDefinitionEnumSchema } from "~/common/resource-definition/enum/ResourceDefinitionEnumSchema";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userResourceBundleCreateFx } from "~/user/resource-bundle/server/fx/userResourceBundleCreateFx";

describe("userResourceBundleCreateFx", () => {
	it("copies bundle template resources into user-owned snapshot rows", async () => {
		const database = await testabase("user-resource-bundle-create-snapshot");

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const availableAt = DateTime.fromISO("2026-06-02T10:00:00.000Z").toJSDate();
			const expiresAt = DateTime.fromISO("2026-07-02T10:00:00.000Z").toJSDate();

			const bundle = yield* userResourceBundleCreateFx({
				userId: buyer.id,
				bundle: "package:buyer",
				availableAt,
				expiresAt,
			});
			const [items, limits, features] = yield* Effect.promise(async () => {
				return Promise.all([
					database.kysely
						.selectFrom("user_resource_bundle_item")
						.select([
							"amount",
							"availableAt",
							"expiresAt",
							"resourceDefinitionId",
						])
						.where("userResourceBundleId", "=", bundle.id)
						.orderBy("resourceDefinitionId", "asc")
						.execute(),
					database.kysely
						.selectFrom("user_resource_bundle_limit")
						.select([
							"availableAt",
							"expiresAt",
							"limit",
							"resourceDefinitionId",
						])
						.where("userResourceBundleId", "=", bundle.id)
						.orderBy("resourceDefinitionId", "asc")
						.execute(),
					database.kysely
						.selectFrom("user_resource_bundle_feature")
						.select([
							"availableAt",
							"expiresAt",
							"resourceDefinitionId",
						])
						.where("userResourceBundleId", "=", bundle.id)
						.orderBy("resourceDefinitionId", "asc")
						.execute(),
				]);
			});

			expect(bundle).toMatchObject({
				availableAt,
				expiresAt,
				userId: buyer.id,
			});
			expect(items).toEqual([
				{
					amount: "150.00",
					availableAt,
					expiresAt,
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["common:item:agent.usage"],
				},
				{
					amount: "3.00",
					availableAt,
					expiresAt,
					resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:support"],
				},
				{
					amount: "150.00",
					availableAt,
					expiresAt,
					resourceDefinitionId: ResourceDefinitionEnumSchema.enum["common:item:token"],
				},
			]);
			expect(limits).toEqual([
				{
					availableAt,
					expiresAt,
					limit: "10.00",
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["buyer:limit:feed.count"],
				},
				{
					availableAt,
					expiresAt,
					limit: "1500000.00",
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["common:limit:agent.handbrake"],
				},
				{
					availableAt,
					expiresAt,
					limit: "10000.00",
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["common:limit:agent.token"],
				},
			]);
			expect(features).toEqual([
				{
					availableAt,
					expiresAt,
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["buyer:feature:anti-topper"],
				},
				{
					availableAt,
					expiresAt,
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["buyer:feature:history"],
				},
				{
					availableAt,
					expiresAt,
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["buyer:feature:listing.early-discovery"],
				},
				{
					availableAt,
					expiresAt,
					resourceDefinitionId:
						ResourceDefinitionEnumSchema.enum["buyer:feature:seller.info"],
				},
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
