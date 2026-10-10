import { z } from "zod";

export const ValidationErrorSchema = z
	.looseObject({
		field: z.string().min(1),
		message: z.string().min(1),
	})
	.strip();

export type ValidationErrorSchema = typeof ValidationErrorSchema;

export namespace ValidationErrorSchema {
	export type Type = z.infer<ValidationErrorSchema>;
}
