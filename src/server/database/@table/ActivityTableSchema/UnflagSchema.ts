import { z } from "zod";
import { ActivitySchema } from "./ActivitySchema";

export const UnflagSchema = z
	.looseObject({
		...ActivitySchema.shape,
		family: z.literal("reaction"),
		type: z.literal("unflag"),
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
		id: "ActivityUnflag",
		description: "Activity reaction event for unflag",
	});

export type UnflagSchema = typeof UnflagSchema;

export namespace UnflagSchema {
	export type Type = z.infer<UnflagSchema>;
}
