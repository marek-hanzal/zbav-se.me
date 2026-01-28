import { z } from "@hono/zod-openapi";
import { IgnoreTableSchema } from "~/database/@table/IgnoreTableSchema";

export const IgnoreSchema = z
	.looseObject({
		...IgnoreTableSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.strip()
	.openapi("Ignore", {
		description: "Ignore data",
	});

export type IgnoreSchema = typeof IgnoreSchema;

export namespace IgnoreSchema {
	export type Type = z.infer<IgnoreSchema>;
}
