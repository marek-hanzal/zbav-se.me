import { z } from "zod";
import { AssistantFilterSchema } from "~/user/assistant/server/schema/AssistantFilterSchema";

export const AssistantWhereSchema = z
	.looseObject({
		...AssistantFilterSchema.shape,
	})
	.strip()
	.meta({
		id: "AssistantWhere",
		description: "App-based filters",
	});

export type AssistantWhereSchema = typeof AssistantWhereSchema;

export namespace AssistantWhereSchema {
	export type Type = z.infer<AssistantWhereSchema>;
}
