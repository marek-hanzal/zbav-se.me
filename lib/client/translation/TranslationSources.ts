import type { TranslationSource } from "./TranslationSource";

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
			name: "text",
		},
	],
};
