import { z } from "@hono/zod-openapi";
import { IgnoreDbSchema } from "./IgnoreDbSchema";

export const IgnoreSchema = z
	.looseObject({
		...IgnoreDbSchema.shape,
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
