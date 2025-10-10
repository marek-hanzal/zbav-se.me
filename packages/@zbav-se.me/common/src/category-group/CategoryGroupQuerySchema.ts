import { FilterSchema, withQuerySchema } from "@use-pico/common";
import z from "zod";

export const CategoryGroupQuerySchema = withQuerySchema({
	filter: z.object({
		...FilterSchema.shape,
		name: z.string().nullish(),
	}),
	sort: [
		"name",
		"sort",
	],
});

export type CategoryGroupQuerySchema = typeof CategoryGroupQuerySchema;

export namespace CategoryGroupQuerySchema {
	export type Type = z.infer<typeof CategoryGroupQuerySchema>;
}
