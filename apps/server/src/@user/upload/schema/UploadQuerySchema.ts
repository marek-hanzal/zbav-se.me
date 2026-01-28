import { z } from "@hono/zod-openapi";
import { UploadFilterSchema } from "~/@user/upload/schema/UploadFilterSchema";
import { CursorSchema } from "~/schema/CursorSchema";
import { UploadSortSchema } from "~/@user/upload/schema/UploadSortSchema";
import { UploadWhereSchema } from "~/@user/upload/schema/UploadWhereSchema";

export const UploadQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: UploadFilterSchema.optional(),
		where: UploadWhereSchema.optional(),
		sort: UploadSortSchema.array().optional(),
	})
	.openapi("UploadQuery", {
		description: "Data for uploading a file",
	});

export type UploadQuerySchema = typeof UploadQuerySchema;

export namespace UploadQuerySchema {
	export type Type = z.infer<UploadQuerySchema>;
}
