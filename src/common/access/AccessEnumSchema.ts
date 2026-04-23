import { z } from "zod";

export const AccessEnumSchema = z
	.enum([
		"public",
		"protected",
		"private",
	])
	.meta({
		id: "AccessEnum",
		description: "Visibility of a resource",
	});

export type AccessEnumSchema = typeof AccessEnumSchema;

export namespace AccessEnumSchema {
	export type Type = z.infer<AccessEnumSchema>;
}
