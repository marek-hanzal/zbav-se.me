import { EntitySchema } from "@use-pico/common";
import z from "zod";

export const CategoryGroupSchema = z.object({
	...EntitySchema.shape,
	name: z.string(),
	sort: z.number(),
});

export type CategoryGroupSchema = typeof CategoryGroupSchema;

export namespace CategoryGroupSchema {
	export type Type = z.infer<CategoryGroupSchema>;
}
