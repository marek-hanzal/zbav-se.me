/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
	plugins: ["prettier-plugin-tailwindcss"],
	quoteProps: "consistent",
	useTabs: true,
	arrowParens: "always",
	bracketSameLine: true,
	embeddedLanguageFormatting: "off",
	endOfLine: "lf",
	jsxSingleQuote: false,
	semi: true,
	singleAttributePerLine: true,
	singleQuote: false,
	tabWidth: 4,
	trailingComma: "all",
	printWidth: 120,
};

export default config;
