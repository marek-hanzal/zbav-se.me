import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { resourceBundleEnsureFx } from "~/user-resource-bundle/fx/resourceBundleEnsureFx";

describe("resourceBundleEnsureFx", () => {
	it("creates the default user bundle assignment idempotently", async () => {
		const database = await testabaseFn("resource-bundle-ensure");

		return Effect.gen(function* () {
			const { buyer } = yield* createUsersFx({});

			const first = yield* resourceBundleEnsureFx({
				userId: buyer.id,
			});
			const second = yield* resourceBundleEnsureFx({
				userId: buyer.id,
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
						"assignment.expiresAt",
						"bundle.name",
						"bundle.type",
					])
					.where("assignment.userId", "=", buyer.id)
					.where("bundle.name", "=", buyer.id)
					.execute(),
			);

			expect(first.id).toBe(second.id);
			expect(first.resourceBundleName).toBe(buyer.id);
			expect(first.resourceBundleType).toBe("user");
			expect(second.expiresAt).toBe(null);
			expect(rows).toEqual([
				{
					id: first.id,
					expiresAt: null,
					name: buyer.id,
					type: "user",
				},
			]);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
