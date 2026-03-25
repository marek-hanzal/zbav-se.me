import { z } from "@hono/zod-openapi";
import { OrderEnumSchema } from "~/common/schema/OrderEnumSchema";

export const UploadSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.openapi("UploadSortField", {
				description: "Field for uploading a file",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.openapi("UploadSort", {
		description: "Data for uploading a file",
	});

export type UploadSortSchema = typeof UploadSortSchema;

export namespace UploadSortSchema {
	export type Type = z.infer<UploadSortSchema>;
}
