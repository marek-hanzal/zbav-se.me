import { z } from "@hono/zod-openapi";
import { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";
import { ThumbEnumSchema } from "~/database/@enum/ThumbEnumSchema";

export const InboxThumbPayloadSchema = z
	.object({
		type: InboxTypeEnumSchema.refine((t): t is "thumb" => t === "thumb", {
			message: `Expected "thumb"`,
		}),
		listingId: z.string().openapi({
			description: "Listing identifier",
		}),
		thumb: ThumbEnumSchema,
	})
	.openapi("InboxThumbPayload", {
		description: "Payload for thumb notifications",
	});

export type InboxThumbPayloadSchema = typeof InboxThumbPayloadSchema;

export namespace InboxThumbPayloadSchema {
	export type Type = z.infer<InboxThumbPayloadSchema>;
}
