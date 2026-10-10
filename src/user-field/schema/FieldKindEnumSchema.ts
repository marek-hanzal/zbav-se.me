import { z } from "zod";

export const FieldKindEnumSchema = z
	.enum([
		/**
		 * This field is promoted to UI, so user is likely to fill it
		 */
		"recommended",
		/**
		 * Optional fields are hidden, making them really pure "optional" (non obtrusive).
		 */
		"optional",
	])
	.meta({
		id: "FieldKindEnum",
		description:
			"Is the field recommended for filling or just an optional field for better discoverability?",
	});

export type FieldKindEnumSchema = typeof FieldKindEnumSchema;

export namespace FieldKindEnumSchema {
	export type Type = z.infer<FieldKindEnumSchema>;
}
