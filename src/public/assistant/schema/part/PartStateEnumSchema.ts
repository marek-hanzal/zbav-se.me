import { z } from "zod";

export const PartStateEnumSchema = z.enum([
	"streaming",
	"done",
]);

export type PartStateEnumSchema = typeof PartStateEnumSchema;

export namespace PartStateEnumSchema {
	export type Type = z.infer<PartStateEnumSchema>;
}
