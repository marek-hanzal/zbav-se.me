import { z } from "zod";
import { FieldOptionFilterSchema } from "./FieldOptionFilterSchema";

export const FieldOptionWhereSchema = z
	.looseObject({
		...FieldOptionFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "FieldOptionWhere",
		description: "App-based filters",
	});

export type FieldOptionWhereSchema = typeof FieldOptionWhereSchema;

export namespace FieldOptionWhereSchema {
	export type Type = z.infer<FieldOptionWhereSchema>;
}
