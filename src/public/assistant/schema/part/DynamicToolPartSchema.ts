import { z } from "zod";
import type { PartTypeEnumSchema } from "~/public/assistant/schema/part/PartTypeEnumSchema";

export const DynamicToolPartSchema = z
	.looseObject({
		type: z.literal("dynamic-tool" satisfies PartTypeEnumSchema.Type),
		toolName: z.string().min(1),
		toolCallId: z.string().min(1),
		title: z.string().optional(),
	})
	.strip();

export type DynamicToolPartSchema = typeof DynamicToolPartSchema;

export namespace DynamicToolPartSchema {
	export type Type = z.infer<DynamicToolPartSchema>;
}
