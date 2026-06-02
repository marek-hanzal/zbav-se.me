import { z } from "zod";

export const ResourceBundleEnumSchema = z.enum([
	"free",
	"package:buyer",
	"season-founders",
]);

export type ResourceBundleEnumSchema = typeof ResourceBundleEnumSchema;

export namespace ResourceBundleEnumSchema {
	export type Type = z.infer<ResourceBundleEnumSchema>;
}
