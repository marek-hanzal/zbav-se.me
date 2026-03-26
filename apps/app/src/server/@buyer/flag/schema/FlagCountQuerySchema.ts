import { z } from "@hono/zod-openapi";
import { FlagCountWhereSchema } from "~/server/@buyer/flag/schema/FlagCountWhereSchema";
import { FlagFilterSchema } from "~/server/@buyer/flag/schema/FlagFilterSchema";

export const FlagCountQuerySchema = z
	.looseObject({
		filter: FlagFilterSchema.omit({
			userId: true,
		}).optional(),
		where: FlagCountWhereSchema.optional(),
	})
	.strip()
	.openapi("FlagCountQuery", {
		description: "Query object for flag count",
	});

export type FlagCountQuerySchema = typeof FlagCountQuerySchema;

export namespace FlagCountQuerySchema {
	export type Type = z.infer<FlagCountQuerySchema>;
}
