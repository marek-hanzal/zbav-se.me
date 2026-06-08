import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userResourceBundleCreateFx } from "~/user/resource-bundle/server/fx/userResourceBundleCreateFx";
import { ResourceBundleEnumSchema } from "~/user/resource-bundle/server/schema/ResourceBundleEnumSchema";

describe("userResourceBundleCreateFx", () => {
	it("assigns the free bundle idempotently", async () => {
		const database = await testabase("user-resource-bundle-create");

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});

			const first = yield* userResourceBundleCreateFx({
				userId: seller.id,
				bundle: ResourceBundleEnumSchema.enum["package:free"],
			});
			const second = yield* userResourceBundleCreateFx({
				userId: seller.id,
				bundle: ResourceBundleEnumSchema.enum["package:free"],
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("user_resource_bundle as assignment")
					.innerJoin(
						"resource_bundle as bundle",
						"bundle.id",
						"assignment.resourceBundleId",
					)
					.select([
						"assignment.id",
						"bundle.name",
					])
					.where("assignment.userId", "=", seller.id)
					.where("bundle.name", "=", ResourceBundleEnumSchema.enum["package:free"])
					.execute(),
			);

			expect(first.id).toBe(second.id);
			expect(rows).toEqual([
				{
					id: first.id,
					name: ResourceBundleEnumSchema.enum["package:free"],
				},
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
