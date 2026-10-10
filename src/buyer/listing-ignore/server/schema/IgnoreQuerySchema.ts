import { z } from "zod";
import { IgnoreSortSchema } from "~/buyer/listing-ignore/server/schema/IgnoreSortSchema";
import { IgnoreWhereSchema } from "~/buyer/listing-ignore/server/schema/IgnoreWhereSchema";
import { CursorSchema } from "~/query/schema/CursorSchema";

export const IgnoreQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		where: IgnoreWhereSchema.optional(),
		sort: IgnoreSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
		}),
	})
	.strip()
	.meta({
		id: "IgnoreQuery",
		description: "Query object for ignore collection",
	});

export type IgnoreQuerySchema = typeof IgnoreQuerySchema;

export namespace IgnoreQuerySchema {
	export type Type = z.infer<IgnoreQuerySchema>;
}
