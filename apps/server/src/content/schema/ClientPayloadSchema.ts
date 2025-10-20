import { z } from "zod";

export const ClientPayloadSchema = z.object({
	listingId: z.string().min(1).optional(),
	sort: z.number(),
	checksum: z.string(),
});

export type ClientPayload = z.infer<typeof ClientPayloadSchema>;
