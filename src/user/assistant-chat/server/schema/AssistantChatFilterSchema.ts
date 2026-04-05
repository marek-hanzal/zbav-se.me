import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const AssistantChatFilterSchema = z
	.looseObject({
		...FilterSchema.shape,
		userId: z.string().optional().meta({
			description: "Exact user id",
		}),
	})
	.strip()
	.meta({
		id: "AssistantFilter",
		description: "Filter object for assistant collection",
	});

export type AssistantChatFilterSchema = typeof AssistantChatFilterSchema;

export namespace AssistantChatFilterSchema {
	export type Type = z.infer<AssistantChatFilterSchema>;
}
