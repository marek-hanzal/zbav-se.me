import { z } from "zod";
import { FieldQuerySchema } from "./FieldQuerySchema";

export const FieldCountQuerySchema = z
	.looseObject({
		...FieldQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "FieldCountQuery",
		description: "Query object for field count",
	});

export type FieldCountQuerySchema = typeof FieldCountQuerySchema;

export namespace FieldCountQuerySchema {
	export type Type = z.infer<FieldCountQuerySchema>;
}
