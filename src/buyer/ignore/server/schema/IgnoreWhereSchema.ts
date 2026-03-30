import { z } from "zod";
import { IgnoreFilterSchema } from "~/buyer/ignore/server/schema/IgnoreFilterSchema";

export const IgnoreWhereSchema = z
	.looseObject({
		...IgnoreFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "IgnoreWhere",
		description: "App-based filters",
	});

export type IgnoreWhereSchema = typeof IgnoreWhereSchema;

export namespace IgnoreWhereSchema {
	export type Type = z.infer<IgnoreWhereSchema>;
}
