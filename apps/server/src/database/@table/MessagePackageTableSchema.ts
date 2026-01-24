import { z } from "@hono/zod-openapi";

export const MessagePackageTableSchema = z.object({
	id: z.string().openapi({
		description: "ID of the message package entry",
	}),
	userId: z.string().openapi({
		description: "ID of the user who sent the message",
	}),
	messageThreadId: z.string().openapi({
		description: "ID of the message thread referenced by the message",
	}),
	link: z.url().openapi({
		description: "Package link",
	}),
	number: z.string().nullable().openapi({
		description: "Tracking number",
	}),
	createdAt: z.coerce.date().openapi({
		description: "Creation timestamp",
		type: "string",
	}),
});

export type MessagePackageTableSchema = typeof MessagePackageTableSchema;

export namespace MessagePackageTableSchema {
	export type Type = z.infer<MessagePackageTableSchema>;
}
