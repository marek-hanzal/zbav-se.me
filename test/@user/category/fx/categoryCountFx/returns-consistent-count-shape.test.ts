import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { categoryCountFx } from "~/user-category/fx/categoryCountFx";

describe("categoryCountFx", () => {
	it("returns count contract for seeded categories", async () => {
		const database = await testabaseFn("categoryCountFx-contract");

		return Effect.gen(function* () {
			const user = yield* leaseTestUserFx({});
			const count = yield* categoryCountFx({
				userId: user.id,
				where: {
					slug: "pocitace-a-kancelar--uloziste-ssd-hdd",
				},
				scope: {},
			});

			expect(typeof count).toBe("number");
			expect(count).toBeGreaterThan(0);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
