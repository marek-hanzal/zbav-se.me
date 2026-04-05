import { z } from "zod";
import { FilterSchema } from "@/lib/common/schema";

export const AssistantFilterSchema = z
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

export type AssistantFilterSchema = typeof AssistantFilterSchema;

export namespace AssistantFilterSchema {
	export type Type = z.infer<AssistantFilterSchema>;
}
