import { z } from "@hono/zod-openapi";
import { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";

export const InboxSellerMessagePayloadSchema = z
	.object({
		type: InboxTypeEnumSchema.refine((t): t is "seller-message" => t === "seller-message", {
			message: `Expected "seller-message"`,
		}),
		transactionId: z.string().openapi({
			description: "Related transaction identifier",
		}),
	})
	.openapi("InboxSellerMessagePayload", {
		description: "Payload for seller message notifications",
	});

export type InboxSellerMessagePayloadSchema = typeof InboxSellerMessagePayloadSchema;

export namespace InboxSellerMessagePayloadSchema {
	export type Type = z.infer<InboxSellerMessagePayloadSchema>;
}
