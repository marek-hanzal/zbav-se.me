import { z } from "zod";

export const WarrantyEnumSchema = z
	.enum([
		"warranty",
		"no-warranty",
		"custom",
	])
	.meta({
		id: "WarrantyEnum",
		description: "Warranty type for the listing",
	});

export type WarrantyEnumSchema = typeof WarrantyEnumSchema;

export namespace WarrantyEnumSchema {
	export type Type = z.infer<WarrantyEnumSchema>;
}
