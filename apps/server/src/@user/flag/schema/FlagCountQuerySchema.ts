import { z } from "@hono/zod-openapi";
import { FlagFilterSchema } from "./FlagFilterSchema";

export const FlagCountQuerySchema = z
	.object({
		filter: FlagFilterSchema.optional(),
		where: FlagFilterSchema.openapi("FlagCountWhere", {
			description: "App-based filters",
		}).optional(),
	})
	.openapi("FlagCountQuery", {
		description: "Query object for flag count",
	});

export type FlagCountQuerySchema = typeof FlagCountQuerySchema;

export namespace FlagCountQuerySchema {
	export type Type = z.infer<FlagCountQuerySchema>;
}
