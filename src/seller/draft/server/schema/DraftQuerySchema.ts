import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { DraftSortSchema } from "~/seller/draft/server/schema/DraftSortSchema";
import { DraftWhereSchema } from "~/seller/draft/server/schema/DraftWhereSchema";

export const DraftQuerySchema = z
	.looseObject({
		cursor: CursorSchema.default({
			page: 0,
			size: 256,
		}).optional(),
		//
		filter: DraftWhereSchema.optional(),
		where: DraftWhereSchema.optional(),
		//
		sort: DraftSortSchema.array().optional(),
		limit: z.int().nonnegative().optional().meta({
			description:
				"Guardrail limit for collection size; usually set/overridden by the system",
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
