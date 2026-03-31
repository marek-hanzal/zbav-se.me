import { z } from "zod";
import { EntrySchema } from "./EntrySchema";

export const LocationSchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: z.literal("location"),
		payload: z
			.looseObject({
				locationId: z.string().meta({
					description: "Location identifier linked to this entry",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "TransactionEntryLocationCreate",
	});

export type LocationSchema = typeof LocationSchema;

export namespace LocationSchema {
	export type Type = z.infer<LocationSchema>;
}
