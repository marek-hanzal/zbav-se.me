import { z } from "zod";

export const CountSchema = z
	.looseObject({
		where: z.coerce.number().meta({
			description: "Number of items filtered out by 'where' filter",
		}),
		filter: z.coerce.number().meta({
			description:
				"Actual number of items returned by the  query ('where' + 'filter' / other system-wide conditions)",
		}),
		total: z.coerce.number().meta({
			description: "Actual total available (unfiltered) items to the user",
		}),
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
