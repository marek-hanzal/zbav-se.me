import { z } from "zod";
import { DraftQuerySchema } from "./DraftQuerySchema";
import { DraftToolFilterSchema } from "./DraftToolFilterSchema";

export const DraftToolQuerySchema = z
	.looseObject({
		...DraftQuerySchema.shape,
		filter: DraftToolFilterSchema.optional(),
		where: DraftToolFilterSchema.optional(),
	})
	.omit({
		where: true,
		limit: true,
	})
	.strip();

export type DraftToolQuerySchema = typeof DraftToolQuerySchema;

export namespace DraftToolQuerySchema {
	export type Type = z.infer<DraftToolQuerySchema>;
}
