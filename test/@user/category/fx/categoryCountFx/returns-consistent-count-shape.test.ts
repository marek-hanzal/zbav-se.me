import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { categoryCountFx } from "~/user/category/server/fx/categoryCountFx";

describe("categoryCountFx", () => {
	it("returns count contract for seeded categories", async () => {
		const database = await testabase("categoryCountFx-contract");

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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
