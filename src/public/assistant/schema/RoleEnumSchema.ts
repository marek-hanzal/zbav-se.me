import { z } from "zod";

export const RoleEnumSchema = z.enum([
	"system",
	"user",
	"assistant",
]);

export type RoleEnumSchema = typeof RoleEnumSchema;

export namespace RoleEnumSchema {
	export type Type = z.infer<RoleEnumSchema>;
}
