import type { TranslationSource } from "~/translation/type/TranslationSource";

export const TranslationSources: TranslationSource.Sources = {
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
	functions: [],
	objects: [
		{
			object: "translator",
			name: "textFn",
		},
	],
};
