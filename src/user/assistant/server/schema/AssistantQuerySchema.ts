import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { AssistantFilterSchema } from "~/user/assistant/server/schema/AssistantFilterSchema";
import { AssistantSortSchema } from "~/user/assistant/server/schema/AssistantSortSchema";
import { AssistantWhereSchema } from "~/user/assistant/server/schema/AssistantWhereSchema";

export const AssistantQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: AssistantFilterSchema.optional(),
		where: AssistantWhereSchema.optional(),
		sort: AssistantSortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "AssistantQuery",
		description: "Query object for assistant collection",
	});

export type AssistantQuerySchema = typeof AssistantQuerySchema;

export namespace AssistantQuerySchema {
	export type Type = z.infer<AssistantQuerySchema>;
}
