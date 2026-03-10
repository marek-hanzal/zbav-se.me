import { z } from "@hono/zod-openapi";
import { GallerySchema as DatabaseGallerySchema } from "~/database/@table/TransactionEntryTableSchema/GallerySchema";
import { EntrySchema } from "./EntrySchema";

export const GallerySchema = z
	.looseObject({
		...EntrySchema.shape,
		kind: DatabaseGallerySchema.shape.kind,
		payload: DatabaseGallerySchema.shape.payload,
	})
	.strip()
	.openapi("TransactionEntryGallery");
