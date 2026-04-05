import { z } from "zod";
import { DynamicToolPartSchema } from "./part/DynamicToolPartSchema";
import { ReasoningPartSchema } from "./part/ReasoningPartSchema";
import { SourceDocumentPartSchema } from "./part/SourceDocumentPartSchema";
import { SourceUrlPartSchema } from "./part/SourceUrlPartSchema";
import { TextPartSchema } from "./part/TextPartSchema";

export const ChatPartSchema = z.discriminatedUnion("type", [
	TextPartSchema,
	ReasoningPartSchema,
	DynamicToolPartSchema,
	SourceUrlPartSchema,
	SourceDocumentPartSchema,
]);

export type ChatPartSchema = typeof ChatPartSchema;

export namespace ChatPartSchema {
	export type Type = z.infer<ChatPartSchema>;
}
