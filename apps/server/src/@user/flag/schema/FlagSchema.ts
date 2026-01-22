import { z } from "@hono/zod-openapi";
import { FlagDbSchema } from "./FlagDbSchema";

export const FlagSchema = z
	.looseObject({
		...FlagDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.strip()
	.openapi("Flag", {
		description: "Flag data",
	});

export type FlagSchema = typeof FlagSchema;

export namespace FlagSchema {
	export type Type = z.infer<FlagSchema>;
}
