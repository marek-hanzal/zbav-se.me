import { EntitySchema } from "@use-pico/common";
import z from "zod";

export const CategorySchema = z.object({
	...EntitySchema.shape,
	name: z.string(),
	sort: z.number(),
	categoryGroupId: z.string(),
});

export type CategorySchema = typeof CategorySchema;

export namespace CategorySchema {
	export type Type = z.infer<CategorySchema>;
}
