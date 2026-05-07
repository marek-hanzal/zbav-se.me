import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { FieldOptionFilterSchema } from "./FieldOptionFilterSchema";
import { FieldOptionSortSchema } from "./FieldOptionSortSchema";
import { FieldOptionWhereSchema } from "./FieldOptionWhereSchema";

export const FieldOptionQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: FieldOptionFilterSchema.optional(),
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
