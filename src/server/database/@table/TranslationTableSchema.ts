import { z } from "zod";

export const TranslationTableSchema = z
	.looseObject({
		locale: z.string().meta({
			description: "Locale code (e.g., 'cs', 'en')",
		}),
		key: z.string().meta({
			description: "Translation key",
		}),
		value: z.string().meta({
			description: "Translated value",
		}),
		dynamic: z.boolean().meta({
			description:
				"Dynamic translations are extracted from source code and dropped when translations are refreshed.",
		}),
	})
	.meta({
		id: "TranslationTable",
		description: "Database row for a translation.",
	})
	.strip();

export type TranslationTableSchema = typeof TranslationTableSchema;

export namespace TranslationTableSchema {
	export type Type = z.infer<TranslationTableSchema>;
}
