import { z } from "zod";

type ToolPartType = `tool-${string}`;

export const ToolPartSchema = z
	.looseObject({
		type: z.string().refine((v): v is ToolPartType => v.startsWith("tool-")),
		toolCallId: z.string().min(1),
		state: z.string().min(1),
		title: z.string().optional(),
	})
	.strip();

export type ToolPartSchema = typeof ToolPartSchema;

export namespace DynamicToolPartSchema {
	export type Type = z.infer<ToolPartSchema>;
}
