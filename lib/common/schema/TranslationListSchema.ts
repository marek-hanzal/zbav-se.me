import { z } from "zod";
import { TranslationSchema } from "./TranslationSchema";

export const TranslationListSchema = z.record(z.string(), TranslationSchema).meta({
	id: "TranslationList",
	description: "Map of translation entries by key",
});

export type TranslationListSchema = typeof TranslationListSchema;

export namespace TranslationListSchema {
	export type Type = z.infer<TranslationListSchema>;
}
