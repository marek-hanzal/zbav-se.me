import { z } from "zod";

export const LoadEnumSchema = z
	.enum([
		"low",
		"medium",
		"high",
	])
	.meta({
		id: "LoadEnum",
		description: "Load bucket (active transaction count: low/medium/high)",
	});

export type LoadEnumSchema = typeof LoadEnumSchema;

export namespace LoadEnumSchema {
	export type Type = z.infer<LoadEnumSchema>;
}
