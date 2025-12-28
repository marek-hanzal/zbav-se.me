import { z } from "zod";

export const MessagePackageCreateSchema = z
	.object({
		messageThreadId: z.string().openapi({
			description: "The ID of the message thread to add a package to",
		}),
		link: z.url().openapi({
			description: "Package link",
		}),
		number: z.string().nullable().openapi({
			description: "Tracking number",
		}),
	})
	.openapi("MessagePackageCreate", {
		description: "Request to create a message package",
	});

export type MessagePackageCreateSchema = typeof MessagePackageCreateSchema;

export namespace MessagePackageCreateSchema {
	export type Type = z.infer<MessagePackageCreateSchema>;
}
