import { z } from "@hono/zod-openapi";
import { CountEnumSchema } from "@use-pico/common/schema";
import { DraftQuerySchema } from "~/@seller-user/draft/schema/DraftQuerySchema";

export const DraftCountQuerySchema = z
	.looseObject({
		...DraftQuerySchema.pick({
			filter: true,
			where: true,
		}).shape,
		count: CountEnumSchema.array().optional(),
	})
	.strip()
	.openapi("DraftCountQuery", {
		description: "Query object for draft count",
	});

export type DraftCountQuerySchema = typeof DraftCountQuerySchema;

export namespace DraftCountQuerySchema {
	export type Type = z.infer<DraftCountQuerySchema>;
}
