import z from "zod";
import { ListingSchema } from "./ListingSchema";

export const ListingDtoSchema = z
	.object({
		...ListingSchema.shape,
		upload: z.jwt().openapi({
			description:
				"Token used to upload the listing image; don't be afraid, it's short-lived.",
		}),
	})
	.openapi("ListingDto");

export type ListingDtoSchema = typeof ListingDtoSchema;

export namespace ListingDtoSchema {
	export type Type = z.infer<ListingDtoSchema>;
}
