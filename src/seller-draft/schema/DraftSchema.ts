import { z } from "zod";
import { DraftTableSchema } from "~/database/schema/DraftTableSchema";
import { RestrictionEnumSchema } from "~/restriction/schema/RestrictionEnumSchema";
import { LocationSchema } from "~/session-location/schema/LocationSchema";
import { CategorySchema } from "~/user-category/schema/CategorySchema";

export const DraftSchema = z
	.looseObject({
		...DraftTableSchema.shape,
		location: LocationSchema.nullable(),
		category: CategorySchema.nullable(),
		withRestriction: RestrictionEnumSchema.meta({
			description: `
Effective restriction applied on the draft.
            `.trim(),
		}),
	})
	.omit({
		userId: true,
		galleryId: true,
		withLocation: true,
	})
	.strip()
	.meta({
		id: "Draft",
		description: "Draft data",
	});

export type DraftSchema = typeof DraftSchema;

export namespace DraftSchema {
	export type Type = z.infer<DraftSchema>;
}
