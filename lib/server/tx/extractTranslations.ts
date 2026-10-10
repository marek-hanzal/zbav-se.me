import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import * as t from "@babel/types";
import type { TranslationSource } from "@/lib/common/translation";

export namespace extractTranslations {
	export interface Props {
		code: string;
		filename: string;
		sources: TranslationSource.Sources;
	}

	export interface Translation {
		text: string;
		sourceKey: string;
	}
}

export const extractTranslations = ({ code, filename, sources }: extractTranslations.Props) => {
	const ast = parse(code, {
		sourceFilename: filename,
		sourceType: "module",
		attachComment: false,
		createParenthesizedExpressions: true,
		plugins: /\.[jt]sx$/.test(filename)
			? [
					"typescript",
					"jsx",
				]
			: [
					"typescript",
				],
	});
	const translations: extractTranslations.Translation[] = [];
	const addLiterals = (node: t.Node, sourceKey: string, jsxAttribute = false) => {
		t.traverseFast(node, (literal) => {
			if (t.isStringLiteral(literal)) {
				// JSX entities and backslashes are literal text, unlike JavaScript strings.
				const value =
					jsxAttribute && literal === node && typeof literal.extra?.raw === "string"
						? literal.extra.raw.slice(1, -1)
						: literal.value;
				translations.push({
					text: escapeTranslationText(value),
					sourceKey,
				});
			} else if (
				t.isTemplateLiteral(literal) &&
				literal.expressions.length === 0 &&
				literal.quasis[0]
			) {
				translations.push({
					text: literal.quasis[0].value.raw,
					sourceKey,
				});
			}
		});
	};

	traverse(ast, {
		noScope: true,
		JSXOpeningElement({ node }) {
			for (const { name, attr } of sources.jsx) {
				if (
					!t.isJSXIdentifier(node.name, {
						name,
					})
				)
					continue;
				for (const attribute of node.attributes) {
					if (
						t.isJSXAttribute(attribute) &&
						t.isJSXIdentifier(attribute.name, {
							name: attr,
						}) &&
						attribute.value
					) {
						addLiterals(attribute.value, `jsx:${name}.${attr}`, true);
					}
				}
			}
		},
		VariableDeclarator({ node }) {
			for (const { name, attr } of sources.jsx) {
				if (
					!t.isIdentifier(node.id, {
						name,
					})
				)
					continue;
				t.traverseFast(node.init, (candidate) => {
					if (!t.isFunction(candidate)) return;
					for (const parameter of candidate.params) {
						const pattern = t.isAssignmentPattern(parameter)
							? parameter.left
							: parameter;
						if (!t.isObjectPattern(pattern)) continue;
						for (const property of pattern.properties) {
							if (
								t.isObjectProperty(property) &&
								!property.computed &&
								t.isIdentifier(property.key, {
									name: attr,
								}) &&
								t.isAssignmentPattern(property.value)
							) {
								addLiterals(property.value.right, `jsx:${name}.${attr}`);
							}
						}
					}
				});
			}
		},
		"CallExpression|OptionalCallExpression"({ node }) {
			if (!t.isCallExpression(node) && !t.isOptionalCallExpression(node)) return;
			// Preserve descendant matching from the previous selectors, including wrappers.
			const identifiers = new Set<string>();
			const methods = new Set<string>();
			t.traverseFast(node, (candidate) => {
				if (t.isIdentifier(candidate)) identifiers.add(candidate.name);
				if (
					(!t.isMemberExpression(candidate) &&
						!t.isOptionalMemberExpression(candidate)) ||
					candidate.computed
				)
					return;
				const memberIdentifiers = new Set<string>();
				t.traverseFast(candidate, (member) => {
					if (t.isIdentifier(member)) memberIdentifiers.add(member.name);
				});
				for (const { object, name } of sources.objects) {
					if (memberIdentifiers.has(object) && memberIdentifiers.has(name))
						methods.add(`object:${object}.${name}`);
				}
			});
			const sourceKeys: string[] = [];
			for (const { name } of sources.functions) {
				if (identifiers.has(name)) sourceKeys.push(`function:${name}`);
			}
			for (const { object, name } of sources.objects) {
				if (methods.has(`object:${object}.${name}`)) {
					sourceKeys.push(`object:${object}.${name}`);
				}
			}
			for (const sourceKey of sourceKeys) {
				for (const argument of node.arguments) {
					if (
						t.isStringLiteral(argument) ||
						(t.isTemplateLiteral(argument) && argument.expressions.length === 0) ||
						t.isConditionalExpression(argument) ||
						t.isBinaryExpression(argument) ||
						t.isLogicalExpression(argument) ||
						t.isParenthesizedExpression(argument)
					) {
						addLiterals(argument, sourceKey);
					}
				}
			}
		},
	});

	return translations;
};

// Preserve the previous printer's keys, including Unicode and control-character escapes.
const escapeTranslationText = (value: string) =>
	value
		.split("")
		.map((character, offset) => {
			const code = character.charCodeAt(0);
			if (code >= 32 && code <= 127 && character !== '"' && character !== "\\")
				return character;
			if (code === 0) return /[0-9]/.test(value[offset + 1] ?? "") ? "\\x00" : "\\0";
			return (
				escapedCharacters.get(character) ??
				`\\u${code.toString(16).toUpperCase().padStart(4, "0")}`
			);
		})
		.join("");

const escapedCharacters = new Map([
	[
		"\t",
		"\\t",
	],
	[
		"\v",
		"\\v",
	],
	[
		"\f",
		"\\f",
	],
	[
		"\b",
		"\\b",
	],
	[
		"\r",
		"\\r",
	],
	[
		"\n",
		"\\n",
	],
	[
		"\\",
		"\\\\",
	],
	[
		'"',
		'\\"',
	],
]);
