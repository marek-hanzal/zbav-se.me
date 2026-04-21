import { z } from "zod";

export const CategoryRestrictionEnumSchema = z
	.enum([
		"none",
		"adult-relaxed",
		"adult",
		"sensitive",
		"restricted",
	])
	.meta({
		id: "CategoryRestrictionEnum",
		description: `
Defines restriction levels on categories (so on listings).

Enum is ordered in restriction weight (e.g. adult > adult-relaxed).

Meanings:
- none - no restriction at all
- adult-relaxed - adult content, but may be clicked out (e.g. "Yes, I'm 18+")
- adult - adult hard gate
- sensitive - adult stuff, but may need more attention, e.g. airsoft stuff
- restricted - needs some legal documents/proof to operate with the item (e.g. weapons)
        `.trim(),
	});

export type CategoryRestrictionEnumSchema = typeof CategoryRestrictionEnumSchema;

export namespace CategoryRestrictionEnumSchema {
	export type Type = z.infer<CategoryRestrictionEnumSchema>;
}
