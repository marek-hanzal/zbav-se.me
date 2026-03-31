import { z } from "zod";

export const CountSchema = z
	.looseObject({
		where: z.coerce.number(),
		filter: z.coerce.number(),
		total: z.coerce.number(),
		isEmpty: z.boolean(),
		isFilterEmpty: z.boolean(),
	})
	.strip()
	.meta({
		id: "Count",
		description: "Count data",
	});

export type CountSchema = typeof CountSchema;

export namespace CountSchema {
	export type Type = z.infer<typeof CountSchema>;
}
