import { z } from "@hono/zod-openapi";
import { FeedbackEnumSchema } from "~/app/feedback/schema/FeedbackEnumSchema";

export const FeedbackCreateSchema = z
	.looseObject({
		listingId: z.string().openapi({
			description: "ID of the listing",
		}),
		type: FeedbackEnumSchema,
	})
	.strip()
	.openapi("FeedbackCreate", {
		description: "Data for creating a new feedback",
	});

export type FeedbackCreateSchema = typeof FeedbackCreateSchema;

export namespace FeedbackCreateSchema {
	export type Type = z.infer<FeedbackCreateSchema>;
}
