import { z } from "zod";

export const PartTypeEnumSchema = z.enum([
	"dynamic-tool",
	"file",
	"reasoning",
	"source-document",
	"source-url",
	"step-start",
	"text",
]);

export type PartTypeEnumSchema = typeof PartTypeEnumSchema;

export namespace PartTypeEnumSchema {
	export type Type = z.infer<PartTypeEnumSchema>;
}
