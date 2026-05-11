import { z } from "zod";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { DraftTableSchema } from "~/server/database/@table/DraftTableSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";
import { CategorySchema } from "~/user/category/server/schema/CategorySchema";

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
