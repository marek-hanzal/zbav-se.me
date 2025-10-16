import { TranslationSources } from "@use-pico/client";
import { tx } from "@use-pico/server";
import { locales } from "../src/locales";

tx({
	packages: [
		`${__dirname}/..`,
	],
	output: `${__dirname}/../src/translation`,
	locales,
	sources: {
		...TranslationSources,
		jsx: [
			...TranslationSources.jsx,
			{
				name: "Tile",
				attr: "textTitle",
			},
			{
				name: "Tile",
				attr: "textMessage",
			},
			//
			{
				name: "Condition",
				attr: "textTitle",
			},
			{
				name: "Condition",
				attr: "textDescription",
			},
			//
			{
				name: "SearchSheet",
				attr: "textTitle",
			},
			{
				name: "SearchSheet",
				attr: "textMessage",
			},
		],
	},
});
