import { globSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createFilesMatcher, parseTsconfig } from "get-tsconfig";

export const translationFiles = (directory: string, filter: RegExp) => {
	const root = resolve(directory);
	const path = resolve(root, "tsconfig.json");
	const config = parseTsconfig(path);
	const matches = createFilesMatcher({
		path,
		config,
	});
	const roots = new Set([
		root,
		...(config.include ?? []).map((pattern) => {
			const prefix = resolve(root, pattern).split(/[*?]/)[0] ?? root;
			return statSync(prefix, {
				throwIfNoEntry: false,
			})?.isDirectory()
				? prefix
				: dirname(prefix);
		}),
	]);
	const candidates = new Set([
		...[
			...roots,
		].flatMap((cwd) =>
			globSync("**/*.{ts,tsx,mts,cts,js,jsx,mjs,cjs}", {
				cwd,
				exclude: [
					"**/node_modules/**",
					"**/.git/**",
				],
			}).map((file) => resolve(cwd, file)),
		),
		...(config.files ?? []).map((file) => resolve(root, file)),
	]);

	return [
		...candidates,
	]
		.filter((file) => {
			filter.lastIndex = 0;
			return matches(file) && filter.test(file);
		})
		.sort();
};
