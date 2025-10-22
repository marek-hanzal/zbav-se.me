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
				name: "Title",
				attr: "textTitle",
			},
			//
			{
				name: "LeftButton",
				attr: "label",
			},
			//
			{
				name: "ListingContainer",
				attr: "textTitle",
			},
			{
				name: "ListingContainer",
				attr: "textSubtitle",
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
