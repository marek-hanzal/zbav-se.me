import z from "zod";
import { UploadDtoSchema } from "../../upload/schema/UploadDtoSchema";
import { GallerySchema } from "./GallerySchema";

export const GalleryDtoSchema = z
	.object({
		...GallerySchema.shape,
		upload: UploadDtoSchema,
	})
	.omit({
		userId: true,
		createdAt: true,
	})
	.openapi("GalleryDto", {
		description: "Gallery data transfer object",
	});

export type GalleryDtoSchema = typeof GalleryDtoSchema;

export namespace GalleryDtoSchema {
	export type Type = z.infer<GalleryDtoSchema>;
}
