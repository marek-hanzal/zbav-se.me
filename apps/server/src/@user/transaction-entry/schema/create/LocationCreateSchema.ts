import { z } from "@hono/zod-openapi";
import { BaseCreateSchema } from "./BaseCreateSchema";

export const LocationCreateSchema = z
	.looseObject({
		...BaseCreateSchema.shape,
		kind: z.literal("location"),
		payload: z.looseObject({
			locationId: z.string().openapi({
				description: "Location identifier linked to this entry",
			}),
		}),
	})
	.openapi("TransactionEntryLocationCreate");

export type LocationCreateSchema = typeof LocationCreateSchema;

export namespace LocationCreateSchema {
	export type Type = z.infer<LocationCreateSchema>;
}
