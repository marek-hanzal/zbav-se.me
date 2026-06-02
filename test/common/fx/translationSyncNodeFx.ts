import { readdir, readFile } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { Effect } from "effect";
import { translationSyncWithFilesFx } from "~/common/translation/server/fx/translationSyncWithFilesFx";

const translationDirectory = join(process.cwd(), "src/server/@migrations/translation");

export namespace translationSyncNodeFx {
	export type File = translationSyncWithFilesFx.File;
}

export const translationSyncNodeFx = Effect.fn("translationSyncNodeFx")(function* () {
	const files = yield* Effect.promise(async () => {
		const names = (await readdir(translationDirectory))
			.filter((name) => {
				return name.endsWith(".yaml") || name.endsWith(".yml");
			})
			.sort((left, right) => {
				return left.localeCompare(right);
			});

		return Promise.all(
			names.map(async (name) => {
				const path = join(translationDirectory, name);

				return {
					content: await readFile(path, "utf8"),
					locale: basename(name, extname(name)),
				} satisfies translationSyncNodeFx.File;
			}),
		);
	});

	yield* translationSyncWithFilesFx(files);
});
