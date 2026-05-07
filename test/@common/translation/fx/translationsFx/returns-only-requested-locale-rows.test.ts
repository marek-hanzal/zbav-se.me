import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { translationSyncFx } from "~/common/translation/server/fx/translationSyncFx";
import { translationsFx } from "~/common/translation/server/fx/translationsFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

describe("translationsFx", () => {
	it("returns only rows for the requested locale after sync", async () => {
		const database = await testabase("translationsFx-locale-scope");

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
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
