import { z } from "zod";
import { ActivityWhereSchema } from "./ActivityWhereSchema";

export const ActivityToolWhereSchema = z
	.looseObject({
		...ActivityWhereSchema.shape,
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

export type ActivityToolWhereSchema = typeof ActivityToolWhereSchema;

export namespace ActivityToolWhereSchema {
	export type Type = z.infer<ActivityToolWhereSchema>;
}
