import { z } from "@hono/zod-openapi";
import { EntrySchema } from "./EntrySchema";

export const LocationSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: z.literal("location"),
		payload: z
			.looseObject({
				locationId: z.string().openapi({
					description: "Location identifier linked to this entry",
				}),
			})
			.strip(),
	})
	.strip()
	.openapi("TransactionEntryLocationCreate");

export type LocationSchema = typeof LocationSchema;

export namespace LocationSchema {
	export type Type = z.infer<LocationSchema>;
}
