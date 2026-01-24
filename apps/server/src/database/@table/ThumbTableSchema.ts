import { z } from "@hono/zod-openapi";
import { ThumbEnumSchema } from "~/@user/thumb/schema/ThumbEnumSchema";

export const ThumbTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the thumb entry",
	}),
	userId: z.string().openapi({
		description: "ID of the user who provided the thumb",
	}),
	listingId: z.string().openapi({
		description: "ID of the listing",
	}),
	type: ThumbEnumSchema.openapi({
		description: "Type of thumb",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type ThumbTableSchema = typeof ThumbTableSchema;

export namespace ThumbTableSchema {
	export type Type = z.infer<ThumbTableSchema>;
}
