import { z } from "zod";
import { OrderEnumSchema } from "~/query/schema/OrderEnumSchema";

export const UploadSortSchema = z
	.looseObject({
		field: z
			.enum([
				"createdAt",
			])
			.meta({
				id: "PublicUploadSortField",
				description: "Field of the public upload sort",
			}),
		order: OrderEnumSchema,
	})
	.strip()
	.meta({
		id: "PublicUploadSort",
		description: "Sort object for public upload collection",
	});

export type UploadSortSchema = typeof UploadSortSchema;

export namespace UploadSortSchema {
	export type Type = z.infer<UploadSortSchema>;
}
