import { z } from "@hono/zod-openapi";
import { FlagTableSchema } from "~/database/@table/FlagTableSchema";

export const FlagSchema = z
	.looseObject({
		...FlagTableSchema.shape,
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
