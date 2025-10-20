import { z } from "zod";

export const ListingGalleryPayload = z.object({
	listingId: z.string().min(1),
	sort: z.number(),
	checksum: z.string(),
});

export type ListingGalleryPayload = typeof ListingGalleryPayload;

export namespace ListingGalleryPayload {
	export type Type = z.infer<ListingGalleryPayload>;
}
