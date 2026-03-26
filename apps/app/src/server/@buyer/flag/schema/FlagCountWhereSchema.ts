import { z } from "@hono/zod-openapi";
import { FlagFilterSchema } from "~/server/@buyer/flag/schema/FlagFilterSchema";

export const FlagCountWhereSchema = z
	.looseObject({
		...FlagFilterSchema.shape,
	})
	.omit({
		userId: true,
	})
	.strip()
	.openapi("FlagCountWhere", {
		description: "App-based filters",
	});

export type FlagCountWhereSchema = typeof FlagCountWhereSchema;

export namespace FlagCountWhereSchema {
	export type Type = z.infer<FlagCountWhereSchema>;
}
