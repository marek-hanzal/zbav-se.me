import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common/schema";

export const UploadSortSchema = z
	.object({
		value: z.enum([
			"createdAt",
		]),
		sort: OrderSchema,
	})
	.openapi("UploadSort", {
		description: "Sort object for upload collection",
	});

export type UploadSortSchema = typeof UploadSortSchema;

export namespace UploadSortSchema {
	export type Type = z.infer<UploadSortSchema>;
}
