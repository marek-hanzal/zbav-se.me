import { Effect } from "effect";
import { describe, it } from "vitest";
import { genIdFn } from "~/identity/fn/genIdFn";
import { ResourceDefinitionEnumSchema } from "~/resource-definition/schema/ResourceDefinitionEnumSchema";
import { listingCreateFx } from "~/seller-listing/fx/listingCreateFx";
import { expectTaggedErrorFn } from "~/test/common/fx/expectTaggedErrorFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

const seedListingLimitFx = (userId: string, limit: number) =>
	Effect.promise(async () => {
		const bundleId = genIdFn();
		const now = new Date();

		return {
			bundleId,
			createdAt: new Date("2030-01-01T00:00:00.000Z"),
			limit,
			now,
			userId,
		};
	});

describe("listingCreateFx listing limit", () => {
	it("rejects listing creation when live listing count reaches the limit", async () => {
		const database = await testabaseFn("listing-create-listing-limit");

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});
			yield* createListingFx(seller.id);

			const limitSeed = yield* seedListingLimitFx(seller.id, 1);

			yield* Effect.promise(async () => {
				await database.kysely
					.insertInto("resource_bundle")
					.values({
						id: limitSeed.bundleId,
						name: `Listing limit ${limitSeed.bundleId}`,
						type: "user",
						access: "protected",
						sort: 0,
					})
					.execute();
				const userResourceBundle = await database.kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genIdFn(),
						userId: seller.id,
						resourceBundleId: limitSeed.bundleId,
						createdAt: limitSeed.createdAt,
						availableAt: limitSeed.now,
						expiresAt: null,
					})
					.returning([
						"id",
					])
					.executeTakeFirstOrThrow();

				await database.kysely
					.insertInto("user_resource_bundle_limit")
					.values({
						id: genIdFn(),
						userResourceBundleId: userResourceBundle.id,
						resourceDefinitionId: "seller:limit:listing.count",
						limit: limitSeed.limit,
						createdAt: limitSeed.createdAt,
						availableAt: limitSeed.now,
						expiresAt: null,
					})
					.execute();
			});

			const result = yield* listingCreateFx({
				userId: seller.id,
				draftId: genIdFn(),
			}).pipe(Effect.result);

			expectTaggedErrorFn(result, {
				tag: "ResourceLimitErrorFx",
				message: `Resource limit exceeded for [${ResourceDefinitionEnumSchema.enum["seller:limit:listing.count"]}]`,
			});
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
