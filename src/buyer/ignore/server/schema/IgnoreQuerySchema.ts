import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { IgnoreFilterSchema } from "~/buyer/ignore/server/schema/IgnoreFilterSchema";
import { IgnoreSortSchema } from "~/buyer/ignore/server/schema/IgnoreSortSchema";
import { IgnoreWhereSchema } from "~/buyer/ignore/server/schema/IgnoreWhereSchema";

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
