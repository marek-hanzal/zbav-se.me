import { z } from "@hono/zod-openapi";
import { ThumbEnumSchema } from "~/app/thumb/schema/ThumbEnumSchema";

export const ThumbCreateSchema = z
	.object({
		listingId: z.string().openapi({
			description: "ID of the listing",
		}),
		type: ThumbEnumSchema,
	})
	.openapi("ThumbCreate", {
		description: "Data for creating a new thumb",
	});

export type ThumbCreateSchema = typeof ThumbCreateSchema;

export namespace ThumbCreateSchema {
	export type Type = z.infer<ThumbCreateSchema>;
}
