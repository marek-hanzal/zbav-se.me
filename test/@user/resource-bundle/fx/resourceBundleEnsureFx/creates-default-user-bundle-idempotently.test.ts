import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { createUsersFx } from "~/test/user/fx/createUsersFx";
import { resourceBundleEnsureFx } from "~/user/resource-bundle/server/fx/resourceBundleEnsureFx";

describe("resourceBundleEnsureFx", () => {
	it("creates the default user bundle assignment idempotently", async () => {
		const database = await testabase("resource-bundle-ensure");

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
					])
					.where("assignment.userId", "=", buyer.id)
					.where("bundle.name", "=", buyer.id)
					.execute(),
			);

			expect(first.id).toBe(second.id);
			expect(first.resourceBundleName).toBe(buyer.id);
			expect(second.expiresAt).toBe(null);
			expect(rows).toEqual([
				{
					id: first.id,
					expiresAt: null,
					name: buyer.id,
				},
			]);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
