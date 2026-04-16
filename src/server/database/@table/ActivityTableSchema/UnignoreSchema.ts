import { z } from "zod";
import { ActivitySchema } from "./ActivitySchema";

export const UnignoreSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: z.literal("reaction"),
		type: z.literal("unignore"),
		payload: z
			.looseObject({
				listingId: z.string().meta({
					description: "Related listing identifier",
				}),
			})
			.strip(),
	})
	.strip()
	.meta({
		id: "ActivityUnignore",
		description: "Activity reaction event for unignore",
	});

export type UnignoreSchema = typeof UnignoreSchema;

export namespace UnignoreSchema {
	export type Type = z.infer<UnignoreSchema>;
}
