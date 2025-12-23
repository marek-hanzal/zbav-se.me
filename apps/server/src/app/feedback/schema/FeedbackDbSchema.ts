import { z } from "@hono/zod-openapi";
import { FeedbackEnumSchema } from "./FeedbackEnumSchema";

export const FeedbackDbSchema = z.object({
	id: z.string().openapi({
		description: "ID of the feedback entry",
	}),
	userId: z.string().openapi({
		description: "ID of the user who provided the feedback",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing",
	}),
	type: FeedbackEnumSchema.openapi({
		description: "Type of feedback",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type FeedbackDbSchema = typeof FeedbackDbSchema;

export namespace FeedbackDbSchema {
	export type Type = z.infer<FeedbackDbSchema>;
}
