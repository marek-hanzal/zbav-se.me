import { z } from "zod";
import { DynamicToolPartSchema } from "./part/DynamicToolPartSchema";
import { FilePartSchema } from "./part/FilePartSchema";
import { ReasoningPartSchema } from "./part/ReasoningPartSchema";
import { SourceDocumentPartSchema } from "./part/SourceDocumentPartSchema";
import { SourceUrlPartSchema } from "./part/SourceUrlPartSchema";
import { StepStartPartSchema } from "./part/StepStartPartSchema";
import { TextPartSchema } from "./part/TextPartSchema";
import { ToolPartSchema } from "./part/ToolPartSchema";

export const ChatPartSchema = z.union([
	DynamicToolPartSchema,
	FilePartSchema,
	ReasoningPartSchema,
	SourceDocumentPartSchema,
	SourceUrlPartSchema,
	StepStartPartSchema,
	TextPartSchema,
	ToolPartSchema,
]);

export type ChatPartSchema = typeof ChatPartSchema;

export namespace ChatPartSchema {
	export type Type = z.infer<ChatPartSchema>;
}
