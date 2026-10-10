import { z } from "zod";

export const TranslationSchema = z
	.looseObject({
		key: z.string(),
		ref: z.string().optional(),
		value: z.string(),
		dynamic: z.boolean().optional(),
	})
	.strip()
	.meta({
		id: "Translation",
		description: "Single translation entry",
	});

export type TranslationSchema = typeof TranslationSchema;

export namespace TranslationSchema {
	export type Type = z.infer<TranslationSchema>;
}
