import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/common/schema/CursorSchema";
import { DraftFilterSchema } from "~/server/@seller/draft/schema/DraftFilterSchema";
import { DraftSortSchema } from "~/server/@seller/draft/schema/DraftSortSchema";
import { DraftWhereSchema } from "~/server/@seller/draft/schema/DraftWhereSchema";

export const DraftQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: DraftFilterSchema.optional(),
		where: DraftWhereSchema.optional(),
		sort: DraftSortSchema.array().optional(),
	})
	.strip()
	.openapi("DraftQuery", {
		description: "Query object for draft collection",
	});

export type DraftQuerySchema = typeof DraftQuerySchema;

export namespace DraftQuerySchema {
	export type Type = z.infer<DraftQuerySchema>;
}
