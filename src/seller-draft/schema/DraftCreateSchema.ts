import { z } from "zod";

export const DraftCreateSchema = z
	.looseObject({
		//
	})
	// .strip()
	.meta({
		id: "DraftCreate",
		description: "Data for creating a new draft",
	});

export type DraftCreateSchema = typeof DraftCreateSchema;

export namespace DraftCreateSchema {
	export type Type = z.infer<DraftCreateSchema>;
}
