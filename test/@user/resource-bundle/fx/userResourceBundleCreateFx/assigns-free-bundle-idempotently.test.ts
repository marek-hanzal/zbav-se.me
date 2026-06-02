import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { userResourceBundleCreateFx } from "~/user/resource-bundle/server/fx/userResourceBundleCreateFx";

describe("userResourceBundleCreateFx", () => {
	it("assigns the free bundle idempotently", async () => {
		const database = await testabase("user-resource-bundle-create");

		return Effect.gen(function* () {
			const { seller } = yield* createUsersFx({});

			const first = yield* userResourceBundleCreateFx({
				userId: seller.id,
				bundle: "free",
			});
			const second = yield* userResourceBundleCreateFx({
				userId: seller.id,
				bundle: "free",
			});

			const rows = yield* Effect.promise(() =>
				database.kysely
					.selectFrom("user_resource_bundle as urb")
					.innerJoin("resource_bundle as rb", "rb.id", "urb.resourceBundleId")
					.select([
						"urb.id",
						"rb.name",
					])
					.where("urb.userId", "=", seller.id)
					.where("rb.name", "=", "free")
					.execute(),
			);

			expect(first.id).toBe(second.id);
			expect(rows).toEqual([
				{
					id: first.id,
					name: "free",
				},
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
