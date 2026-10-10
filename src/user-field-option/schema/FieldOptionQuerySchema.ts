import { z } from "zod";
import { CursorSchema } from "~/query/schema/CursorSchema";
import { FieldOptionSortSchema } from "~/user-field-option/schema/FieldOptionSortSchema";
import { FieldOptionWhereSchema } from "~/user-field-option/schema/FieldOptionWhereSchema";

export const FieldOptionQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: FieldOptionWhereSchema.optional(),
		sort: FieldOptionSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "FieldOptionQuery",
		description: "Query object for field-option collection",
	});

export type FieldOptionQuerySchema = typeof FieldOptionQuerySchema;

export namespace FieldOptionQuerySchema {
	export type Type = z.infer<FieldOptionQuerySchema>;
}
