import type { z } from "zod";
import { AssistantTableSchema } from "~/server/database/@table/AssistantTableSchema";

export const AssistantSchema = AssistantTableSchema.meta({
	id: "Assistant",
	description: "Assistant data",
});

export type AssistantSchema = typeof AssistantSchema;

export namespace AssistantSchema {
	export type Type = z.infer<AssistantSchema>;
}
