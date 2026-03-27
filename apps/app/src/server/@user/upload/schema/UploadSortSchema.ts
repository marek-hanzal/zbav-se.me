import { OrderEnumSchema } from "@use-pico/common/schema";
import { z } from "zod";

export const UploadSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.meta({
				id: "UploadSortField",
				description: "Field for uploading a file",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "UploadSort",
		description: "Data for uploading a file",
	});

export type UploadSortSchema = typeof UploadSortSchema;

export namespace UploadSortSchema {
	export type Type = z.infer<UploadSortSchema>;
}
