import { z } from "@hono/zod-openapi";
import { OrderSchema } from "@use-pico/common";
import { CursorSchema } from "../../schema/CursorSchema";
import { DefaultFilterSchema } from "../../schema/DefaultFilterSchema";

const FilterSchema = z
	.object({
		...DefaultFilterSchema.shape,
	})
	.openapi("UploadFilter", {
		description: "User-land filters for upload items",
	});

export const UploadQuerySchema = z
	.object({
		cursor: CursorSchema.nullish(),
		filter: FilterSchema.nullish(),
		where: FilterSchema.openapi("UploadWhere", {
			description: "App-based filters",
		}).nullish(),
		sort: z
			.object({
				value: z.enum([
					"createdAt",
				]),
				sort: OrderSchema,
			})
			.openapi("UploadSort", {
				description: "Sort object for upload collection",
			})
			.array()
			.nullish(),
	})
	.openapi("UploadQuery", {
		description: "Query object for upload collection",
	});

export type UploadQuerySchema = typeof UploadQuerySchema;

export namespace UploadQuerySchema {
	export type Type = z.infer<typeof UploadQuerySchema>;
}
