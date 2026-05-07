import { Effect } from "effect";
import { describe, expect, it } from "vitest";
import { translationSyncFx } from "~/common/translation/server/fx/translationSyncFx";
import { translationsFx } from "~/common/translation/server/fx/translationsFx";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { testabase } from "~/test/testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const countTranslationKeyFx = (database: TestDatabase, key: string) =>
	Effect.promise(async () => {
		const row = await database.kysely
			.selectFrom("translation")
			.select((eb) => eb.fn.countAll<number>().as("count"))
			.where("key", "=", key)
			.executeTakeFirstOrThrow();

		return Number(row.count);
	});

describe("translationSyncFx", () => {
	it("rebuilds the translation table from yaml files and removes stale rows", async () => {
		const database = await testabase("translation-sync-contract");

		return Effect.gen(function* () {
			yield* translationSyncFx();

			const baselineRows = yield* translationsFx({
				locale: "cs",
			});
			const baselineCount = baselineRows.length;

			yield* Effect.promise(async () => {
				await database.kysely.deleteFrom("translation").execute();
				await database.kysely
					.insertInto("translation")
					.values([
						{
							locale: "cs",
							key: "About me (title)",
							value: "WRONG VALUE",
							dynamic: true,
						},
						{
							locale: "en",
							key: "Bogus key",
							value: "Should disappear",
							dynamic: false,
						},
					])
					.execute();
			});

			yield* translationSyncFx();

			const syncedRows = yield* translationsFx({
				locale: "cs",
			});
			const aboutMeTitle = syncedRows.find((item) => item.key === "About me (title)");
			const dynamicAgeLabel = syncedRows.find((item) => item.key === "Age 1 (label)");
			const bogusKeyCount = yield* countTranslationKeyFx(database, "Bogus key");

			expect(baselineCount).toBeGreaterThan(0);
			expect(syncedRows.length).toBe(baselineCount);
			expect(aboutMeTitle?.value).toBe("Marek Hanzal");
			expect(aboutMeTitle?.dynamic).toBe(false);
			expect(dynamicAgeLabel?.value).toBe("F — Na dožití");
			expect(dynamicAgeLabel?.dynamic).toBe(true);
			expect(bogusKeyCount).toBe(0);
		}).pipe(withRuntimeFx(database), Effect.runPromise);
	});
});
