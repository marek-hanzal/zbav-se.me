import { z } from "zod";

/**
 * Base definition of filter schema which should all the Sources implement.
 *
 * @group schema
 */
export const WhereSchema = z
	.looseObject({
		/**
		 * Basically any entity should have an ID, thus it's present in the default schema.
		 */
		id: z.string().min(1).nullish(),
		/**
		 * Option to get entities by an array of IDs.
		 */
		idIn: z.array(z.string().min(1)).nullish(),
		/**
		 * Usually it's somehow possible to search for the Entity by some text, thus it's present,
		 * but not necessarily required.
		 */
		fulltext: z.array(z.string().min(1)).nullish(),
	})
	.strip()
	.meta({
		id: "Where",
		description: "Base filter every entity should understand",
	});

export type WhereSchema = typeof WhereSchema;

export namespace WhereSchema {
	export type Type = z.infer<WhereSchema>;
}
