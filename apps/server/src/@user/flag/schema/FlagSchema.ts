import { z } from "@hono/zod-openapi";
import { FlagDbSchema } from "~/app/flag/schema/FlagDbSchema";

export const FlagSchema = z
	.object({
		...FlagDbSchema.shape,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("Flag", {
		description: "Flag data",
	});

export type FlagSchema = typeof FlagSchema;

export namespace FlagSchema {
	export type Type = z.infer<FlagSchema>;
}
