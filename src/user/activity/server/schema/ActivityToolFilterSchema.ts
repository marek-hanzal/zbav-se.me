import { z } from "zod";
import { ActivityFilterSchema } from "./ActivityFilterSchema";

export const ActivityToolFilterSchema = z
	.looseObject({
		...ActivityFilterSchema.shape,
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
