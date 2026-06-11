import { Effect } from "effect";
import { DateTime } from "luxon";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userBundleEntitlementsExpireFx } from "~/user/resource-bundle/server/fx/userBundleEntitlementsExpireFx";
import { userResourceBundleCreateFx } from "~/user/resource-bundle/server/fx/userResourceBundleCreateFx";

describe("userBundleEntitlementsExpireFx", () => {
	it("expires limit and feature rows without killing item rows", async () => {
		const database = await testabase("user-bundle-entitlements-expire");

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});
			const availableAt = DateTime.fromISO("2026-06-02T10:00:00.000Z").toJSDate();
			const expiresAt = DateTime.fromISO("2026-07-02T10:00:00.000Z").toJSDate();
			const bundle = yield* userResourceBundleCreateFx({
				userId: buyer.id,
				bundle: "package:buyer",
				availableAt,
			});

			yield* userBundleEntitlementsExpireFx({
				assignmentId: bundle.id,
				expiresAt,
			});

			const counts = yield* Effect.promise(async () => {
				const [items, limits, features] = await Promise.all([
					database.kysely
						.selectFrom("user_resource_bundle_item")
						.select(({ fn }) => [
							fn.countAll<string>().as("count"),
						])
						.where("userResourceBundleId", "=", bundle.id)
						.where("expiresAt", "is", null)
						.executeTakeFirstOrThrow(),
					database.kysely
						.selectFrom("user_resource_bundle_limit")
						.select(({ fn }) => [
							fn.countAll<string>().as("count"),
						])
						.where("userResourceBundleId", "=", bundle.id)
						.where("expiresAt", "=", expiresAt)
						.executeTakeFirstOrThrow(),
					database.kysely
						.selectFrom("user_resource_bundle_feature")
						.select(({ fn }) => [
							fn.countAll<string>().as("count"),
						])
						.where("userResourceBundleId", "=", bundle.id)
						.where("expiresAt", "=", expiresAt)
						.executeTakeFirstOrThrow(),
				]);

				return {
					features: Number(features.count),
					items: Number(items.count),
					limits: Number(limits.count),
				};
			});

			expect(counts).toEqual({
				features: 4,
				items: 3,
				limits: 3,
			});
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
