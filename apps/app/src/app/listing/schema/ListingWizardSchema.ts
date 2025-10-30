import { zListingCreate } from "@zbav-se.me/sdk";
import z from "zod";

export const ListingWizardSchema = z.object({
	price: z.string().optional(),
	...zListingCreate
		.omit({
			price: true,
			currency: true,
		})
		.partial().shape,
});

export type ListingWizardSchema = typeof ListingWizardSchema;

export namespace ListingWizardSchema {
	export type Type = z.infer<ListingWizardSchema>;
}
