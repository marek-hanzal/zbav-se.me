import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { DraftFilterSchema } from "./DraftFilterSchema";
import { DraftSortSchema } from "./DraftSortSchema";

export const DraftQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: DraftFilterSchema.optional(),
		where: DraftFilterSchema.optional().openapi("DraftWhere", {
			description: "App-based filters",
		}),
		sort: DraftSortSchema.array().optional(),
	})
	.openapi("DraftQuery", {
		description: "Query object for draft collection",
	});

export type DraftQuerySchema = typeof DraftQuerySchema;

export namespace DraftQuerySchema {
	export type Type = z.infer<DraftQuerySchema>;
}
