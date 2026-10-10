import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { testabaseFn } from "~/test/testabaseFn";
import { translationSyncFx } from "~/translation/fx/translationSyncFx";
import { translationsFx } from "~/translation/fx/translationsFx";

describe("translationsFx", () => {
	it("returns only rows for the requested locale after sync", async () => {
		const database = await testabaseFn("translationsFx-locale-scope");

		return Effect.gen(function* () {
			yield* translationSyncFx();

			const csRows = yield* translationsFx({
				locale: "cs",
			});
			const enRows = yield* translationsFx({
				locale: "en",
			});
			const aboutMeTitle = csRows.find((row) => row.key === "About me (title)");
			const dynamicRows = csRows.filter((row) => row.dynamic === true);

			expect(csRows.length).toBeGreaterThan(0);
			expect(csRows.every((row) => row.locale === "cs")).toBe(true);
			expect(aboutMeTitle?.value).toBe("Marek Hanzal");
			expect(dynamicRows.length).toBeGreaterThan(0);
			expect(enRows).toEqual([]);
		}).pipe(withRuntimeFn(database), Effect.runPromise);
	});
});
