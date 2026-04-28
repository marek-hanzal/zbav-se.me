import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { FieldFilterSchema } from "./FieldFilterSchema";
import { FieldSortSchema } from "./FieldSortSchema";
import { FieldWhereSchema } from "./FieldWhereSchema";

export const FieldQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: FieldFilterSchema.optional(),
		where: FieldWhereSchema.optional(),
		sort: FieldSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "FieldQuery",
		description: "Query object for field collection",
	});

export type FieldQuerySchema = typeof FieldQuerySchema;

export namespace FieldQuerySchema {
	export type Type = z.infer<FieldQuerySchema>;
}
