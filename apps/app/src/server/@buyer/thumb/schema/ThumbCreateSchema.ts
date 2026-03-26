import { z } from "@hono/zod-openapi";
import { ThumbEnumSchema } from "~/server/database/@enum/ThumbEnumSchema";

export const ThumbCreateSchema = z
	.looseObject({
		listingId: z.string().openapi({
			description: "ID of the listing",
		}),
		type: ThumbEnumSchema,
	})
	.strip()
	.openapi("ThumbCreate", {
		description: "Data for creating a new thumb",
	});

export type ThumbCreateSchema = typeof ThumbCreateSchema;

export namespace ThumbCreateSchema {
	export type Type = z.infer<ThumbCreateSchema>;
}
