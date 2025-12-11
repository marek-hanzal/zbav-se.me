import { z } from "@hono/zod-openapi";
import { CursorSchema } from "~/schema/CursorSchema";
import { UploadFilterSchema } from "~/app/upload/schema/UploadFilterSchema";
import { UploadSortSchema } from "./UploadSortSchema";

export const UploadQuerySchema = z
	.object({
		cursor: CursorSchema.optional(),
		filter: UploadFilterSchema.optional(),
		where: UploadFilterSchema.openapi("UploadWhere", {
			description: "App-based filters",
		}).optional(),
		sort: UploadSortSchema.array().optional(),
	})
	.openapi("UploadQuery", {
		description: "Data for uploading a file",
	});

export type UploadQuerySchema = typeof UploadQuerySchema;

export namespace UploadQuerySchema {
	export type Type = z.infer<UploadQuerySchema>;
}
