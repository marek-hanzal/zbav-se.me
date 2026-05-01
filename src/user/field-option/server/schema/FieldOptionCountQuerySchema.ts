import { z } from "zod";
import { FieldOptionQuerySchema } from "./FieldOptionQuerySchema";

export const FieldOptionCountQuerySchema = z
	.looseObject({
		...FieldOptionQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
	})
	.strip()
	.meta({
		id: "FieldOptionCountQuery",
		description: "Query object for field-option count",
	});

export type FieldOptionCountQuerySchema = typeof FieldOptionCountQuerySchema;

export namespace FieldOptionCountQuerySchema {
	export type Type = z.infer<FieldOptionCountQuerySchema>;
}
