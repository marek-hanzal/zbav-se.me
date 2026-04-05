import { z } from "zod";

export const ToolPartSchema = z
	.looseObject({
		type: z.string().refine((v) => v.startsWith("tool-")),
		toolCallId: z.string().min(1),
		state: z.string().min(1),
		title: z.string().optional(),
	})
	.strip();

export type ToolPartSchema = typeof ToolPartSchema;

export namespace DynamicToolPartSchema {
	export type Type = z.infer<ToolPartSchema>;
}
