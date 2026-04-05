import { z } from "zod";
import { CursorSchema } from "@/lib/common/schema";
import { AssistantChatFilterSchema } from "~/user/assistant-chat/server/schema/AssistantChatFilterSchema";
import { AssistantChatSortSchema } from "~/user/assistant-chat/server/schema/AssistantChatSortSchema";
import { AssistantChatWhereSchema } from "~/user/assistant-chat/server/schema/AssistantChatWhereSchema";

export const AssistantChatQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: AssistantChatFilterSchema.optional(),
		where: AssistantChatWhereSchema.optional(),
		sort: AssistantChatSortSchema.array().optional(),
	})
	.strip()
	.meta({
		id: "AssistantQuery",
		description: "Query object for assistant collection",
	});

export type AssistantChatQuerySchema = typeof AssistantChatQuerySchema;

export namespace AssistantChatQuerySchema {
	export type Type = z.infer<AssistantChatQuerySchema>;
}
