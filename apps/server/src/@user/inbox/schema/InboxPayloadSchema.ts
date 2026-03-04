import { z } from "@hono/zod-openapi";
import { InboxBuyerMessagePayloadSchema } from "~/@user/inbox/schema/payload/InboxBuyerMessagePayloadSchema";
import { InboxFavouritePayloadSchema } from "~/@user/inbox/schema/payload/InboxFavouritePayloadSchema";
import { InboxSellerMessagePayloadSchema } from "~/@user/inbox/schema/payload/InboxSellerMessagePayloadSchema";
import { InboxThumbPayloadSchema } from "~/@user/inbox/schema/payload/InboxThumbPayloadSchema";
import { InboxUnfavouritePayloadSchema } from "~/@user/inbox/schema/payload/InboxUnfavouritePayloadSchema";

export const InboxPayloadSchema = z
	.xor([
		InboxSellerMessagePayloadSchema,
		InboxBuyerMessagePayloadSchema,
		InboxThumbPayloadSchema,
		InboxFavouritePayloadSchema,
		InboxUnfavouritePayloadSchema,
	])
	.openapi("InboxPayload", {
		description: "Inbox payload per type",
	});

export type InboxPayloadSchema = typeof InboxPayloadSchema;

export namespace InboxPayloadSchema {
	export type Type = z.infer<InboxPayloadSchema>;
}
