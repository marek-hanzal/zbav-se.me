import { z } from "@hono/zod-openapi";
import { TransactionMessageGalleryCreateSchema } from "~/@user/transaction-message-gallery/schema/TransactionMessageGalleryCreateSchema";
import { TransactionMessageLocationCreateSchema } from "~/@user/transaction-message-location/schema/TransactionMessageLocationCreateSchema";
import { TransactionMessagePackageCreateSchema } from "~/@user/transaction-message-package/schema/TransactionMessagePackageCreateSchema";
import { TransactionMessagePersonalCreateSchema } from "~/@user/transaction-message-personal/schema/TransactionMessagePersonalCreateSchema";
import { TransactionMessageTextCreateSchema } from "~/@user/transaction-message-text/schema/TransactionMessageTextCreateSchema";

const MessageTextCreateInputSchema = TransactionMessageTextCreateSchema.extend({
	type: z.literal("text"),
}).openapi("MessageTextCreateInput");

const MessageGalleryCreateInputSchema = TransactionMessageGalleryCreateSchema.extend({
	type: z.literal("gallery"),
}).openapi("MessageGalleryCreateInput");

const MessageLocationCreateInputSchema = TransactionMessageLocationCreateSchema.extend({
	type: z.literal("location"),
}).openapi("MessageLocationCreateInput");

const MessagePackageCreateInputSchema = TransactionMessagePackageCreateSchema.extend({
	type: z.literal("package"),
}).openapi("MessagePackageCreateInput");

const MessagePersonalCreateInputSchema = TransactionMessagePersonalCreateSchema.extend({
	type: z.literal("personal"),
}).openapi("MessagePersonalCreateInput");

export const MessageCreateSchema = z
	.discriminatedUnion("type", [
		MessageTextCreateInputSchema,
		MessageGalleryCreateInputSchema,
		MessageLocationCreateInputSchema,
		MessagePackageCreateInputSchema,
		MessagePersonalCreateInputSchema,
	])
	.openapi("MessageCreate", {
		description: "Request to create a message within a transaction",
	});

export type MessageCreateSchema = typeof MessageCreateSchema;

export namespace MessageCreateSchema {
	export type Type = z.infer<MessageCreateSchema>;
}
