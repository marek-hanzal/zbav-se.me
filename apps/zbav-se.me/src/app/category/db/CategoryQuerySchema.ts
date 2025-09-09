import { FilterSchema, withQuerySchema } from "@use-pico/common";
import z from "zod";

export const CategoryQuerySchema = withQuerySchema({
	filter: z.object({
		...FilterSchema.shape,
		name: z.string().nullish(),
		categoryGroupId: z.string().nullish(),
	}),
	sort: [
		"name",
		"sort",
	],
});

export type CategoryQuerySchema = typeof CategoryQuerySchema;

export namespace CategoryQuerySchema {
	export type Type = z.infer<typeof CategoryQuerySchema>;
}
