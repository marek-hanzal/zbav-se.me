import { z } from "zod";

export const ModeEnumSchema = z
	.enum([
		"browse",
		"detail",
	])
	.meta({
		description: `
Mode used while searching for result candidates.

browse: use when you need just lightweight data without polluting context (e.g. only titles, shortened body, etc.)
detail: use only when asked for or you're collecting final results from candidates and you're sure you've use for the
        data as this will be heavy on data
    `.trim(),
	});

export type ModeEnumSchema = typeof ModeEnumSchema;

export namespace ModeEnumSchema {
	export type Type = z.infer<ModeEnumSchema>;
}
