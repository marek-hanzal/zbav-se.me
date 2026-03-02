import { z } from "@hono/zod-openapi";
import { DraftFilterSchema } from "~/@seller/draft/schema/DraftFilterSchema";
import { DraftSortSchema } from "~/@seller/draft/schema/DraftSortSchema";
import { DraftWhereSchema } from "~/@seller/draft/schema/DraftWhereSchema";
import { CursorSchema } from "~/schema/CursorSchema";

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
