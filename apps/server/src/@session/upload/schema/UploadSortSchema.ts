import { z } from "@hono/zod-openapi";
import { OrderSchema } from "../../../schema/OrderSchema";

export const UploadSortSchema = z
	.object({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("UploadSortField", {
				description: "Field for uploading a file",
			}),
		direction: OrderSchema,
	})
	.openapi("UploadSort", {
		description: "Data for uploading a file",
	});

export type UploadSortSchema = typeof UploadSortSchema;

export namespace UploadSortSchema {
	export type Type = z.infer<UploadSortSchema>;
}
