import { CursorSchema } from "@use-pico/common/schema";
import { z } from "zod";
import { DraftFilterSchema } from "~/client/@seller/draft/server/schema/DraftFilterSchema";
import { DraftSortSchema } from "~/client/@seller/draft/server/schema/DraftSortSchema";
import { DraftWhereSchema } from "~/client/@seller/draft/server/schema/DraftWhereSchema";

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
