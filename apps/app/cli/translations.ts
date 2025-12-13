import { TranslationSources } from "@use-pico/client/translation";
import { tx } from "@use-pico/server/tx";
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
				name: "Title",
				attr: "textTitle",
			},
			//
			{
				name: "TitleContainer",
				attr: "textTitle",
			},
			{
				name: "TitleContainer",
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
			//
			{
				name: "LocationSelection",
				attr: "textHint",
			},
			//
			{
				name: "Condition",
				attr: "textHint",
			},
			//
			{
				name: "LabelValue",
				attr: "textLabel",
			},
			{
				name: "LabelValue",
				attr: "textValue",
			},
			//
			{
				name: "ValueList",
				attr: "textTitle",
			},
			{
				name: "ValueList",
				attr: "textEmpty",
			},
			//
			{
				name: "LocationValue",
				attr: "textLabel",
			},
			{
				name: "LocationValue",
				attr: "textValue",
			},
			//
			{
				name: "CategoryValue",
				attr: "textTitle",
			},
			{
				name: "CategoryValue",
				attr: "textEmpty",
			},
			//
			{
				name: "ModalContainer",
				attr: "textTitle",
			},
			//
			{
				name: "BottomSheet",
				attr: "header",
			},
		],
	},
});
