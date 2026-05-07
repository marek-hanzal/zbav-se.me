import { z } from "zod";
import { OrderEnumSchema } from "@/lib/common/schema";

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
