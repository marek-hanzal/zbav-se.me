import { z } from "@hono/zod-openapi";
import { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";

export const InboxFavouritePayloadSchema = z
	.object({
		type: InboxTypeEnumSchema.refine((t): t is "favourite" => t === "favourite", {
			message: `Expected "favourite"`,
		}),
		listingId: z.string().openapi({
			description: "Related listing identifier",
		}),
	})
	.openapi("InboxFavouritePayload", {
		description: "Payload for favourite notifications",
	});

export type InboxFavouritePayloadSchema = typeof InboxFavouritePayloadSchema;

export namespace InboxFavouritePayloadSchema {
	export type Type = z.infer<InboxFavouritePayloadSchema>;
}
