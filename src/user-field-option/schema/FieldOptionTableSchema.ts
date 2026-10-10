import { z } from "zod";

export const FieldOptionTableSchema = z
	.looseObject({
		fieldId: z.string().meta({
			description: "ID of the field this option belongs to",
		}),
		value: z.string().meta({
			description: "Option value",
		}),
		sort: z.number().int().nonnegative().meta({
			description: "Sort order of the option",
		}),
	})
	.meta({
		id: "FieldOptionTable",
		description: "Database row for a field option.",
	})
	.strip();

export type FieldOptionTableSchema = typeof FieldOptionTableSchema;

export namespace FieldOptionTableSchema {
	export type Type = z.infer<FieldOptionTableSchema>;
}
