import { z } from "@hono/zod-openapi";
import { IgnoreDbSchema } from "~/app/ignore/schema/IgnoreDbSchema";

export const IgnoreSchema = z
	.object({
		...IgnoreDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("Ignore", {
		description: "Ignore data",
	});

export type IgnoreSchema = typeof IgnoreSchema;

export namespace IgnoreSchema {
	export type Type = z.infer<IgnoreSchema>;
}
