import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { parse, stringify } from "yaml";
import type { TranslationSource } from "~/translation/type/TranslationSource";
import { translationFiles } from "~/translation-tooling/fn/translationFiles";
import { tx } from "~/translation-tooling/fn/tx";

const sources: TranslationSource.Sources = {
	jsx: [
		{
			name: "Tx",
			attr: "label",
		},
	],
	functions: [],
	objects: [],
};
let root: string;

beforeEach(() => {
	root = mkdtempSync(join(tmpdir(), "zbav-translations-"));
	vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
	rmSync(root, {
		recursive: true,
		force: true,
	});
	vi.restoreAllMocks();
});

describe("translation catalog generation", () => {
	test("respects inherited includes, excludes, explicit files, and declaration filters", () => {
		write("base.json", '{ "include": ["source/**/*"], "exclude": ["source/excluded/**"] }');
		write("tsconfig.json", '{ "extends": "./base.json", "files": ["extra.tsx"] }');
		write("source/view.tsx", '<Tx label="Included" />');
		write("source/types.d.ts", "declare const value: string;");
		write("source/excluded/view.tsx", '<Tx label="Excluded" />');
		write("extra.tsx", '<Tx label="Explicit" />');
		write("outside.tsx", '<Tx label="Outside" />');
		expect(translationFiles(root, /(?<!\.d)\.tsx?$/g)).toEqual([
			join(root, "extra.tsx"),
			join(root, "source/view.tsx"),
		]);
	});

	test("follows includes inherited from a configuration outside the package", () => {
		write("base.json", '{ "include": ["shared/**/*.tsx"] }');
		write("package/tsconfig.json", '{ "extends": "../base.json" }');
		write("shared/view.tsx", '<Tx label="Shared" />');
		expect(translationFiles(join(root, "package"), /\.tsx$/)).toEqual([
			join(root, "shared/view.tsx"),
		]);
	});

	test.each([
		"json",
		"yaml",
	] as const)("merges %s locales without losing translations or dynamic keys", (format) => {
		write("tsconfig.json", '{ "include": ["source/**/*.tsx"] }');
		write(
			"source/view.tsx",
			'<><Tx label="Existing" /><Tx label="Added" /><Tx label="Added" /><Tx label="" /></>',
		);
		const existing = {
			Existing: {
				value: "Already translated",
			},
			Obsolete: {
				value: "Remove this",
			},
			Dynamic: {
				value: "Keep this",
				dynamic: true,
			},
		};
		write(
			`output/en.${format}`,
			format === "json" ? JSON.stringify(existing) : stringify(existing),
		);
		tx({
			packages: [
				root,
			],
			output: join(root, "output"),
			locales: [
				"en",
				"cs",
			],
			format,
			sources,
		});
		const en = readFileSync(join(root, `output/en.${format}`), "utf-8");
		const cs = readFileSync(join(root, `output/cs.${format}`), "utf-8");
		const english = format === "json" ? JSON.parse(en) : parse(en);
		const czech = format === "json" ? JSON.parse(cs) : parse(cs);
		expect(english).toEqual({
			Added: {
				value: "Added",
			},
			Dynamic: {
				value: "Keep this",
				dynamic: true,
			},
			Existing: {
				value: "Already translated",
			},
		});
		expect(czech).toEqual({
			Added: {
				value: "Added",
			},
			Existing: {
				value: "Existing",
			},
		});
		expect(Object.keys(english)).toEqual([
			"Added",
			"Dynamic",
			"Existing",
		]);
	});

	test("leaves every locale untouched when a source cannot be parsed", () => {
		write("tsconfig.json", '{ "include": ["source/**/*.tsx"] }');
		write("source/view.tsx", '<Tx label="Broken"');
		write("output/en.json", '{"Existing":{"value":"Keep this"}}');
		expect(() =>
			tx({
				packages: [
					root,
				],
				output: join(root, "output"),
				locales: [
					"en",
				],
				format: "json",
				sources,
			}),
		).toThrow(join(root, "source/view.tsx"));
		expect(readFileSync(join(root, "output/en.json"), "utf-8")).toBe(
			'{"Existing":{"value":"Keep this"}}',
		);
	});
});

const write = (file: string, content: string) => {
	const path = join(root, file);
	mkdirSync(dirname(path), {
		recursive: true,
	});
	writeFileSync(path, content);
};
