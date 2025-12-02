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
				name: "Tile",
				attr: "label",
			},
			//
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
				name: "BadgeValue",
				attr: "textLabel",
			},
			{
				name: "BadgeValue",
				attr: "textValue",
			},
			//
			{
				name: "ContainerValueList",
				attr: "textTitle",
			},
			{
				name: "ContainerValueList",
				attr: "textEmpty",
			},
			//
			{
				name: "LocationBadgeValue",
				attr: "textLabel",
			},
			{
				name: "LocationBadgeValue",
				attr: "textValue",
			},
			//
			{
				name: "CategoryValueList",
				attr: "textTitle",
			},
			{
				name: "CategoryValueList",
				attr: "textEmpty",
			},
			//
			{
				name: "ContainerValueList",
				attr: "textTitle",
			},
			{
				name: "ContainerValueList",
				attr: "textEmpty",
			},
			//
			{
				name: "ModalContainer",
				attr: "textTitle",
			},
			//
			{
				name: "ListingDetailButton",
				attr: "label",
			},
			//
			{
				name: "BottomSheet",
				attr: "header",
			},
		],
	},
});
