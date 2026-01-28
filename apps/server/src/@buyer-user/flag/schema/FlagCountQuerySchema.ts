import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { FlagFilterSchema } from "~/@buyer-user/flag/schema/FlagFilterSchema";

export const FlagCountQuerySchema = z
	.looseObject({
		filter: FlagFilterSchema.optional(),
		where: FlagFilterSchema.openapi("FlagCountWhere", {
			description: "App-based filters",
		}).optional(),
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("FlagCountQuery", {
		description: "Query object for flag count",
	});

export type FlagCountQuerySchema = typeof FlagCountQuerySchema;

export namespace FlagCountQuerySchema {
	export type Type = z.infer<FlagCountQuerySchema>;
}
