import { z } from "@hono/zod-openapi";
import { InboxTypeEnumSchema } from "~/database/@enum/InboxTypeEnumSchema";

export const InboxUnfavouritePayloadSchema = z
	.object({
		type: InboxTypeEnumSchema.refine((t): t is "unfavourite" => t === "unfavourite", {
			message: `Expected "unfavourite"`,
		}),
		listingId: z.string().openapi({
			description: "Related listing identifier",
		}),
	})
	.openapi("InboxUnfavouritePayload", {
		description: "Payload for unfavourite notifications",
	});

export type InboxUnfavouritePayloadSchema = typeof InboxUnfavouritePayloadSchema;

export namespace InboxUnfavouritePayloadSchema {
	export type Type = z.infer<InboxUnfavouritePayloadSchema>;
}
