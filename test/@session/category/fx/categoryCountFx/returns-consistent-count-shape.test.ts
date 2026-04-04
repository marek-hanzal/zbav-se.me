import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { categoryCountFx } from "~/session/category/server/fx/categoryCountFx";
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

			expect(typeof count.total).toBe("number");
			expect(typeof count.where).toBe("number");
			expect(typeof count.filter).toBe("number");
			expect(count.total).toBeGreaterThan(0);
			expect(count.where).toBe(1);
			expect(count.filter).toBe(1);
			expect(count.isEmpty).toBe(false);
			expect(count.isFilterEmpty).toBe(false);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
