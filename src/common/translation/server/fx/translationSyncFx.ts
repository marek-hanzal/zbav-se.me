import { basename, extname } from "node:path";
import { Effect } from "effect";
import { translationSyncWithFilesFx } from "./translationSyncWithFilesFx";

export const translationSyncFx = Effect.fn("translationSyncFx")(function* () {
	const files = yield* Effect.promise(async () => {
		const translationSourceMap = import.meta.glob(
			"/src/server/@migrations/translation/**/*.{yaml,yml}",
			{
				query: "?raw",
				import: "default",
			},
		) as Record<string, () => Promise<string>>;

		const keys = Object.keys(translationSourceMap).sort((left: string, right: string) => {
			return left.localeCompare(right);
		});

		return Promise.all(
			keys.map(async (key) => {
				const loader = translationSourceMap[key];

				if (!loader) {
					throw new Error(`Translation asset "${key}" is missing.`);
				}

				return {
					content: await loader(),
					locale: basename(key, extname(key)),
				};
			}),
		);
	});

	yield* translationSyncWithFilesFx(files);
});
