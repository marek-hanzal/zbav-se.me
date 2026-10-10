import { describe, expect, test } from "vitest";
import type { TranslationSource } from "~/translation/type/TranslationSource";
import { extractTranslationsFn } from "~/translation-tooling/fn/extractTranslationsFn";

const sources: TranslationSource.Sources = {
	jsx: [
		{
			name: "Tx",
			attr: "label",
		},
		{
			name: "Mx",
			attr: "label",
		},
	],
	functions: [
		{
			name: "translate",
		},
	],
	objects: [
		{
			object: "translator",
			name: "text",
		},
	],
};

describe("Babel translation extraction", () => {
	test("extracts JSX attributes, expressions, templates, and branches", () => {
		const result = extractFn(`
			const view = <>
				<Tx label="Direct" />
				<Tx label={'Expression'}></Tx>
				<Mx label={\`Template\`} />
				<Tx label={flag ? "One" : "Two"} />
				<Tx label={value ?? "Fallback"} />
				<Tx title="Ignored attribute" />
				<Other label="Ignored component" />
			</>;
		`);
		expect(result).toEqual([
			{
				text: "Direct",
				sourceKey: "jsx:Tx.label",
			},
			{
				text: "Expression",
				sourceKey: "jsx:Tx.label",
			},
			{
				text: "Template",
				sourceKey: "jsx:Mx.label",
			},
			{
				text: "One",
				sourceKey: "jsx:Tx.label",
			},
			{
				text: "Two",
				sourceKey: "jsx:Tx.label",
			},
			{
				text: "Fallback",
				sourceKey: "jsx:Tx.label",
			},
		]);
	});

	test("extracts component prop defaults from typed and wrapped functions", () => {
		expect(
			textsFn(`
			const Tx: FC<Props> = ({ label = "Default" }) => null;
			const Mx = memo(function ({ label: title = "Renamed" }) { return null; });
			const Other = ({ label = "Ignored" }) => null;
		`),
		).toEqual([
			"Default",
			"Renamed",
		]);
	});

	test("extracts function and object arguments through conditional and binary expressions", () => {
		expect(
			textsFn(`
			translate("Function");
			translator.text(\`Object\`);
			translate((flag ? "One" : "Two"));
			translator.text(value ?? "Nullish");
			translate(flag && "Logical");
			translate("First" + "Second");
		`),
		).toEqual([
			"Function",
			"Object",
			"One",
			"Two",
			"Nullish",
			"Logical",
			"First",
			"Second",
		]);
	});

	test("preserves descendant source matching for existing wrapper keys", () => {
		expect(new Set(textsFn('wrapper(translator.text("Inner"), "Wrapper");'))).toEqual(
			new Set([
				"Inner",
				"Wrapper",
			]),
		);
	});

	test("ignores interpolated templates, unrelated calls, type literals, and comments", () => {
		expect(
			textsFn(`
			translate(\`Dynamic \${value}\`);
			const view = <Tx label={\`Dynamic \${value}\`} />;
			other.text("Wrong object");
			translator.other("Wrong method");
			translator["text"]("Computed method");
			other("Wrong function");
			type TxLabel = "Type only";
			// translator.text("Comment only");
		`),
		).toEqual([]);
	});

	test("preserves existing escaped keys and literal JSX entities", () => {
		expect(
			textsFn(String.raw`
			translate('apostrophe\'s and "double"');
			translate('new\nline\ttab\\slash');
			translate('\u010D \x41 \0');
			translate('\u00001');
			const view = <><Tx label="A &amp; &quot;B&quot;" /><Tx label="č 😃" /></>;
		`),
		).toEqual([
			String.raw`apostrophe's and \"double\"`,
			String.raw`new\nline\ttab\\slash`,
			String.raw`\u010D A \0`,
			String.raw`\x001`,
			"A &amp; &quot;B&quot;",
			String.raw`\u010D \uD83D\uDE03`,
		]);
	});

	test("preserves static template raw escapes and line breaks", () => {
		expect(textsFn("translate(`Raw\\nline\nč`);")).toEqual([
			"Raw\\nline\nč",
		]);
	});

	test("parses TypeScript angle assertions without enabling JSX for .ts files", () => {
		expect(extractFn('const value = <string>input; translate("Typed");', "fixture.ts")).toEqual(
			[
				{
					text: "Typed",
					sourceKey: "function:translate",
				},
			],
		);
	});

	test("rejects invalid syntax instead of silently producing an incomplete catalog", () => {
		expect(() => extractFn('<Tx label="Broken"')).toThrow();
	});
});

const extractFn = (code: string, filename = "fixture.tsx") =>
	extractTranslationsFn({
		code,
		filename,
		sources,
	});
const textsFn = (code: string) => extractFn(code).map(({ text }) => text);
