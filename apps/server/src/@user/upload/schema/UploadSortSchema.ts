import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/schema/OrderEnumSchema";

export const UploadSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("UploadSortField", {
				description: "Field for uploading a file",
			}),
		order: OrderEnumSchema,
	})
	.openapi("UploadSort", {
		description: "Data for uploading a file",
	});

export type UploadSortSchema = typeof UploadSortSchema;

export namespace UploadSortSchema {
	export type Type = z.infer<UploadSortSchema>;
}
