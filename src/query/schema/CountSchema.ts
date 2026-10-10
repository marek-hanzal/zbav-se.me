import { z } from "zod";

export const CountSchema = z.int().nonnegative().meta({
	id: "Count",
	description: "Just number of items",
});

export type CountSchema = typeof CountSchema;

export namespace CountSchema {
	export type Type = z.infer<CountSchema>;
}
