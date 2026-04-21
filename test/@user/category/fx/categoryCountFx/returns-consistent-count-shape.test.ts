import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { categoryCountFx } from "~/user/category/server/fx/categoryCountFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("categoryCountFx", () => {
	it("returns count contract for seeded categories", async () => {
		const database = await testabase("categoryCountFx-contract");

		return Effect.gen(function* () {
			const count = yield* categoryCountFx({
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
