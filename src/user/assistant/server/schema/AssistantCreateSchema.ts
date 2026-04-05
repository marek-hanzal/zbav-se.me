import { z } from "zod";

export const AssistantCreateSchema = z
	.looseObject({
		payload: z.record(z.string(), z.unknown()),
	})
	.strip()
	.meta({
		id: "AssistantCreate",
		description: "Assistant create input",
	});

export type AssistantCreateSchema = typeof AssistantCreateSchema;

export namespace AssistantCreateSchema {
	export type Type = z.infer<AssistantCreateSchema>;
}
