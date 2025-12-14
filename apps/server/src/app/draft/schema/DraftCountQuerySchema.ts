import type { z } from "@hono/zod-openapi";
import { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";

export const DraftCountQuerySchema = DraftQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("DraftCountQuery", {
	description: "Query object for draft count",
});

export type DraftCountQuerySchema = typeof DraftCountQuerySchema;

export namespace DraftCountQuerySchema {
	export type Type = z.infer<DraftCountQuerySchema>;
}
