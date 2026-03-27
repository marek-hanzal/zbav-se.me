import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
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
	.meta({
		id: "DraftQuery",
		description: "Query object for draft collection",
	});

export type DraftQuerySchema = typeof DraftQuerySchema;

export namespace DraftQuerySchema {
	export type Type = z.infer<DraftQuerySchema>;
}
