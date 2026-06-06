import { Effect } from "effect";
import { describe, it } from "vitest";
import { genId } from "@/lib/common/gen-id";
import { draftCreateFx } from "~/seller/draft/server/fx/draftCreateFx";
import { expectTaggedErrorFx } from "~/test/common/fx/expectTaggedErrorFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

const seedListingLimitFx = (userId: string, limit: number) =>
	Effect.promise(async () => {
		const bundleId = genId();
		const now = new Date();

		return {
			bundleId,
			createdAt: new Date("2030-01-01T00:00:00.000Z"),
			limit,
			now,
			userId,
		};
	});

describe("draftCreateFx listing limit", () => {
	it("rejects draft creation when live listing count reaches the limit", async () => {
		const database = await testabase("draft-create-listing-limit");

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});
			yield* createListingFx(seller.id);

			const limitSeed = yield* seedListingLimitFx(seller.id, 1);

			yield* Effect.promise(async () => {
				await database.kysely
					.insertInto("resource_bundle")
					.values({
						id: limitSeed.bundleId,
						name: `Draft listing limit ${limitSeed.bundleId}`,
					})
					.execute();
				await database.kysely
					.insertInto("resource_bundle_limit")
					.values({
						id: genId(),
						resourceBundleId: limitSeed.bundleId,
						resourceDefinitionId: "seller:limit:listing.count",
						limit: limitSeed.limit,
					})
					.execute();
				await database.kysely
					.insertInto("user_resource_bundle")
					.values({
						id: genId(),
						userId: seller.id,
						resourceBundleId: limitSeed.bundleId,
						createdAt: limitSeed.createdAt,
						availableAt: limitSeed.now,
						expiresAt: null,
					})
					.execute();
			});

			const result = yield* draftCreateFx({
				userId: seller.id,
			}).pipe(Effect.either);

			expectTaggedErrorFx(result, {
				tag: "ResourceLimitErrorFx",
				message: "Resource limit exceeded for [listing.count]",
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
