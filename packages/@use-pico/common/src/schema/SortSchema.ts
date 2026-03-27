import { z } from "zod";
import { OrderEnumSchema } from "./OrderEnumSchema";

// Generic sort schema that can accept any field names
export type SortSchema<T extends Record<string, any> = Record<string, any>> = z.ZodObject<T>;

// Default sort schema that accepts any string keys with OrderEnumSchema values
export const DefaultSortSchema = z.record(z.string(), OrderEnumSchema).meta({
	id: "DefaultSort",
	description: "Default sort object keyed by field name",
});

export type DefaultSortSchema = z.infer<typeof DefaultSortSchema>;

export namespace SortSchema {
	export type Type = z.infer<typeof DefaultSortSchema>;
}
