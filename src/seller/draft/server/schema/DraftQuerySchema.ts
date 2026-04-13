import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { DraftFilterSchema } from "~/seller/draft/server/schema/DraftFilterSchema";
import { DraftSortSchema } from "~/seller/draft/server/schema/DraftSortSchema";
import { DraftWhereSchema } from "~/seller/draft/server/schema/DraftWhereSchema";

export const DraftQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: DraftFilterSchema.optional(),
		where: DraftWhereSchema.optional(),
		sort: DraftSortSchema.array().optional(),
		limit: z.int().positive().optional().meta({
			description: "Tool-only page cap for collection results.",
		}),
	})
	.strip()
	.meta({
		id: "DraftQuery",
		description: "Query object for draft collection",
	});

export type DraftQuerySchema = typeof DraftQuerySchema;

export namespace DraftQuerySchema {
	export type Type = z.infer<DraftQuerySchema>;
}
