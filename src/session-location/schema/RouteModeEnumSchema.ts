import { z } from "zod";

export const RouteModeEnumSchema = z
	.enum([
		"drive",
		"walk",
		"bicycle",
		"truck",
	])
	.default("drive")
	.meta({
		id: "RouteModeEnum",
		description: "Travel mode for route distance calculation",
	});

export type RouteModeEnumSchema = typeof RouteModeEnumSchema;

export namespace RouteModeEnumSchema {
	export type Type = z.infer<RouteModeEnumSchema>;
}
