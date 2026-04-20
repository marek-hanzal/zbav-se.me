import { z } from "zod";
import { ActivityFilterSchema } from "./ActivityFilterSchema";

export const ActivityToolFilterSchema = z
	.looseObject({
		...ActivityFilterSchema.shape,
		timestampGte: z.iso.datetime().optional().meta({
			description: "Lower timestamp bound",
		}),
		timestampLte: z.iso.datetime().optional().meta({
			description: "Upper timestamp bound",
		}),
	})
	.omit({
		idIn: true,
		userId: true,
	})
	.strip();

export type ActivityToolFilterSchema = typeof ActivityToolFilterSchema;

export namespace ActivityToolFilterSchema {
	export type Type = z.infer<ActivityToolFilterSchema>;
}
