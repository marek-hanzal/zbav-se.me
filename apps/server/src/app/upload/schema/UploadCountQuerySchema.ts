import type { z } from "@hono/zod-openapi";
import { UploadQuerySchema } from "./UploadQuerySchema";

export const UploadCountQuerySchema = UploadQuerySchema.pick({
	filter: true,
	where: true,
}).openapi("UploadCountQuery", {
	description: "Query object for upload count",
});

export type UploadCountQuerySchema = typeof UploadCountQuerySchema;

export namespace UploadCountQuerySchema {
	export type Type = z.infer<UploadCountQuerySchema>;
}
