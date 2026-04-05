import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

export const AssistantSortSchema = z
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

export type AssistantSortSchema = typeof AssistantSortSchema;

export namespace AssistantSortSchema {
	export type Type = z.infer<AssistantSortSchema>;

	export type Field = Type["field"];
}
