import { z } from "@hono/zod-openapi";
import { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";

export const InboxBuyerMessagePayloadSchema = z
	.object({
		type: InboxTypeEnumSchema.refine((t): t is "buyer-message" => t === "buyer-message", {
			message: `Expected "buyer-message"`,
		}),
		transactionId: z.string().openapi({
			description: "Related transaction identifier",
		}),
		messageThreadId: z.string().openapi({
			description: "Related message thread identifier",
		}),
	})
	.openapi("InboxBuyerMessagePayload", {
		description: "Payload for buyer message notifications",
	});

export type InboxBuyerMessagePayloadSchema = typeof InboxBuyerMessagePayloadSchema;

export namespace InboxBuyerMessagePayloadSchema {
	export type Type = z.infer<InboxBuyerMessagePayloadSchema>;
}
