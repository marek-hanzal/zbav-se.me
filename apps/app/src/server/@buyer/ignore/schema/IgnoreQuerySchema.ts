import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { IgnoreFilterSchema } from "~/server/@buyer/ignore/schema/IgnoreFilterSchema";
import { IgnoreSortSchema } from "~/server/@buyer/ignore/schema/IgnoreSortSchema";
import { IgnoreWhereSchema } from "~/server/@buyer/ignore/schema/IgnoreWhereSchema";

export const IgnoreQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: IgnoreFilterSchema.optional(),
		where: IgnoreWhereSchema.optional(),
		sort: IgnoreSortSchema.array().optional(),
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
