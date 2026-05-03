import { z } from "zod";

export const DeliveryEnumSchema = z
	.enum([
		"personal",
		"post",
		"package",
		"other",
	])
	.meta({
		id: "DeliveryEnum",
		description: "Delivery method for the listing",
	});

export type DeliveryEnumSchema = typeof DeliveryEnumSchema;

export namespace DeliveryEnumSchema {
	export type Type = z.infer<DeliveryEnumSchema>;
}
