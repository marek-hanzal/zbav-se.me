import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/common/schema/CursorSchema";
import { UploadFilterSchema } from "~/server/@user/upload/schema/UploadFilterSchema";
import { UploadSortSchema } from "~/server/@user/upload/schema/UploadSortSchema";
import { UploadWhereSchema } from "~/server/@user/upload/schema/UploadWhereSchema";

export const UploadQuerySchema = z
	.looseObject({
		cursor: CursorSchema.optional(),
		filter: UploadFilterSchema.optional(),
		where: UploadWhereSchema.optional(),
		sort: UploadSortSchema.array().optional(),
	})
	.strip()
	.openapi("UploadQuery", {
		description: "Data for uploading a file",
	});

export type UploadQuerySchema = typeof UploadQuerySchema;

export namespace UploadQuerySchema {
	export type Type = z.infer<UploadQuerySchema>;
}
