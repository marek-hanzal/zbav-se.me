import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const AssistantChatSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.meta({
				id: "AssistantSortField",
				description: "Field of the assistant sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "AssistantSort",
		description: "Sort object for assistant collection",
	});

export type AssistantChatSortSchema = typeof AssistantChatSortSchema;

export namespace AssistantChatSortSchema {
	export type Type = z.infer<AssistantChatSortSchema>;

	export type Field = Type["field"];
}
