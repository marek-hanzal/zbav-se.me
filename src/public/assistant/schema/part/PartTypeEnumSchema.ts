import { z } from "zod";

export const PartTypeEnumSchema = z.enum([
	"text",
	"reasoning",
	"dynamic-tool",
	"source-url",
	"source-document",
]);

export type PartTypeEnumSchema = typeof PartTypeEnumSchema;

export namespace PartTypeEnumSchema {
	export type Type = z.infer<PartTypeEnumSchema>;
}
