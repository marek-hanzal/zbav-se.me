import { z } from "zod";
import { ValidationErrorSchema } from "./ValidationErrorSchema";

export const ValidationResultSchema = z.discriminatedUnion("success", [
	z
		.looseObject({
			success: z.literal(true),
		})
		.strip(),
	z
		.looseObject({
			errors: z.array(ValidationErrorSchema),
			success: z.literal(false),
		})
		.strip(),
]);

export type ValidationResultSchema = typeof ValidationResultSchema;

export namespace ValidationResultSchema {
	export type Type = z.infer<ValidationResultSchema>;
}
