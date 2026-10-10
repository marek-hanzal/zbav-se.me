import { z } from "zod";

export const LocaleSchema = z
	.looseObject({
		locale: z.string().min(1).max(12),
	})
	.strip();

export type LocaleSchema = typeof LocaleSchema;

export namespace LocaleSchema {
	export type Type = z.infer<LocaleSchema>;
}
